import { fetchArcGIS } from "@/lib/arcgis/client";
import { generateCandidateRoots } from "./searchQueries";
import { rankServices, scoreAndClassifyLayer } from "./sourceScorer";
import type {
  ArcGISServicesDirectory,
  ArcGISServiceMetadata,
} from "@/lib/arcgis/types";
import type { DiscoveredSource } from "@/types/sources";

const ROOT_PROBE_TIMEOUT = 4000;
const SERVICE_PROBE_TIMEOUT = 3500;
const MAX_SERVICES_PER_ROOT = 8;
const MAX_LAYERS_PER_SERVICE = 15;

async function probeRoot(
  rootUrl: string
): Promise<{ url: string; data: ArcGISServicesDirectory } | null> {
  const data = await fetchArcGIS<ArcGISServicesDirectory>(
    `${rootUrl}?f=json`,
    ROOT_PROBE_TIMEOUT
  );

  // Must look like an ArcGIS services directory
  if (!data || data.error || (!data.services?.length && !data.folders?.length)) {
    return null;
  }

  return { url: rootUrl, data };
}

async function probeService(
  rootUrl: string,
  serviceName: string,
  serviceType: string,
  jurisdiction: string
): Promise<DiscoveredSource[]> {
  const serviceUrl = `${rootUrl}/${serviceName}/${serviceType}`;
  const data = await fetchArcGIS<ArcGISServiceMetadata>(
    `${serviceUrl}?f=json`,
    SERVICE_PROBE_TIMEOUT
  );

  if (!data || data.error || !data.layers?.length) return [];

  const sources: DiscoveredSource[] = [];

  for (const layer of data.layers.slice(0, MAX_LAYERS_PER_SERVICE)) {
    const source = scoreAndClassifyLayer(layer, serviceUrl, serviceName, jurisdiction);
    if (source) sources.push(source);
  }

  return sources;
}

export async function discoverArcGISSources(
  city: string,
  county: string,
  state: string
): Promise<DiscoveredSource[]> {
  if (!city && !county) return [];

  const roots = generateCandidateRoots(city, county, state);

  // Probe all roots in parallel
  const rootResults = await Promise.allSettled(roots.map(probeRoot));

  const serviceProbes: Promise<DiscoveredSource[]>[] = [];

  for (const result of rootResults) {
    if (result.status !== "fulfilled" || !result.value) continue;

    const { url, data } = result.value;
    const jurisdiction =
      new URL(url).hostname.replace(/^(gis|maps)\./, "") ?? url;
    const services = data.services ?? [];

    const ranked = rankServices(services).slice(0, MAX_SERVICES_PER_ROOT);

    for (const svc of ranked) {
      if (svc.score > 0) {
        serviceProbes.push(
          probeService(url, svc.name, svc.type, jurisdiction)
        );
      }
    }
  }

  // Probe all services in parallel
  const layerResults = await Promise.allSettled(serviceProbes);

  const discovered: DiscoveredSource[] = [];
  for (const result of layerResults) {
    if (result.status === "fulfilled") {
      discovered.push(...result.value);
    }
  }

  // Deduplicate by endpointUrl, highest confidence wins
  const map = new Map<string, DiscoveredSource>();
  for (const src of discovered) {
    const existing = map.get(src.endpointUrl);
    if (!existing || src.confidence > existing.confidence) {
      map.set(src.endpointUrl, src);
    }
  }

  return [...map.values()].sort((a, b) => b.confidence - a.confidence);
}
