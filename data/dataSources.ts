export type DataSourceStatus = "Connected" | "Pending" | "Manual Upload" | "Coming Soon";

export interface DataSource {
  id: string;
  name: string;
  description: string;
  status: DataSourceStatus;
  category: string;
  lastSync?: string;
  dataTypes: string[];
}

export const dataSources: DataSource[] = [
  {
    id: "county-cad",
    name: "County Appraisal Districts",
    description: "Property values, ownership records, legal descriptions, and improvement data from Texas CADs.",
    status: "Connected",
    category: "Property Records",
    lastSync: "2024-01-15",
    dataTypes: ["Property value", "Ownership", "Acreage", "Improvement sqft", "Exemptions"],
  },
  {
    id: "city-gis",
    name: "City GIS Portals",
    description: "Municipal GIS layers including zoning, future land use, ETJ boundaries, and infrastructure overlays.",
    status: "Connected",
    category: "Zoning & Land Use",
    lastSync: "2024-01-14",
    dataTypes: ["Zoning districts", "Future land use", "City limits", "ETJ", "Right-of-way"],
  },
  {
    id: "fema-flood",
    name: "FEMA Flood Maps (NFHL)",
    description: "National Flood Hazard Layer data for flood zone designations, BFE, and floodway boundaries.",
    status: "Connected",
    category: "Environmental",
    lastSync: "2024-01-12",
    dataTypes: ["Flood zone", "FIRM panel", "BFE", "Floodway", "SFHA"],
  },
  {
    id: "utility-providers",
    name: "Utility Provider Networks",
    description: "Integration with local water, sewer, electric, and gas utility providers for availability and connection data.",
    status: "Pending",
    category: "Utilities",
    dataTypes: ["Water availability", "Sewer capacity", "Electric service area", "Gas service area", "Connection points"],
  },
  {
    id: "permit-portals",
    name: "Municipal Permit Portals",
    description: "Direct API connections to city and county permit portals for permit history, open permits, and code violations.",
    status: "Pending",
    category: "Permits",
    dataTypes: ["Permit history", "Open permits", "Code violations", "Certificate of occupancy"],
  },
  {
    id: "school-districts",
    name: "School District Boundaries",
    description: "Texas TEA school district boundary data with performance metrics and growth indicators.",
    status: "Connected",
    category: "Demographics",
    lastSync: "2024-01-10",
    dataTypes: ["District boundaries", "Rating", "Enrollment", "Growth rate"],
  },
  {
    id: "dot-traffic",
    name: "TxDOT Traffic Counts",
    description: "Texas Department of Transportation average daily traffic counts and roadway classification data.",
    status: "Coming Soon",
    category: "Transportation",
    dataTypes: ["ADT counts", "Road classification", "Speed limits", "Accident history"],
  },
  {
    id: "satellite-imagery",
    name: "Satellite Imagery",
    description: "High-resolution satellite and aerial imagery for site analysis, vegetation mapping, and change detection.",
    status: "Coming Soon",
    category: "Imagery",
    dataTypes: ["RGB imagery", "NDVI vegetation", "Change detection", "Elevation model"],
  },
  {
    id: "census-data",
    name: "US Census Bureau",
    description: "ACS demographic data, population projections, household income, and housing unit data by census tract.",
    status: "Connected",
    category: "Demographics",
    lastSync: "2024-01-08",
    dataTypes: ["Population", "Household income", "Housing units", "Growth rate", "Age distribution"],
  },
  {
    id: "zoning-ordinances",
    name: "Zoning Ordinance Database",
    description: "Parsed municipal zoning ordinance text for use/development standards lookup by zoning district.",
    status: "Manual Upload",
    category: "Zoning & Land Use",
    dataTypes: ["Use table", "Setbacks", "Height limits", "Lot coverage", "Parking standards"],
  },
  {
    id: "comp-plans",
    name: "Comprehensive Plans",
    description: "City and county comprehensive plan documents for future land use and growth area identification.",
    status: "Manual Upload",
    category: "Zoning & Land Use",
    dataTypes: ["Future land use", "Growth areas", "Transportation plan", "Policy guidance"],
  },
  {
    id: "recording-data",
    name: "County Deed Records",
    description: "Direct integration with county clerk recording systems for deed history, liens, and plat records.",
    status: "Coming Soon",
    category: "Property Records",
    dataTypes: ["Deed history", "Liens", "Easements", "Plat records", "Restrictive covenants"],
  },
];
