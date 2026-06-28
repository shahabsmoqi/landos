import type { NextRequest } from "next/server";
import { fetchZillowListings } from "@/lib/providers/hasdata";
import { fetchMLSListings } from "@/lib/providers/bridge";
import type { NormalizedListing } from "@/types/normalized";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") ?? "";
  const state = searchParams.get("state") ?? "";
  const lat = parseFloat(searchParams.get("lat") ?? "0");
  const lng = parseFloat(searchParams.get("lng") ?? "0");

  const [zillowResult, mlsResult] = await Promise.allSettled([
    city && state ? fetchZillowListings(city, state) : Promise.resolve([]),
    lat && lng ? fetchMLSListings(lat, lng) : Promise.resolve([]),
  ]);

  const listings: NormalizedListing[] = [
    ...(zillowResult.status === "fulfilled" ? zillowResult.value : []),
    ...(mlsResult.status === "fulfilled" ? mlsResult.value : []),
  ];

  return Response.json({ listings, total: listings.length });
}
