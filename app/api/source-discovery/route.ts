import type { NextRequest } from "next/server";
import { discoverArcGISSources } from "@/lib/discovery/arcgisDiscovery";
import { generateCandidateRoots } from "@/lib/discovery/searchQueries";
import type { SourceDiscoveryResult } from "@/types/sources";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") ?? "";
  const county = searchParams.get("county") ?? "";
  const state = searchParams.get("state") ?? "";

  if (!city && !county) {
    return Response.json(
      { error: "city or county is required" },
      { status: 400 }
    );
  }

  const candidateRoots = generateCandidateRoots(city, county, state);
  const sources = await discoverArcGISSources(city, county, state);

  const byType: Partial<Record<string, number>> = {};
  for (const s of sources) {
    byType[s.type] = (byType[s.type] ?? 0) + 1;
  }

  const result: SourceDiscoveryResult = {
    sources,
    total: sources.length,
    byType,
    discoveredAt: new Date().toISOString(),
    candidatesProbed: candidateRoots.length,
  };

  return Response.json(result);
}
