export interface FloodZoneResult {
  zone: string;
  subtype: string;
  isSpecialHazard: boolean;
  firmPanel: string;
  riskLabel: string;
  riskLevel: "low" | "low to medium" | "medium" | "high" | "very high";
  description: string;
  lat?: number;
  lng?: number;
  source: "fema_nfhl" | "fallback";
  error?: string;
}

export function interpretFloodZone(
  zone: string,
  subtype = ""
): Pick<FloodZoneResult, "riskLabel" | "riskLevel" | "description"> {
  const z = zone.toUpperCase().trim();
  const s = subtype.toUpperCase();

  if (z === "X" && s.includes("0.2")) {
    return {
      riskLabel: "Moderate Flood Hazard (500-Year)",
      riskLevel: "medium",
      description:
        "Property is within the 500-year floodplain. Flood insurance generally not required for federally backed loans.",
    };
  }

  if (z === "X") {
    return {
      riskLabel: "Minimal Flood Hazard",
      riskLevel: "low",
      description:
        "Property is outside the 500-year floodplain. Lowest-risk FEMA flood zone designation — favorable for development.",
    };
  }

  if (["AE", "AH", "AO", "AR"].includes(z)) {
    return {
      riskLabel: "Special Flood Hazard Area — 100-Year",
      riskLevel: "high",
      description: `Zone ${zone}: 1% annual chance of flooding. Base Flood Elevation determined. Flood insurance required for federally backed loans.`,
    };
  }

  if (z === "A") {
    return {
      riskLabel: "Special Flood Hazard Area — 100-Year (No BFE)",
      riskLevel: "high",
      description:
        "1% annual chance of flooding. No Base Flood Elevation determined. Flood insurance required for federally backed loans.",
    };
  }

  if (z.startsWith("V")) {
    return {
      riskLabel: "Coastal High Hazard Area",
      riskLevel: "very high",
      description:
        "Coastal high hazard area subject to wave action. Highest-risk FEMA designation. Flood insurance required.",
    };
  }

  if (z === "D") {
    return {
      riskLabel: "Undetermined Flood Risk",
      riskLevel: "medium",
      description:
        "Flood hazard has not been studied for this area. Risk is undetermined — treat as potential moderate risk.",
    };
  }

  return {
    riskLabel: `Zone ${zone}`,
    riskLevel: "medium",
    description: "Consult the FEMA FIRM map for detailed flood zone information for this property.",
  };
}
