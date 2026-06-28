import type { NextRequest } from "next/server";
import { geocodeWithCensus } from "@/lib/geocoding/censusGeocoder";
import { fetchFEMAByLatLng } from "@/lib/sources/fema";
import { fetchDemographicsForTract } from "@/lib/sources/censusData";
import { discoverArcGISSources } from "@/lib/discovery/arcgisDiscovery";
import { normalizeFEMA } from "@/lib/normalizers/floodNormalizer";
import { fetchParcelumByAddress } from "@/lib/providers/parcelum";
import { fetchRegridByAddress } from "@/lib/providers/regrid";
import type { PropertyIntelligence } from "@/types/normalized";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address?.trim()) {
    return Response.json({ error: "address parameter is required" }, { status: 400 });
  }

  const missingData: string[] = [];
  const fallbacksUsed: string[] = [];

  // Step 1: Geocode
  const geocode = await geocodeWithCensus(address.trim());

  if (!geocode.success || !geocode.latitude || !geocode.longitude) {
    return Response.json(
      {
        address,
        geocode,
        flood: null,
        demographics: null,
        parcel: null,
        zoning: null,
        discoveredSources: [],
        permits: [],
        utilities: [],
        confidenceSummary: {
          geocoder: "missing",
          flood: "missing",
          demographics: "missing",
          parcel: "missing",
          zoning: "missing",
        },
        missingData: ["geocode", "flood", "demographics", "parcel", "zoning"],
        fallbacksUsed: ["demo"],
        fetchedAt: new Date().toISOString(),
        mode: "demo",
      } satisfies PropertyIntelligence,
      { status: 422 }
    );
  }

  const lat = geocode.latitude;
  const lng = geocode.longitude;

  // Steps 2–5 in parallel: FEMA, Census demographics, Parcelum parcel, Regrid parcel+zoning, ArcGIS discovery
  const [floodRaw, demographicsResult, parcelumResult, regridResult, discoveryResult] =
    await Promise.allSettled([
      fetchFEMAByLatLng(lat, lng),
      geocode.state && geocode.county && geocode.tract
        ? fetchDemographicsForTract(
            geocode.state,
            geocode.county,
            geocode.tract,
            process.env.CENSUS_API_KEY
          )
        : Promise.resolve(null),
      fetchParcelumByAddress(address.trim(), lat, lng),
      fetchRegridByAddress(address.trim(), lat, lng),
      discoverArcGISSources(
        geocode.city ?? "",
        geocode.countyName ?? geocode.county ?? "",
        geocode.stateAbbr ?? geocode.state ?? ""
      ),
    ]);

  const flood =
    floodRaw.status === "fulfilled"
      ? normalizeFEMA(floodRaw.value, lat, lng)
      : null;
  if (!flood) missingData.push("flood");

  const demographics =
    demographicsResult.status === "fulfilled" ? demographicsResult.value : null;
  if (!demographics) missingData.push("demographics");

  // Prefer Parcelum for TX (direct CAD data), fall back to Regrid
  const parcelumData = parcelumResult.status === "fulfilled" ? parcelumResult.value : null;
  const regridData = regridResult.status === "fulfilled" ? regridResult.value : { parcel: null, zoning: null };
  const parcel = parcelumData ?? regridData.parcel;
  const zoning = regridData.zoning;
  if (!parcel) missingData.push("parcel");
  if (!zoning) missingData.push("zoning");

  const discoveredSources =
    discoveryResult.status === "fulfilled" ? discoveryResult.value : [];
  if (!discoveredSources.length) missingData.push("gis-sources");

  const intelligence: PropertyIntelligence = {
    address,
    geocode,
    flood,
    demographics,
    parcel,
    zoning,
    discoveredSources,
    permits: [],
    utilities: [],
    confidenceSummary: {
      geocoder: geocode.success ? "live" : "missing",
      flood: flood ? "live" : "missing",
      demographics: demographics ? "live" : "missing",
      parcel: parcel ? "live" : "missing",
      zoning: zoning ? "live" : "missing",
    },
    missingData,
    fallbacksUsed,
    fetchedAt: new Date().toISOString(),
    mode: "live",
  };

  return Response.json(intelligence);
}
