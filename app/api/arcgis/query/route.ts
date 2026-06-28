import type { NextRequest } from "next/server";
import { queryByPoint } from "@/lib/arcgis/query";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    endpointUrl,
    layerId,
    lat,
    lng,
    outFields,
  } = body as Record<string, unknown>;

  if (!endpointUrl || layerId === undefined || !lat || !lng) {
    return Response.json(
      { error: "endpointUrl, layerId, lat, and lng are required" },
      { status: 400 }
    );
  }

  try {
    const result = await queryByPoint({
      endpointUrl: String(endpointUrl),
      layerId: Number(layerId),
      lat: Number(lat),
      lng: Number(lng),
      outFields: outFields ? String(outFields) : undefined,
    });

    return Response.json(result);
  } catch {
    return Response.json({ error: "ArcGIS query failed" }, { status: 502 });
  }
}
