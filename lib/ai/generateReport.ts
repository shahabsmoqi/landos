/**
 * AI Investment Report Generator
 * Uses Together.ai OpenAI-compatible API (AI_API_KEY)
 * Override base URL via AI_API_BASE_URL, model via AI_MODEL
 */

import type { PropertyIntelligence } from "@/types/normalized";

const DEFAULT_BASE_URL = "https://api.ollama.com";
const DEFAULT_MODEL = "llama3.2";

export interface AiReportSection {
  id: string;
  title: string;
  content: string[];
}

function buildContext(intel: PropertyIntelligence): string {
  const lines: string[] = [`Address: ${intel.address}`];

  if (intel.geocode?.countyName)
    lines.push(`County: ${intel.geocode.countyName}${intel.geocode.stateAbbr ? `, ${intel.geocode.stateAbbr}` : ""}`);
  if (intel.geocode?.city) lines.push(`City: ${intel.geocode.city}`);

  if (intel.parcel?.acreage != null)
    lines.push(`Parcel Size: ${intel.parcel.acreage.toFixed(2)} acres`);
  if (intel.parcel?.landSqft)
    lines.push(`Land Sqft: ${intel.parcel.landSqft.toLocaleString()} sqft`);
  if (intel.parcel?.improvementSqft)
    lines.push(`Improvement Sqft: ${intel.parcel.improvementSqft.toLocaleString()} sqft`);
  if (intel.parcel?.assessedValue)
    lines.push(`Assessed Value: $${intel.parcel.assessedValue.toLocaleString()}`);
  if (intel.parcel?.marketValue)
    lines.push(`Market Value: $${intel.parcel.marketValue.toLocaleString()}`);
  if (intel.parcel?.yearBuilt) lines.push(`Year Built: ${intel.parcel.yearBuilt}`);
  if (intel.parcel?.propertyUse) lines.push(`Property Use: ${intel.parcel.propertyUse}`);
  if (intel.parcel?.ownerName) lines.push(`Owner: ${intel.parcel.ownerName}`);

  if (intel.zoning?.zoningCode)
    lines.push(
      `Zoning: ${intel.zoning.zoningCode}${intel.zoning.zoningName ? ` — ${intel.zoning.zoningName}` : ""}`
    );
  if (intel.zoning?.jurisdiction) lines.push(`Zoning Jurisdiction: ${intel.zoning.jurisdiction}`);
  if (intel.zoning?.allowedUses?.length)
    lines.push(`Allowed Uses: ${intel.zoning.allowedUses.join(", ")}`);

  if (intel.flood)
    lines.push(
      `Flood Zone: ${intel.flood.zoneCode} (${intel.flood.riskLabel}) — SFHA: ${intel.flood.sfha ? "Yes" : "No"}`
    );

  if (intel.demographics?.medianHouseholdIncome)
    lines.push(`Median HH Income (Census Tract): $${intel.demographics.medianHouseholdIncome.toLocaleString()}`);
  if (intel.demographics?.population)
    lines.push(`Tract Population: ${intel.demographics.population.toLocaleString()}`);
  if (intel.demographics?.ownerOccupiedRate != null)
    lines.push(`Owner-Occupied Rate: ${(intel.demographics.ownerOccupiedRate * 100).toFixed(1)}%`);

  return lines.join("\n");
}

const SYSTEM_PROMPT = `You are a senior real estate investment analyst at a land development firm. Write a concise, professional investment memo for a raw land parcel using only the data provided — never fabricate statistics. Format your response as valid JSON with this exact structure (no markdown fences, just JSON):

{"sections":[{"id":"executive_summary","title":"Executive Summary","content":["paragraph 1","paragraph 2"]},{"id":"market_overview","title":"Market Overview","content":["paragraph 1","paragraph 2"]},{"id":"parcel_analysis","title":"Parcel Analysis","content":["paragraph 1","paragraph 2"]},{"id":"zoning_entitlement","title":"Zoning & Entitlement Analysis","content":["paragraph 1","paragraph 2"]},{"id":"flood_environmental","title":"Flood & Environmental Risk","content":["paragraph 1"]},{"id":"development_opportunity","title":"Development Opportunity","content":["paragraph 1","paragraph 2"]},{"id":"risk_factors","title":"Risk Factors","content":["paragraph 1","paragraph 2"]},{"id":"recommendation","title":"Investment Recommendation","content":["paragraph 1"]}]}

Each paragraph should be 3–5 sentences. If a data field is unknown, omit it rather than guessing. Be analytical and specific.`;

export async function generateInvestmentReport(
  intelligence: PropertyIntelligence
): Promise<AiReportSection[]> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) throw new Error("AI_API_KEY not configured");

  const baseUrl = process.env.AI_API_BASE_URL ?? DEFAULT_BASE_URL;
  const model = process.env.AI_MODEL ?? DEFAULT_MODEL;

  const context = buildContext(intelligence);

  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Generate an investment memo for:\n\n${context}` },
      ],
      stream: false,
      options: {
        temperature: 0.25,
        num_predict: 2400,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`AI API ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    message?: { content?: string };
    choices?: Array<{ message?: { content?: string } }>;
  };
  // Ollama native: data.message.content  |  OpenAI compat fallback: data.choices[0].message.content
  const text = data.message?.content ?? data.choices?.[0]?.message?.content ?? "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI response did not contain JSON");

  const parsed = JSON.parse(jsonMatch[0]) as { sections: AiReportSection[] };
  if (!Array.isArray(parsed.sections)) throw new Error("Unexpected AI response shape");

  return parsed.sections;
}
