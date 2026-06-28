"use client";

import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MapLayer, LayerId } from "@/types/map";

interface Props {
  layers: MapLayer[];
  activeLayers: Set<LayerId>;
  onToggle: (id: LayerId) => void;
}

export function MapLayerToggle({ layers, activeLayers, onToggle }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
        Map Layers
      </p>
      <div className="space-y-1">
        {layers.map((layer) => {
          const active = activeLayers.has(layer.id);
          return (
            <button
              key={layer.id}
              onClick={() => onToggle(layer.id)}
              className={cn(
                "w-full flex items-center justify-between gap-3 rounded-md px-2.5 py-2 text-xs transition-colors text-left",
                active
                  ? "bg-secondary/60 text-foreground"
                  : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="h-2.5 w-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: active ? layer.color : "#374151" }}
                />
                <span className="truncate font-medium">{layer.name}</span>
              </div>
              {active ? (
                <Eye className="h-3.5 w-3.5 shrink-0 text-primary" />
              ) : (
                <EyeOff className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
