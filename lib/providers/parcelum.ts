/**
 * Parcelum.io — Texas Parcel Data API
 * https://parcelum.io
 *
 * Covers most TX counties (Harris, Dallas, Tarrant, Travis, etc.)
 * Auth: X-API-Key header
 * Search: GET /api/v1/parcels?q=<address>&limit=N
 *
 * Env var required: PARCELUM_API_KEY
 */

import type { NormalizedProperty } from "@/types/normalized";

const BASE_URL = "https://parcelum.io/api/v1/parcels";

export const PARCELUM_CONFIGURED = Boolean(process.env.PARCELUM_API_KEY);

interface ParcelumAddress {
  city: string | null;
  state: string | null;
  zip_code: string | null;
  address_line1: string | null;
  full_street_address: string | null;
  county: string | null;
}

interface ParcelumMailingAddress {
  name: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
}

interface ParcelumOwner {
  name: string | null;
  ownership_percentage: number | null;
}

interface ParcelumValuation {
  land_value: number | null;
  improvement_value: number | null;
  total_value: number | null;
  market_value: number | null;
  assessed_value: number | null;
  taxable_value: number | null;
}

interface ParcelumImprovement {
  improvement_type: string;
  area_sf: number | null;
  total_area_sf: number | null;
  year_built: number | null;
}

interface ParcelumRecord {
  parcel_pk: number;
  cad_id: string | null;
  county: string;
  tax_year: number;
  property_address: ParcelumAddress;
  mailing_address: ParcelumMailingAddress | null;
  owners: ParcelumOwner[];
  total_living_area_sf: number | null;
  land_area_sf: number | null;
  land_area_acres: number | null;
  year_built: number | null;
  valuation: ParcelumValuation | null;
  improvements: ParcelumImprovement[];
  legal1: string | null;
  property_classification: string | null;
}

interface ParcelumResponse {
  parcels: ParcelumRecord[];
  meta: {
    pagination: { total: number; has_next: boolean };
    search: { query: string; total_matches: number };
  };
}

export async function fetchParcelumByAddress(
  address: string,
  lat: number,
  lng: number
): Promise<NormalizedProperty | null> {
  const apiKey = process.env.PARCELUM_API_KEY;
  if (!apiKey) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const url = `${BASE_URL}?q=${encodeURIComponent(address)}&limit=5`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "X-API-Key": apiKey,
        "User-Agent": "LandOS/1.0 (thelonestarcapitalpartners@gmail.com)",
      },
    });
    clearTimeout(timer);

    if (!res.ok) return null;

    const data = (await res.json()) as ParcelumResponse;
    if (!data.parcels?.length) return null;

    const p = data.parcels[0];

    const primaryOwner = p.owners?.find((o) => o.name) ?? null;

    const mailingParts = [
      p.mailing_address?.name,
      p.mailing_address?.address_line1 ?? p.mailing_address?.address_line2,
      p.mailing_address?.city,
      p.mailing_address?.state,
      p.mailing_address?.zip_code,
    ].filter(Boolean);

    // Improvement sqft: prefer total_living_area_sf, fall back to sum of improvements
    const improvementSqft =
      p.total_living_area_sf ??
      (p.improvements?.reduce((sum, imp) => sum + (imp.total_area_sf ?? imp.area_sf ?? 0), 0) || undefined);

    // Year built: top-level field or first improvement with year
    const yearBuilt =
      p.year_built ??
      p.improvements?.find((imp) => imp.year_built)?.year_built ??
      undefined;

    const addressParts = [
      p.property_address.full_street_address ?? p.property_address.address_line1,
      p.property_address.city,
      p.property_address.state,
      p.property_address.zip_code,
    ].filter(Boolean);

    return {
      address: addressParts.join(", "),
      lat,
      lng,
      parcelId: p.cad_id ?? String(p.parcel_pk),
      ownerName: primaryOwner?.name ?? undefined,
      ownerMailingAddress: mailingParts.length ? mailingParts.join(", ") : undefined,
      acreage: p.land_area_acres ?? undefined,
      landSqft: p.land_area_sf ?? undefined,
      improvementSqft: improvementSqft || undefined,
      yearBuilt: yearBuilt ? Number(yearBuilt) : undefined,
      assessedValue: p.valuation?.assessed_value ?? undefined,
      marketValue: p.valuation?.market_value ?? undefined,
      propertyUse: p.property_classification ?? undefined,
      sourceUrl: "https://parcelum.io",
      sourceConfidence: "live",
    };
  } catch {
    clearTimeout(timer);
    return null;
  }
}
