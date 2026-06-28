/**
 * Mapbox — Not Yet Active
 *
 * Env vars required:
 *   NEXT_PUBLIC_MAPBOX_TOKEN   — for client-side map rendering
 *   MAPBOX_SECRET_TOKEN        — for server-side geocoding (optional)
 *
 * Capabilities when activated:
 * - Real satellite + street basemap in FakeGISMap
 * - Address autocomplete in analyze form
 * - Precise geocoding with confidence scores
 * - Static map images for PDF export
 *
 * To activate:
 * 1. Sign up at mapbox.com, create a public token
 * 2. Add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local
 * 3. Replace FakeGISMap SVG canvas with mapbox-gl or react-map-gl
 */

export const MAPBOX_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN
);

export function getMapboxToken(): string | null {
  return process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? null;
}
