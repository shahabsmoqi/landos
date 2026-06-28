import type { SourceType } from "@/types/sources";

const LAYER_KEYWORDS: Record<SourceType, string[]> = {
  parcel: [
    "parcel", "parcels", "cad", "appraisal", "tax parcel", "property",
    "ownership", "situs", "account", "taxroll", "land record",
  ],
  zoning: [
    "zoning", "zoning district", "zone", "base zoning", "overlay",
    "ordinance", "zoning_district", "future_zoning",
  ],
  landUse: [
    "future land use", "comprehensive plan", "comp plan", "land use",
    "flu", "flum", "future_land_use", "land_use",
  ],
  permits: [
    "permit", "building permit", "development case", "planning case",
    "application", "inspection", "certificate of occupancy",
  ],
  utilities: [
    "water", "sewer", "wastewater", "utility", "stormwater", "drainage",
    "hydrant", "pipeline", "gas line", "electric", "transmission",
  ],
  flood: [
    "flood", "floodplain", "fema", "nfhl", "floodzone", "flood_zone",
    "100 year", "sfha",
  ],
  environment: [
    "environment", "wetland", "conservation", "habitat", "critical area",
    "tree", "greenway", "open space",
  ],
  schools: [
    "school", "school district", "campus", "isd", "attendance",
    "boundary", "education",
  ],
  traffic: [
    "road", "traffic", "thoroughfare", "transportation", "txdot",
    "centerline", "street", "highway",
  ],
  demographics: [
    "census", "demographics", "population", "tract", "block group",
    "socioeconomic",
  ],
  geocoder: [],
};

const TYPE_SCORES: Record<SourceType, number> = {
  parcel: 90,
  zoning: 85,
  landUse: 80,
  permits: 70,
  utilities: 65,
  flood: 60,
  traffic: 50,
  schools: 45,
  environment: 40,
  demographics: 35,
  geocoder: 10,
};

export function classifyLayer(name: string, description = ""): SourceType | null {
  const text = `${name} ${description}`.toLowerCase();

  for (const [type, keywords] of Object.entries(LAYER_KEYWORDS) as [SourceType, string[]][]) {
    if (keywords.some((kw) => text.includes(kw))) {
      return type;
    }
  }
  return null;
}

export function scoreLayer(name: string, type: SourceType | null): number {
  if (!type) return 0;
  return TYPE_SCORES[type] ?? 0;
}

export function scoreServiceName(name: string): number {
  const lower = name.toLowerCase();
  const highValue = [
    "parcel", "zoning", "land use", "permit", "utility",
    "water", "sewer", "flood", "property",
  ];
  return highValue.filter((t) => lower.includes(t)).length * 25;
}
