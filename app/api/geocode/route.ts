import type { NextRequest } from "next/server";
import { geocodeWithCensus } from "@/lib/geocoding/censusGeocoder";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address?.trim()) {
    return Response.json({ error: "address parameter is required" }, { status: 400 });
  }

  const result = await geocodeWithCensus(address.trim());

  if (!result.success) {
    return Response.json(result, { status: 404 });
  }

  return Response.json(result);
}
