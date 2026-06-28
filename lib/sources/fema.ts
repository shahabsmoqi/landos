export interface RawFEMAFloodResult {
  zone: string;
  subtype: string;
  isSpecialHazard: boolean;
  firmPanel: string;
}

interface FEMAQueryResponse {
  features?: Array<{
    attributes: {
      FLD_ZONE?: string;
      FLD_ZONE_SUBTY?: string;
      SFHA_TF?: string;
      FIRM_PAN?: string;
      FIRM_ID?: string;
    };
  }>;
  error?: { code: number; message: string };
}

export async function fetchFEMAByLatLng(
  lat: number,
  lng: number
): Promise<RawFEMAFloodResult | null> {
  const url = new URL(
    "https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28/query"
  );
  url.searchParams.set("geometry", `${lng},${lat}`);
  url.searchParams.set("geometryType", "esriGeometryPoint");
  url.searchParams.set("inSR", "4326");
  url.searchParams.set("spatialRel", "esriSpatialRelIntersects");
  url.searchParams.set("outFields", "FLD_ZONE,FLD_ZONE_SUBTY,SFHA_TF,FIRM_PAN,FIRM_ID");
  url.searchParams.set("returnGeometry", "false");
  url.searchParams.set("f", "json");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { "User-Agent": "LandOS/1.0" },
    });
    clearTimeout(timer);

    if (!res.ok) return null;

    const data = (await res.json()) as FEMAQueryResponse;

    if (!data.features?.length) {
      // Outside mapped area — treat as minimal risk Zone X
      return {
        zone: "X",
        subtype: "AREA OF MINIMAL FLOOD HAZARD",
        isSpecialHazard: false,
        firmPanel: "N/A",
      };
    }

    const attrs = data.features[0].attributes;
    return {
      zone: attrs.FLD_ZONE ?? "X",
      subtype: attrs.FLD_ZONE_SUBTY ?? "",
      isSpecialHazard: attrs.SFHA_TF === "T",
      firmPanel: attrs.FIRM_PAN ?? attrs.FIRM_ID ?? "N/A",
    };
  } catch {
    clearTimeout(timer);
    return null;
  }
}
