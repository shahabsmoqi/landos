/**
 * Regrid Parcel API — Not Yet Active
 *
 * Env var required: REGRID_API_KEY
 * Sign up: https://regrid.com/api
 *
 * Capabilities when activated:
 * - Parcel boundary polygon (GeoJSON)
 * - Owner name & mailing address
 * - Acreage, land sqft
 * - Assessed & market value (county-sourced)
 * - Legal description, parcel ID
 * - Property use code
 *
 * To activate:
 * 1. Add REGRID_API_KEY to .env.local
 * 2. Implement lib/providers/regrid.ts using this interface
 */

export const REGRID_CONFIGURED = Boolean(process.env.REGRID_API_KEY);

export interface RegridParcelResult {
  parcelId: string;
  ownerName: string;
  ownerMailingAddress: string;
  acreage: number;
  landSqft: number;
  assessedValue: number;
  marketValue: number;
  propertyUse: string;
  legalDescription: string;
  boundary: { type: "Polygon"; coordinates: number[][][] } | null;
}

export async function fetchRegridParcel(
  _lat: number,
  _lng: number
): Promise<RegridParcelResult | null> {
  if (!REGRID_CONFIGURED) return null;
  throw new Error(
    "Regrid integration not yet implemented. Add REGRID_API_KEY to activate."
  );
}
