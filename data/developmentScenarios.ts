export type Complexity = "Low" | "Medium" | "High" | "Very High";
export type RiskLevel = "Low" | "Medium" | "High" | "Very High";

export interface DevelopmentScenario {
  id: string;
  name: string;
  shortName: string;
  units: string;
  complexity: Complexity;
  timelineMin: number;
  timelineMax: number;
  timelineLabel: string;
  capitalMin: number;
  capitalMax: number;
  capitalLabel: string;
  entitlementRisk: RiskLevel;
  upside: string;
  fitScore: number;
  description: string;
  pros: string[];
  cons: string[];
  keySteps: string[];
  recommended: boolean;
}

export const developmentScenarios: DevelopmentScenario[] = [
  {
    id: "hold",
    name: "Hold Existing Property",
    shortName: "Hold",
    units: "N/A",
    complexity: "Low",
    timelineMin: 0,
    timelineMax: 0,
    timelineLabel: "Indefinite",
    capitalMin: 0,
    capitalMax: 50000,
    capitalLabel: "$0–$50K",
    entitlementRisk: "Low",
    upside: "Appreciation",
    fitScore: 65,
    description:
      "Retain the property as-is. Collect any agricultural exemption, lease it, or wait for land value appreciation as the area develops around it.",
    pros: [
      "No entitlement or construction risk",
      "Agricultural exemption may reduce tax burden",
      "Land values rising in DFW metro",
      "Optionality — sell or develop later",
    ],
    cons: [
      "No near-term cash flow from development",
      "Opportunity cost of capital",
      "Inflation and carry costs",
      "Market conditions may shift",
    ],
    keySteps: ["Verify ag exemption status", "Explore lease options", "Monitor comparable land sales quarterly"],
    recommended: false,
  },
  {
    id: "estate",
    name: "Estate Lot Subdivision",
    shortName: "Estate Lots",
    units: "5–8 lots",
    complexity: "Medium",
    timelineMin: 9,
    timelineMax: 15,
    timelineLabel: "9–15 months",
    capitalMin: 300000,
    capitalMax: 900000,
    capitalLabel: "$300K–$900K",
    entitlementRisk: "Medium",
    upside: "Moderate",
    fitScore: 82,
    description:
      "Divide the 14-acre parcel into 5–8 large lots (1.5–2.5 acres each) targeting estate homebuyers. Lower entitlement complexity and infrastructure burden make this the fastest path to exit.",
    pros: [
      "Lower complexity vs. dense subdivision",
      "Fits current county jurisdiction",
      "Strong demand for rural estate lots in DFW",
      "Lower infrastructure cost per lot",
      "Faster timeline to exit",
    ],
    cons: [
      "Lower overall revenue potential",
      "Fewer lots = less margin",
      "Depends on utilities availability",
      "Survey and platting still required",
    ],
    keySteps: [
      "Confirm jurisdiction and platting requirements",
      "Order boundary survey",
      "Request utility availability letters",
      "Prepare lot concept plan",
      "Submit minor subdivision plat",
    ],
    recommended: true,
  },
  {
    id: "residential",
    name: "Residential Subdivision",
    shortName: "Subdivision",
    units: "20–35 lots",
    complexity: "High",
    timelineMin: 18,
    timelineMax: 30,
    timelineLabel: "18–30 months",
    capitalMin: 1000000,
    capitalMax: 3000000,
    capitalLabel: "$1M–$3M",
    entitlementRisk: "High",
    upside: "High",
    fitScore: 78,
    description:
      "Full residential subdivision targeting 7,000–10,000 sqft lots. Requires engineering, drainage design, utility planning, and likely rezoning. Higher risk but significantly higher revenue potential.",
    pros: [
      "Significantly higher revenue potential",
      "Builder-friendly product type",
      "Strong regional demand",
      "Multiple exit strategies",
    ],
    cons: [
      "Rezoning likely required",
      "Heavy infrastructure investment",
      "Engineering and drainage complexity",
      "Long timeline",
      "HOA and deed restriction setup",
    ],
    keySteps: [
      "Confirm jurisdiction and rezoning path",
      "Pre-development meeting with city/county",
      "ALTA survey and geotechnical study",
      "Drainage and traffic study",
      "Rezoning / PD application",
      "Preliminary and final plat",
      "Civil construction plans and permits",
    ],
    recommended: false,
  },
  {
    id: "townhome",
    name: "Townhome / Higher Density",
    shortName: "Townhomes",
    units: "50–90 units",
    complexity: "Very High",
    timelineMin: 24,
    timelineMax: 42,
    timelineLabel: "24–42 months",
    capitalMin: 3000000,
    capitalMax: 8000000,
    capitalLabel: "$3M+",
    entitlementRisk: "Very High",
    upside: "Very High",
    fitScore: 61,
    description:
      "High-density attached residential (townhomes or garden-style). Would require rezoning to a planned development or PD-MF designation, full utility extension, and significant infrastructure. Best suited if the site is annexed into city limits.",
    pros: [
      "Highest revenue potential",
      "Addresses regional housing shortage",
      "May qualify for development incentives",
      "Strong demand for attainable housing",
    ],
    cons: [
      "Requires annexation or city partnership",
      "Very high entitlement complexity",
      "Significant capital requirement",
      "Long approval timeline",
      "High opposition risk from neighbors",
      "Utility extension cost may be prohibitive",
    ],
    keySteps: [
      "Annexation petition or city outreach",
      "PD rezoning application",
      "Traffic impact analysis",
      "Utility capacity study",
      "Neighborhood meeting",
      "Full engineering package",
      "Final plat and construction permits",
    ],
    recommended: false,
  },
  {
    id: "special",
    name: "Special Use / Event / Retreat",
    shortName: "Special Use",
    units: "N/A",
    complexity: "Medium",
    timelineMin: 6,
    timelineMax: 18,
    timelineLabel: "6–18 months",
    capitalMin: 150000,
    capitalMax: 700000,
    capitalLabel: "$150K–$700K",
    entitlementRisk: "Medium",
    upside: "Moderate–High",
    fitScore: 70,
    description:
      "Convert the property into a wedding venue, corporate retreat, glamping compound, equestrian facility, or private event campus. Can generate strong cash flow while preserving land ownership.",
    pros: [
      "Cash-flowing asset while holding land",
      "Lower entitlement burden than subdivision",
      "Rural acreage is well-suited",
      "Growing demand for experiential venues",
      "Preserves optionality for future development",
    ],
    cons: [
      "SUP (Special Use Permit) may be required",
      "Operational complexity",
      "Septic and parking requirements",
      "Requires improvement investment",
      "Seasonal revenue risk",
    ],
    keySteps: [
      "Confirm SUP requirements with county",
      "Review deed restrictions",
      "Business plan and revenue model",
      "Septic and water well assessment",
      "Parking and access improvements",
      "Building permits for structures",
    ],
    recommended: false,
  },
];
