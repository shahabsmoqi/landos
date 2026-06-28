import type { GeocodingResult } from "./geocoding";
import type { DiscoveredSource } from "./sources";

export type ConfidenceLevel = "live" | "estimated" | "demo" | "missing";

export interface NormalizedFlood {
  zoneCode: string;
  zoneSubtype: string;
  sfha: boolean;
  firmPanel: string;
  riskLevel: "low" | "low to medium" | "medium" | "high" | "very high";
  riskLabel: string;
  description: string;
  sourceUrl: string;
  sourceConfidence: ConfidenceLevel;
  lastChecked: string;
  lat?: number;
  lng?: number;
}

export interface NormalizedDemographics {
  tract: string;
  blockGroup: string;
  population: number | null;
  medianHouseholdIncome: number | null;
  ownerOccupiedHouseholds: number | null;
  renterOccupiedHouseholds: number | null;
  totalHouseholds: number | null;
  /** 0–1 */
  ownerOccupiedRate: number | null;
  /** 0–1 */
  renterOccupiedRate: number | null;
  medianAge: number | null;
  sourceUrl: string;
  sourceConfidence: ConfidenceLevel;
  year: number;
}

export interface NormalizedProperty {
  address: string;
  lat: number;
  lng: number;
  parcelId?: string;
  ownerName?: string;
  ownerMailingAddress?: string;
  acreage?: number;
  landSqft?: number;
  improvementSqft?: number;
  yearBuilt?: number;
  assessedValue?: number;
  marketValue?: number;
  propertyUse?: string;
  sourceUrl: string;
  sourceConfidence: ConfidenceLevel;
}

export interface NormalizedZoning {
  zoningCode?: string;
  zoningName?: string;
  jurisdiction?: string;
  allowedUses?: string[];
  overlays?: string[];
  maxDensity?: string;
  maxHeight?: string;
  minLotSize?: string;
  sourceUrl: string;
  sourceConfidence: ConfidenceLevel;
}

export interface NormalizedPermit {
  permitNumber: string;
  permitType: string;
  status: string;
  description?: string;
  issuedDate?: string;
  address?: string;
  distanceFromSubject?: string;
  sourceUrl: string;
}

export interface NormalizedUtility {
  utilityType: "water" | "sewer" | "electric" | "gas" | "fiber";
  provider?: string;
  distanceToNearestLine?: string;
  capacityKnown: boolean;
  notes?: string;
  sourceConfidence: ConfidenceLevel;
}

export interface PropertyIntelligence {
  address: string;
  geocode: GeocodingResult | null;
  flood: NormalizedFlood | null;
  demographics: NormalizedDemographics | null;
  parcel: NormalizedProperty | null;
  zoning: NormalizedZoning | null;
  discoveredSources: DiscoveredSource[];
  permits: NormalizedPermit[];
  utilities: NormalizedUtility[];
  confidenceSummary: {
    geocoder: ConfidenceLevel;
    flood: ConfidenceLevel;
    demographics: ConfidenceLevel;
    parcel: ConfidenceLevel;
    zoning: ConfidenceLevel;
  };
  missingData: string[];
  fallbacksUsed: string[];
  fetchedAt: string;
  mode: "live" | "demo";
}
