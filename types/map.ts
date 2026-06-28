export type LayerId =
  | "parcel"
  | "flood"
  | "zoning"
  | "utilities"
  | "developments"
  | "roads"
  | "schools-retail"
  | "growth";

export interface MapLayer {
  id: LayerId;
  name: string;
  color: string;
  visibleDefault: boolean;
  description: string;
  riskLevel?: string;
}

export type PinType = "residential" | "commercial" | "education" | "infrastructure" | "utility";

export interface DevelopmentPin {
  id: string;
  name: string;
  type: PinType;
  distance: string;
  status: string;
  whyItMatters: string;
  impact: string;
  x: number;
  y: number;
  color: string;
  symbol: string;
}

export interface IntelligenceCard {
  id: string;
  title: string;
  statusLabel: string;
  statusColor: "green" | "amber" | "blue" | "red" | "muted";
  insight: string;
  rating: string;
  ratingColor: "green" | "amber" | "red";
  layerId?: LayerId;
}
