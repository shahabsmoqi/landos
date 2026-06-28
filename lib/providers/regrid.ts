/**
 * Regrid Parcel Data API
 * https://app.regrid.com/api/v2/parcels/address.json
 *
 * National coverage — parcel data + zoning (via Zoneomics integration)
 * Auth: ?token=<jwt> URL param (no Authorization header)
 *
 * Env var required: REGRID_TOKEN
 */

import type { NormalizedProperty, NormalizedZoning } from "@/types/normalized";

const BASE_URL = "https://app.regrid.com/api/v2/parcels/address.json";

export const REGRID_CONFIGURED = Boolean(process.env.REGRID_TOKEN);

interface RegridFields {
  parcelnumb?: string | null;
  usedesc?: string | null;
  zoning?: string | null;
  zoning_description?: string | null;
  zoning_type?: string | null;
  zoning_subtype?: string | null;
  zoning_code_link?: string | null;
  yearbuilt?: number | null;
  improvval?: number | null;
  landval?: number | null;
  parval?: number | null;
  owner?: string | null;
  mailadd?: string | null;
  mail_city?: string | null;
  mail_state2?: string | null;
  mail_zip?: string | null;
  ll_bldg_footprint_sqft?: number | null;
  area_building?: number | null;
  ll_gisacre?: number | null;
  deeded_acres?: number | null;
  ll_gissqft?: number | null;
  fema_nri_risk_rating?: string | null;
  census_unified_school_district?: string | null;
  address?: string | null;
  city?: string | null;
  state2?: string | null;
  szip?: string | null;
  lat?: number | null;
  lon?: number | null;
  path?: string | null;
}

interface RegridFeature {
  type: "Feature";
  geometry: { type: string; coordinates: unknown } | null;
  properties: {
    headline?: string;
    path?: string;
    fields: RegridFields;
  };
}

interface RegridResponse {
  parcels: {
    type: "FeatureCollection";
    features: RegridFeature[];
  };
}

export interface RegridResult {
  parcel: NormalizedProperty | null;
  zoning: NormalizedZoning | null;
}

export async function fetchRegridByAddress(
  address: string,
  lat: number,
  lng: number
): Promise<RegridResult> {
  const token = process.env.REGRID_TOKEN;
  if (!token) return { parcel: null, zoning: null };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const url = `${BASE_URL}?query=${encodeURIComponent(address)}&limit=3&token=${encodeURIComponent(token)}`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "LandOS/1.0 (thelonestarcapitalpartners@gmail.com)" },
    });
    clearTimeout(timer);

    if (!res.ok) return { parcel: null, zoning: null };

    const data = (await res.json()) as RegridResponse;
    const features = data.parcels?.features ?? [];
    if (!features.length) return { parcel: null, zoning: null };

    const f = features[0];
    const fields = f.properties.fields;

    const acreage = fields.deeded_acres ?? fields.ll_gisacre ?? undefined;
    const landSqft = fields.ll_gissqft ?? undefined;
    const improvementSqft = fields.area_building ?? fields.ll_bldg_footprint_sqft ?? undefined;

    const mailingParts = [
      fields.mailadd,
      fields.mail_city,
      fields.mail_state2,
      fields.mail_zip,
    ].filter(Boolean) as string[];

    const normalizedAddress = [
      fields.address,
      fields.city,
      fields.state2,
      fields.szip,
    ].filter(Boolean).join(", ");

    const regridPath = fields.path ?? f.properties.path ?? "";

    const parcel: NormalizedProperty = {
      address: normalizedAddress || address,
      lat: fields.lat ?? lat,
      lng: fields.lon ?? lng,
      parcelId: fields.parcelnumb ?? undefined,
      ownerName: fields.owner ?? undefined,
      ownerMailingAddress: mailingParts.length ? mailingParts.join(", ") : undefined,
      acreage: acreage ?? undefined,
      landSqft: landSqft ?? undefined,
      improvementSqft: improvementSqft ?? undefined,
      yearBuilt: fields.yearbuilt ?? undefined,
      assessedValue: fields.parval ?? undefined,
      marketValue: fields.parval ?? undefined,
      propertyUse: fields.usedesc ?? undefined,
      sourceUrl: regridPath ? `https://app.regrid.com${regridPath}` : "https://app.regrid.com",
      sourceConfidence: "live",
    };

    let zoning: NormalizedZoning | null = null;
    if (fields.zoning) {
      const allowedUses = [fields.zoning_subtype, fields.zoning_type]
        .filter(Boolean) as string[];
      const jurisdictionParts = [fields.city, fields.state2].filter(Boolean) as string[];
      zoning = {
        zoningCode: fields.zoning,
        zoningName: fields.zoning_description ?? undefined,
        jurisdiction: jurisdictionParts.length ? jurisdictionParts.join(", ") : undefined,
        allowedUses: allowedUses.length ? allowedUses : undefined,
        sourceUrl: fields.zoning_code_link ?? (regridPath ? `https://app.regrid.com${regridPath}` : "https://app.regrid.com"),
        sourceConfidence: "live",
      };
    }

    return { parcel, zoning };
  } catch {
    clearTimeout(timer);
    return { parcel: null, zoning: null };
  }
}
