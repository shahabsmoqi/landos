export type DealStatus = "Watching" | "Under Review" | "Feasibility" | "Submitted" | "Passed";

export interface SavedDeal {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  acres: number;
  intendedUse: string;
  score: number;
  status: DealStatus;
  lastUpdated: string;
  pricePerAcre: number;
  askingPrice: number;
  notes: string;
  isDemo: boolean;
}

export const savedDeals: SavedDeal[] = [
  {
    id: "demo-property",
    address: "2600 Dave Angel Rd",
    city: "Burleson",
    state: "TX",
    zip: "76028",
    acres: 14.07,
    intendedUse: "Estate Lot Subdivision",
    score: 87,
    status: "Under Review",
    lastUpdated: "2024-01-15",
    pricePerAcre: 66446,
    askingPrice: 934900,
    notes: "Strong candidate. Utility verification in progress.",
    isDemo: true,
  },
  {
    id: "waxahachie-15",
    address: "7800 Mockingbird Ln",
    city: "Waxahachie",
    state: "TX",
    zip: "75165",
    acres: 15.2,
    intendedUse: "Residential Subdivision",
    score: 81,
    status: "Feasibility",
    lastUpdated: "2024-01-10",
    pricePerAcre: 52000,
    askingPrice: 790400,
    notes: "Survey ordered. Pre-dev meeting scheduled.",
    isDemo: false,
  },
  {
    id: "fortworth-infill",
    address: "4421 Seminary Dr",
    city: "Fort Worth",
    state: "TX",
    zip: "76115",
    acres: 6.2,
    intendedUse: "Townhomes / Mixed Use",
    score: 76,
    status: "Watching",
    lastUpdated: "2024-01-08",
    pricePerAcre: 145000,
    askingPrice: 899000,
    notes: "Infill opportunity. Rezoning required.",
    isDemo: false,
  },
  {
    id: "mansfield-22",
    address: "3100 Heritage Pkwy",
    city: "Mansfield",
    state: "TX",
    zip: "76063",
    acres: 22.0,
    intendedUse: "Master Planned Community",
    score: 89,
    status: "Under Review",
    lastUpdated: "2024-01-14",
    pricePerAcre: 71000,
    askingPrice: 1562000,
    notes: "Adjacent to major builder activity. Top priority parcel.",
    isDemo: false,
  },
  {
    id: "midlothian-8",
    address: "1540 Walnut Grove Rd",
    city: "Midlothian",
    state: "TX",
    zip: "76065",
    acres: 8.5,
    intendedUse: "Hold / Land Banking",
    score: 73,
    status: "Watching",
    lastUpdated: "2024-01-05",
    pricePerAcre: 48500,
    askingPrice: 412250,
    notes: "Watch position. Ag exemption confirmed.",
    isDemo: false,
  },
];
