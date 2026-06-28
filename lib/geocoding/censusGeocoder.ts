import type { GeocodingResult } from "@/types/geocoding";

interface CensusMatch {
  matchedAddress: string;
  coordinates: { x: number; y: number };
  geographies?: {
    "Census Tracts"?: Array<{
      GEOID: string;
      TRACT: string;
      COUNTY: string;
      STATE: string;
      NAME: string;
    }>;
    States?: Array<{ STUSAB: string; NAME: string; STATE: string }>;
    Counties?: Array<{ NAME: string; COUNTY: string; STATE: string }>;
    "Census Block Groups"?: Array<{ BLKGRP: string }>;
  };
}

interface CensusGeocodeResponse {
  result?: {
    addressMatches?: CensusMatch[];
  };
}

export async function geocodeWithCensus(address: string): Promise<GeocodingResult> {
  const url = new URL(
    "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress"
  );
  url.searchParams.set("address", address);
  url.searchParams.set("benchmark", "Public_AR_Current");
  url.searchParams.set("vintage", "Current_Current");
  url.searchParams.set(
    "layers",
    "Census Tracts,Counties,States,Census Block Groups"
  );
  url.searchParams.set("format", "json");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent": "LandOS/1.0 (thelonestarcapitalpartners@gmail.com)",
      },
    });
    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`Census API returned ${res.status}`);
    }

    const data = (await res.json()) as CensusGeocodeResponse;
    const matches = data.result?.addressMatches ?? [];

    if (!matches.length) {
      return {
        success: false,
        inputAddress: address,
        matchStatus: "no-match",
        confidence: 0,
        provider: "census",
        error: "No address match found in Census TIGER/MAF database",
      };
    }

    const match = matches[0];
    const geos = match.geographies ?? {};
    const tract = geos["Census Tracts"]?.[0];
    const state = geos["States"]?.[0];
    const county = geos["Counties"]?.[0];
    const blockGroup = geos["Census Block Groups"]?.[0];

    // e.g. "2600 DAVE ANGEL RD, BURLESON, TX, 76028" → parts[1] = "BURLESON"
    const parts = match.matchedAddress.split(",").map((s) => s.trim());
    const city = parts.length >= 2 ? parts[1] : undefined;
    const lastPart = parts[parts.length - 1] ?? "";
    const zipMatch = lastPart.match(/\b(\d{5})\b/);

    return {
      success: true,
      inputAddress: address,
      matchedAddress: match.matchedAddress,
      latitude: match.coordinates.y,
      longitude: match.coordinates.x,
      state: state?.STATE ?? tract?.STATE,
      stateAbbr: state?.STUSAB,
      county: tract?.COUNTY ?? county?.COUNTY,
      countyName: county?.NAME,
      tract: tract?.TRACT,
      blockGroup: blockGroup?.BLKGRP,
      zip: zipMatch?.[1],
      city,
      matchStatus: "exact",
      confidence: 95,
      provider: "census",
    };
  } catch (err) {
    clearTimeout(timer);
    return {
      success: false,
      inputAddress: address,
      matchStatus: "error",
      confidence: 0,
      provider: "census",
      error: err instanceof Error ? err.message : "Geocoding failed",
    };
  }
}
