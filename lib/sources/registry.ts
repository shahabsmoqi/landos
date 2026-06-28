import { demoDiscoveredSources } from "@/data/discoveredSources.demo";
import type { DiscoveredSource } from "@/types/sources";

// In-memory registry — replaced with Supabase in Session 5
let registry: DiscoveredSource[] = [...demoDiscoveredSources];

export function getRegistry(): DiscoveredSource[] {
  return registry;
}

export function mergeDiscoveredSources(incoming: DiscoveredSource[]): void {
  for (const src of incoming) {
    const idx = registry.findIndex((r) => r.id === src.id);
    if (idx >= 0) {
      registry[idx] = src;
    } else {
      registry.push(src);
    }
  }
}

export function getSourcesByType(
  type: DiscoveredSource["type"]
): DiscoveredSource[] {
  return registry.filter((s) => s.type === type);
}

export function getConnectedSources(): DiscoveredSource[] {
  return registry.filter((s) => s.status === "connected");
}
