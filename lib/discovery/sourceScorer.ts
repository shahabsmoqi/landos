import { classifyLayer, scoreLayer, scoreServiceName } from "@/lib/arcgis/layers";
import type { ArcGISLayerInfo, ArcGISService } from "@/lib/arcgis/types";
import type { DiscoveredSource, SourceType } from "@/types/sources";

export function scoreAndClassifyLayer(
  layer: ArcGISLayerInfo,
  serviceUrl: string,
  serviceName: string,
  jurisdiction: string
): DiscoveredSource | null {
  const type: SourceType | null = classifyLayer(layer.name, layer.description ?? "");
  if (!type) return null;

  const score = scoreLayer(layer.name, type);
  if (score < 30) return null;

  const supportsQuery =
    (layer.capabilities?.includes("Query") ?? false) ||
    (layer.supportsAdvancedQueries ?? true);

  return {
    id: `${serviceUrl}/${layer.id}`,
    name: `${layer.name} — ${serviceName.split("/").pop() ?? serviceName}`,
    type,
    jurisdiction,
    provider: "arcgis-server",
    endpointUrl: `${serviceUrl}/${layer.id}`,
    layerId: layer.id,
    requiresKey: false,
    status: "discovered",
    confidence: score,
    lastChecked: new Date().toISOString(),
    discoveredBy: "auto",
    supportsQuery,
    notes: `Auto-discovered from ${new URL(serviceUrl).hostname}`,
  };
}

export function rankServices(
  services: ArcGISService[]
): Array<ArcGISService & { score: number }> {
  return services
    .map((svc) => ({ ...svc, score: scoreServiceName(svc.name) }))
    .sort((a, b) => b.score - a.score);
}
