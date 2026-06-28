"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import type { PropertyIntelligence } from "@/types/normalized";
import { FakeGISMap } from "@/components/map/FakeGISMap";
import { MapLayerToggle } from "@/components/map/MapLayerToggle";
import { MapLegend } from "@/components/map/MapLegend";
import { MapMetricPanel } from "@/components/map/MapMetricPanel";
import { mapLayers, developmentPins, intelligenceCards } from "@/data/mapLayers";
import type { LayerId } from "@/types/map";

function getDefaultLayers(): Set<LayerId> {
  return new Set(
    mapLayers.filter((l) => l.visibleDefault).map((l) => l.id)
  );
}

function MapContent() {
  const searchParams = useSearchParams();
  const isLiveMode = searchParams.get("mode") === "live";
  const [intelligence, setIntelligence] = useState<PropertyIntelligence | null>(null);
  const [activeLayers, setActiveLayers] = useState<Set<LayerId>>(getDefaultLayers);

  useEffect(() => {
    if (!isLiveMode) return;
    try {
      const raw = localStorage.getItem("landos_property_intelligence");
      if (raw) setIntelligence(JSON.parse(raw) as PropertyIntelligence);
    } catch {}
  }, [isLiveMode]);

  const displayAddress = isLiveMode
    ? (intelligence?.address ?? "Loading…")
    : "2600 Dave Angel Rd";

  const toggleLayer = (id: LayerId) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCardClick = (layerId?: LayerId) => {
    if (layerId) toggleLayer(layerId);
  };

  return (
    <DashboardLayout
      title="Map Intelligence"
      subtitle="Visualize parcel boundaries, zoning context, flood risk, utilities, and nearby growth signals."
      showPropertyActions
    >
      <div className="p-6 space-y-4">
        {/* Main map + right panel */}
        <div className="grid xl:grid-cols-[1fr_280px] gap-4">
          {/* Map area */}
          <div className="space-y-3">
            <FakeGISMap activeLayers={activeLayers} pins={developmentPins} />

            {/* Instruction hint */}
            <div className="rounded-lg border border-border bg-secondary/20 px-4 py-2.5 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <p className="text-[11px] text-muted-foreground">
                Click the parcel outline to view parcel info. Click any colored pin to see development context. Toggle layers in the panel below.
              </p>
            </div>
          </div>

          {/* Right side — intelligence cards */}
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-card px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                Intelligence Layer
              </p>
              <p className="text-xs text-foreground font-medium truncate">{displayAddress}</p>
            </div>
            <MapMetricPanel
              cards={intelligenceCards}
              activeLayers={activeLayers}
              onCardClick={handleCardClick}
            />
          </div>
        </div>

        {/* Bottom row — layer toggles + legend */}
        <div className="grid md:grid-cols-[1fr_220px] gap-4">
          <MapLayerToggle
            layers={mapLayers}
            activeLayers={activeLayers}
            onToggle={toggleLayer}
          />
          <MapLegend />
        </div>

        {/* Data source note */}
        <div className="rounded-lg border border-border bg-secondary/10 px-4 py-3">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Map Data Notice:</strong> All parcel boundaries, overlays, and development markers shown are demo geometry for illustration purposes.
            Flood zone data is fetched live from FEMA NFHL. A Mapbox token (<code className="text-primary text-[10px]">NEXT_PUBLIC_MAPBOX_TOKEN</code>) will
            enable satellite and street basemaps in a future release.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={null}>
      <MapContent />
    </Suspense>
  );
}
