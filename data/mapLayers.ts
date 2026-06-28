import type { MapLayer, DevelopmentPin, IntelligenceCard } from "@/types/map";

export const mapLayers: MapLayer[] = [
  {
    id: "parcel",
    name: "Parcel Boundary",
    color: "#4f8ef7",
    visibleDefault: true,
    description: "Subject parcel boundary and APN geometry",
  },
  {
    id: "flood",
    name: "Flood Zone",
    color: "#3b82f6",
    visibleDefault: true,
    description: "FEMA NFHL flood hazard zone overlay",
    riskLevel: "Low to Medium",
  },
  {
    id: "zoning",
    name: "Zoning Context",
    color: "#a78bfa",
    visibleDefault: true,
    description: "Municipal and county zoning district boundaries",
  },
  {
    id: "utilities",
    name: "Utilities",
    color: "#fbbf24",
    visibleDefault: false,
    description: "Known utility infrastructure lines and service areas",
    riskLevel: "Medium",
  },
  {
    id: "developments",
    name: "Nearby Developments",
    color: "#34d399",
    visibleDefault: true,
    description: "Active and planned development projects within 6 miles",
  },
  {
    id: "roads",
    name: "Road Network",
    color: "#6b7280",
    visibleDefault: true,
    description: "Public roads, access points, and ROW lines",
  },
  {
    id: "schools-retail",
    name: "Schools / Retail",
    color: "#f97316",
    visibleDefault: false,
    description: "School district boundaries and retail anchor locations",
  },
  {
    id: "growth",
    name: "Growth Signals",
    color: "#10b981",
    visibleDefault: true,
    description: "Population growth, builder activity, and demand indicators",
  },
];

export const developmentPins: DevelopmentPin[] = [
  {
    id: "pin-1",
    name: "New Residential Subdivision",
    type: "residential",
    distance: "2.1 miles NW",
    status: "Active Construction",
    whyItMatters:
      "Active comparable residential project confirms builder demand in this corridor. Similar lot product actively selling.",
    impact:
      "Strong positive signal — validates estate lot or residential subdivision feasibility for subject parcel.",
    x: 128,
    y: 145,
    color: "#a78bfa",
    symbol: "R",
  },
  {
    id: "pin-2",
    name: "Retail Corridor Expansion",
    type: "commercial",
    distance: "4.8 miles E",
    status: "Planning / Approved",
    whyItMatters:
      "Retail investment signals rooftop demand and population growth projections from developers and national tenants.",
    impact: "Supports residential density assumptions — retail follows rooftops.",
    x: 808,
    y: 372,
    color: "#f97316",
    symbol: "C",
  },
  {
    id: "pin-3",
    name: "School District Growth Zone",
    type: "education",
    distance: "3.2 miles NE",
    status: "District Expansion Active",
    whyItMatters:
      "Mansfield ISD growth zone indicates long-term family-oriented demand. New schools attract residential investment.",
    impact: "Positive signal for family lot product. School proximity improves absorption rates.",
    x: 690,
    y: 88,
    color: "#60a5fa",
    symbol: "S",
  },
  {
    id: "pin-4",
    name: "Highway Access (US-287)",
    type: "infrastructure",
    distance: "5.5 miles SE",
    status: "Active Corridor",
    whyItMatters:
      "US-287 provides direct Fort Worth and Dallas metro connectivity — a major driver of suburban land values.",
    impact: "Strong connectivity premium. 10–15 min commute range to major employment centers.",
    x: 842,
    y: 504,
    color: "#34d399",
    symbol: "H",
  },
  {
    id: "pin-5",
    name: "Future Estate Lot Community",
    type: "residential",
    distance: "1.7 miles SW",
    status: "Platted / Pending",
    whyItMatters:
      "Nearest comparable estate lot project. Confirms product type demand and sets pricing benchmarks.",
    impact: "Direct competitive and comparable context. Pre-sales activity would validate subject parcel timing.",
    x: 158,
    y: 462,
    color: "#2dd4bf",
    symbol: "E",
  },
  {
    id: "pin-6",
    name: "Utility Extension Candidate",
    type: "utility",
    distance: "2.9 miles N",
    status: "Proposed — Not Confirmed",
    whyItMatters:
      "Proposed water/sewer extension line that, if approved, would significantly reduce utility risk on subject parcel.",
    impact:
      "Critical to monitor — if this extension proceeds, development feasibility improves substantially.",
    x: 700,
    y: 235,
    color: "#fbbf24",
    symbol: "U",
  },
];

export const intelligenceCards: IntelligenceCard[] = [
  {
    id: "parcel-boundary",
    title: "Parcel Boundary",
    statusLabel: "Demo Boundary",
    statusColor: "blue",
    insight:
      "14.07-acre tract with estimated ~450 ft road frontage on Dave Angel Rd. Flexible site layout supports multiple development scenarios.",
    rating: "Strong",
    ratingColor: "green",
    layerId: "parcel",
  },
  {
    id: "zoning-context",
    title: "Zoning Context",
    statusLabel: "Unrestricted County",
    statusColor: "muted",
    insight:
      "Currently outside city limits with no formal zoning. Flexible use but annexation or ETJ status verification required before dense subdivision.",
    rating: "Favorable",
    ratingColor: "green",
    layerId: "zoning",
  },
  {
    id: "flood-overlay",
    title: "Flood Overlay",
    statusLabel: "Live FEMA Linked",
    statusColor: "green",
    insight:
      "Live FEMA NFHL query indicates Zone X designation — minimal flood hazard. Map overlay shows estimated flood geometry using demo boundary.",
    rating: "Low / Medium",
    ratingColor: "green",
    layerId: "flood",
  },
  {
    id: "utilities",
    title: "Utilities",
    statusLabel: "Needs Verification",
    statusColor: "amber",
    insight:
      "Electric available nearby. Water and sewer status unconfirmed — likely requires septic or utility extension. This is the highest-risk feasibility item.",
    rating: "Medium Risk",
    ratingColor: "amber",
    layerId: "utilities",
  },
  {
    id: "nearby-growth",
    title: "Nearby Growth",
    statusLabel: "Active Corridor",
    statusColor: "green",
    insight:
      "6 active growth signals within 6 miles: subdivision, retail expansion, school zone growth, highway access, estate community, and utility extension.",
    rating: "Strong Signal",
    ratingColor: "green",
    layerId: "developments",
  },
  {
    id: "access-frontage",
    title: "Access & Frontage",
    statusLabel: "Public Road",
    statusColor: "green",
    insight:
      "Direct access from Dave Angel Rd (public paved road). Estimated 450 ft frontage supports multiple access points for subdivision design.",
    rating: "Good",
    ratingColor: "green",
    layerId: "roads",
  },
];
