/**
 * Google Maps — Not Yet Active
 *
 * Env vars required:
 *   GOOGLE_MAPS_API_KEY  — server-side geocoding
 *   NEXT_PUBLIC_GOOGLE_MAPS_KEY — client-side Places autocomplete
 *
 * Capabilities when activated:
 * - High-accuracy geocoding for difficult addresses
 * - Places autocomplete in analyze form
 * - Satellite imagery via Static Maps API
 * - Nearest road / street view integration
 *
 * To activate:
 * 1. Enable Geocoding API + Maps JavaScript API in GCP console
 * 2. Add GOOGLE_MAPS_API_KEY to .env.local
 * 3. Wire into lib/geocoding/censusGeocoder.ts as fallback
 */

export const GOOGLE_MAPS_CONFIGURED = Boolean(process.env.GOOGLE_MAPS_API_KEY);
