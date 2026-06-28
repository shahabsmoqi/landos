import type { NormalizedDemographics } from "@/types/normalized";

type ACSRow = string[];

const ACS_YEAR = 2022;
const ACS_VARIABLES = [
  "NAME",
  "B01003_001E", // Total population
  "B19013_001E", // Median household income
  "B25003_001E", // Total occupied housing units
  "B25003_002E", // Owner-occupied
  "B25003_003E", // Renter-occupied
  "B01002_001E", // Median age
];

export async function fetchDemographicsForTract(
  state: string,
  county: string,
  tract: string,
  apiKey?: string
): Promise<NormalizedDemographics | null> {
  const url = new URL(`https://api.census.gov/data/${ACS_YEAR}/acs/acs5`);
  url.searchParams.set("get", ACS_VARIABLES.join(","));
  url.searchParams.set("for", `tract:${tract}`);
  url.searchParams.set("in", `state:${state} county:${county}`);
  if (apiKey) url.searchParams.set("key", apiKey);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { "User-Agent": "LandOS/1.0" },
    });
    clearTimeout(timer);

    if (!res.ok) return null;

    const data = (await res.json()) as ACSRow[];
    if (!data || data.length < 2) return null;

    const headers = data[0];
    const values = data[1];

    const get = (key: string): number | null => {
      const idx = headers.indexOf(key);
      if (idx < 0) return null;
      const v = parseInt(values[idx], 10);
      return isNaN(v) || v < 0 ? null : v;
    };

    const totalHouseholds = get("B25003_001E");
    const ownerOccupied = get("B25003_002E");
    const renterOccupied = get("B25003_003E");

    return {
      tract,
      blockGroup: "",
      population: get("B01003_001E"),
      medianHouseholdIncome: get("B19013_001E"),
      ownerOccupiedHouseholds: ownerOccupied,
      renterOccupiedHouseholds: renterOccupied,
      totalHouseholds,
      ownerOccupiedRate:
        totalHouseholds && ownerOccupied != null
          ? ownerOccupied / totalHouseholds
          : null,
      renterOccupiedRate:
        totalHouseholds && renterOccupied != null
          ? renterOccupied / totalHouseholds
          : null,
      medianAge: get("B01002_001E"),
      sourceUrl: url.toString(),
      sourceConfidence: "live",
      year: ACS_YEAR,
    };
  } catch {
    clearTimeout(timer);
    return null;
  }
}
