import { fetchArcGIS } from "./client";
import type { ArcGISQueryResponse, ArcGISQueryResult } from "./types";

export interface PointQueryOptions {
  /** Base service URL, e.g. https://server/arcgis/rest/services/Name/FeatureServer */
  endpointUrl: string;
  layerId: number;
  lat: number;
  lng: number;
  outFields?: string;
  returnGeometry?: boolean;
  sourceName?: string;
  timeoutMs?: number;
}

export async function queryByPoint(opts: PointQueryOptions): Promise<ArcGISQueryResult> {
  const queryUrl = new URL(`${opts.endpointUrl.replace(/\/$/, "")}/${opts.layerId}/query`);
  queryUrl.searchParams.set("geometry", `${opts.lng},${opts.lat}`);
  queryUrl.searchParams.set("geometryType", "esriGeometryPoint");
  queryUrl.searchParams.set("inSR", "4326");
  queryUrl.searchParams.set("spatialRel", "esriSpatialRelIntersects");
  queryUrl.searchParams.set("outFields", opts.outFields ?? "*");
  queryUrl.searchParams.set("returnGeometry", String(opts.returnGeometry ?? false));
  queryUrl.searchParams.set("f", "json");

  const result = await fetchArcGIS<ArcGISQueryResponse>(
    queryUrl.toString(),
    opts.timeoutMs ?? 5000
  );

  return {
    sourceId: opts.endpointUrl,
    sourceName: opts.sourceName ?? "Unknown Source",
    layerName: `Layer ${opts.layerId}`,
    features: result?.features ?? [],
    confidence: result?.features?.length ? 80 : 0,
    sourceUrl: queryUrl.toString(),
    fetchedAt: new Date().toISOString(),
    error: result?.error?.message,
  };
}
