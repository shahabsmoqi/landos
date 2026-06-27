import type { NextRequest } from "next/server";
import { interpretFloodZone } from "@/lib/floodZone";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");

  let lat: number;
  let lng: number;

  if (latParam && lngParam) {
    lat = parseFloat(latParam);
    lng = parseFloat(lngParam);
    if (isNaN(lat) || isNaN(lng)) {
      return Response.json({ error: "Invalid lat/lng" }, { status: 400 });
    }
  } else if (address) {
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
        {
          headers: {
            "User-Agent": "LandOS/1.0 (thelonestarcapitalpartners@gmail.com)",
            "Accept-Language": "en",
          },
        }
      );

      if (!geoRes.ok) throw new Error("Geocoding request failed");

      const geoData = await geoRes.json();
      if (!geoData.length) {
        return Response.json({ error: "Address not found" }, { status: 404 });
      }

      lat = parseFloat(geoData[0].lat);
      lng = parseFloat(geoData[0].lon);
    } catch {
      return Response.json({ error: "Geocoding failed" }, { status: 502 });
    }
  } else {
    return Response.json({ error: "Provide address or lat/lng" }, { status: 400 });
  }

  try {
    const femaUrl = new URL(
      "https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28/query"
    );
    femaUrl.searchParams.set("geometry", `${lng},${lat}`);
    femaUrl.searchParams.set("geometryType", "esriGeometryPoint");
    femaUrl.searchParams.set("inSR", "4326");
    femaUrl.searchParams.set("spatialRel", "esriSpatialRelIntersects");
    femaUrl.searchParams.set("outFields", "FLD_ZONE,FLD_ZONE_SUBTY,SFHA_TF,FIRM_PAN,FIRM_ID");
    femaUrl.searchParams.set("returnGeometry", "false");
    femaUrl.searchParams.set("f", "json");

    const femaRes = await fetch(femaUrl.toString(), {
      headers: { "User-Agent": "LandOS/1.0" },
    });

    if (!femaRes.ok) throw new Error("FEMA API request failed");

    const femaData = await femaRes.json();

    if (!femaData.features?.length) {
      // Outside mapped area — treat as minimal risk
      return Response.json({
        zone: "X",
        subtype: "AREA OF MINIMAL FLOOD HAZARD",
        isSpecialHazard: false,
        firmPanel: "N/A",
        ...interpretFloodZone("X"),
        lat,
        lng,
        source: "fema_nfhl",
      });
    }

    const attrs = femaData.features[0].attributes;
    const zone: string = attrs.FLD_ZONE ?? "X";
    const subtype: string = attrs.FLD_ZONE_SUBTY ?? "";
    const isSpecialHazard: boolean = attrs.SFHA_TF === "T";
    const firmPanel: string = attrs.FIRM_PAN ?? attrs.FIRM_ID ?? "N/A";

    return Response.json({
      zone,
      subtype,
      isSpecialHazard,
      firmPanel,
      ...interpretFloodZone(zone, subtype),
      lat,
      lng,
      source: "fema_nfhl",
    });
  } catch {
    return Response.json({ error: "FEMA API unavailable" }, { status: 502 });
  }
}
