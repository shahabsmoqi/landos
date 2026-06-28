import type { NextRequest } from "next/server";
import { fetchParcelumByAddress } from "@/lib/providers/parcelum";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");

  if (!address?.trim()) {
    return Response.json({ error: "address parameter is required" }, { status: 400 });
  }

  if (!isFinite(lat) || !isFinite(lng)) {
    return Response.json({ error: "lat and lng parameters are required" }, { status: 400 });
  }

  const parcel = await fetchParcelumByAddress(address.trim(), lat, lng);

  if (!parcel) {
    return Response.json(
      { error: "No parcel record found", configured: Boolean(process.env.PARCELUM_API_KEY) },
      { status: 404 }
    );
  }

  return Response.json(parcel);
}
