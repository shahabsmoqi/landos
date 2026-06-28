import type { NormalizedDemographics } from "@/types/normalized";

export function formatIncome(income: number | null): string {
  if (!income) return "N/A";
  return `$${income.toLocaleString()}`;
}

export function formatRate(rate: number | null): string {
  if (rate == null) return "N/A";
  return `${(rate * 100).toFixed(1)}%`;
}

export function demographicsSummary(demo: NormalizedDemographics): string {
  const parts: string[] = [];
  if (demo.population) parts.push(`Pop. ${demo.population.toLocaleString()}`);
  if (demo.medianHouseholdIncome)
    parts.push(`Median HHI ${formatIncome(demo.medianHouseholdIncome)}`);
  if (demo.ownerOccupiedRate != null)
    parts.push(`${formatRate(demo.ownerOccupiedRate)} owner-occupied`);
  return parts.join(" · ") || "No data";
}
