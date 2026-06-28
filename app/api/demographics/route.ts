import type { NextRequest } from "next/server";
import { fetchDemographicsForTract } from "@/lib/sources/censusData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state");
  const county = searchParams.get("county");
  const tract = searchParams.get("tract");

  if (!state || !county || !tract) {
    return Response.json(
      { error: "state, county, and tract are required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.CENSUS_API_KEY;
  const result = await fetchDemographicsForTract(state, county, tract, apiKey);

  if (!result) {
    return Response.json(
      { error: "Census demographics unavailable for this tract" },
      { status: 404 }
    );
  }

  return Response.json(result);
}
