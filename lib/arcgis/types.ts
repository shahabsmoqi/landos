export interface ArcGISService {
  name: string;
  type: string;
}

export interface ArcGISServicesDirectory {
  folders?: string[];
  services?: ArcGISService[];
  currentVersion?: number;
  error?: { code: number; message: string };
}

export interface ArcGISLayerInfo {
  id: number;
  name: string;
  type?: string;
  geometryType?: string;
  description?: string;
  capabilities?: string;
  supportsAdvancedQueries?: boolean;
  fields?: Array<{ name: string; type: string; alias: string }>;
}

export interface ArcGISServiceMetadata {
  serviceDescription?: string;
  description?: string;
  layers?: ArcGISLayerInfo[];
  tables?: ArcGISLayerInfo[];
  error?: { code: number; message: string };
}

export interface ArcGISFeature {
  attributes: Record<string, unknown>;
  geometry?: {
    x?: number;
    y?: number;
    rings?: number[][][];
    paths?: number[][][];
  };
}

export interface ArcGISQueryResponse {
  features?: ArcGISFeature[];
  error?: { code: number; message: string };
  exceededTransferLimit?: boolean;
}

export interface ArcGISQueryResult {
  sourceId: string;
  sourceName: string;
  layerName: string;
  features: ArcGISFeature[];
  confidence: number;
  sourceUrl: string;
  fetchedAt: string;
  error?: string;
}
