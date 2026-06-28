import type { NextRequest } from "next/server";
import { generateInvestmentReport } from "@/lib/ai/generateReport";
import type { PropertyIntelligence } from "@/types/normalized";

export async function POST(request: NextRequest) {
  if (!process.env.AI_API_KEY) {
    return Response.json({ error: "AI_API_KEY not configured" }, { status: 503 });
  }

  let intelligence: PropertyIntelligence;
  try {
    intelligence = (await request.json()) as PropertyIntelligence;
  } catch {
    return Response.json({ error: "invalid JSON body" }, { status: 400 });
  }

  if (!intelligence?.address) {
    return Response.json({ error: "intelligence.address required" }, { status: 400 });
  }

  try {
    const sections = await generateInvestmentReport(intelligence);
    return Response.json({ sections });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
