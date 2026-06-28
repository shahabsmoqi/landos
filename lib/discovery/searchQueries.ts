const ARCGIS_REST_PATH = "/arcgis/rest/services";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/city of\s*/i, "")
    .replace(/\s+county$/i, "")
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function generateCandidateRoots(
  city: string,
  county: string,
  state: string
): string[] {
  const c = slugify(city);
  const co = slugify(county);
  const st = state.toLowerCase().replace(/[^a-z]/g, "");

  const roots: string[] = [];

  if (c) {
    roots.push(
      `https://gis.${c}.gov${ARCGIS_REST_PATH}`,
      `https://maps.${c}.gov${ARCGIS_REST_PATH}`,
      `https://gis.${c}${st}.gov${ARCGIS_REST_PATH}`,
      `https://${c}.maps.arcgis.com${ARCGIS_REST_PATH}`
    );
  }

  if (co) {
    roots.push(
      `https://gis.${co}county.gov${ARCGIS_REST_PATH}`,
      `https://maps.${co}county.gov${ARCGIS_REST_PATH}`,
      `https://gis.${co}.gov${ARCGIS_REST_PATH}`,
      `https://${co}county.maps.arcgis.com${ARCGIS_REST_PATH}`,
      `https://${co}${st}.maps.arcgis.com${ARCGIS_REST_PATH}`
    );
  }

  // Deduplicate
  return [...new Set(roots)];
}
