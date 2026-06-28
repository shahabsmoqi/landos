import { interpretFloodZone } from "@/lib/floodZone";
import type { RawFEMAFloodResult } from "@/lib/sources/fema";
import type { NormalizedFlood } from "@/types/normalized";

export function normalizeFEMA(
  raw: RawFEMAFloodResult | null,
  lat?: number,
  lng?: number
): NormalizedFlood | null {
  if (!raw) return null;

  const interpretation = interpretFloodZone(raw.zone, raw.subtype);

  return {
    zoneCode: raw.zone,
    zoneSubtype: raw.subtype,
    sfha: raw.isSpecialHazard,
    firmPanel: raw.firmPanel,
    riskLevel: interpretation.riskLevel,
    riskLabel: interpretation.riskLabel,
    description: interpretation.description,
    sourceUrl:
      "https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28",
    sourceConfidence: "live",
    lastChecked: new Date().toISOString(),
    lat,
    lng,
  };
}
