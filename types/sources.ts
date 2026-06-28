export type SourceType =
  | "geocoder"
  | "flood"
  | "parcel"
  | "zoning"
  | "landUse"
  | "permits"
  | "utilities"
  | "demographics"
  | "schools"
  | "traffic"
  | "environment";

export type SourceStatus =
  | "connected"
  | "discovered"
  | "failed"
  | "needsKey"
  | "unsupported";

export type SourceProvider =
  | "arcgis-server"
  | "arcgis-online"
  | "census"
  | "fema"
  | "open-data"
  | "unknown";

export interface DiscoveredSource {
  id: string;
  name: string;
  type: SourceType;
  jurisdiction: string;
  provider: SourceProvider;
  endpointUrl: string;
  layerId?: number;
  requiresKey: boolean;
  status: SourceStatus;
  /** 0–100 */
  confidence: number;
  lastChecked: string;
  discoveredBy: "auto" | "manual" | "hardcoded";
  supportsQuery: boolean;
  notes?: string;
}

export interface SourceDiscoveryResult {
  sources: DiscoveredSource[];
  total: number;
  byType: Partial<Record<SourceType, number>>;
  discoveredAt: string;
  candidatesProbed: number;
}
