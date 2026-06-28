export type GeocodingMatchStatus = "exact" | "non-exact" | "no-match" | "error";
export type GeocodingProvider = "census" | "nominatim" | "demo";

export interface GeocodingResult {
  success: boolean;
  inputAddress: string;
  matchedAddress?: string;
  latitude?: number;
  longitude?: number;
  /** FIPS state code, e.g. "48" for Texas */
  state?: string;
  /** Two-letter abbreviation, e.g. "TX" */
  stateAbbr?: string;
  /** FIPS county code within state, e.g. "251" */
  county?: string;
  /** Human-readable county name, e.g. "Johnson County" */
  countyName?: string;
  /** Census tract number, e.g. "952201" */
  tract?: string;
  /** Census block group number, e.g. "1" */
  blockGroup?: string;
  zip?: string;
  /** City extracted from matched address */
  city?: string;
  matchStatus: GeocodingMatchStatus;
  /** 0–100 */
  confidence: number;
  provider: GeocodingProvider;
  error?: string;
}
