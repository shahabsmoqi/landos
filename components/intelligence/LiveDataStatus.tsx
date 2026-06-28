"use client";

import { CheckCircle2, XCircle, AlertCircle, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PropertyIntelligence, ConfidenceLevel } from "@/types/normalized";

const CONFIDENCE_CONFIG: Record<
  ConfidenceLevel,
  { icon: React.ElementType; color: string; bg: string; border: string; label: string }
> = {
  live: {
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    label: "Live",
  },
  estimated: {
    icon: AlertCircle,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    label: "Estimated",
  },
  demo: {
    icon: AlertCircle,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    label: "Demo",
  },
  missing: {
    icon: XCircle,
    color: "text-muted-foreground",
    bg: "bg-secondary",
    border: "border-border",
    label: "Not Found",
  },
};

function StatusRow({
  label,
  confidence,
  detail,
  sourceUrl,
}: {
  label: string;
  confidence: ConfidenceLevel;
  detail?: string;
  sourceUrl?: string;
}) {
  const cfg = CONFIDENCE_CONFIG[confidence];
  const Icon = cfg.icon;

  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2 min-w-0">
        <Icon className={`h-3.5 w-3.5 shrink-0 ${cfg.color}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
        {detail && (
          <span className="text-[10px] text-muted-foreground/60 truncate hidden sm:inline">
            {detail}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 shrink-0 ml-2">
        <Badge
          variant="outline"
          className={`text-[10px] border py-0 px-2 ${cfg.bg} ${cfg.border} ${cfg.color}`}
        >
          {cfg.label}
        </Badge>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

export function LiveDataStatus({
  intelligence,
}: {
  intelligence: PropertyIntelligence;
}) {
  const { confidenceSummary, flood, demographics, geocode, discoveredSources } =
    intelligence;

  const discoveredTypes = [...new Set(discoveredSources.map((s) => s.type))];

  return (
    <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse shrink-0" />
          <span className="text-xs font-semibold text-green-400">
            Live Intelligence Mode
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {new Date(intelligence.fetchedAt).toLocaleTimeString()}
        </span>
      </div>

      <div className="space-y-0.5 divide-y divide-border/30">
        <StatusRow
          label="Geocoder"
          confidence={confidenceSummary.geocoder}
          detail={
            geocode?.matchedAddress
              ? `→ ${geocode.matchedAddress}`
              : undefined
          }
        />
        <StatusRow
          label="FEMA Flood"
          confidence={confidenceSummary.flood}
          detail={flood ? `Zone ${flood.zoneCode}` : undefined}
          sourceUrl={flood?.sourceUrl}
        />
        <StatusRow
          label="Census ACS"
          confidence={confidenceSummary.demographics}
          detail={
            demographics ? `Tract ${demographics.tract}` : undefined
          }
        />
        <StatusRow
          label="Parcel Records"
          confidence={confidenceSummary.parcel}
          detail="Provider required (Regrid)"
        />
        <StatusRow
          label="Zoning Layer"
          confidence={confidenceSummary.zoning}
          detail={
            confidenceSummary.zoning === "missing"
              ? "GIS query not yet run"
              : undefined
          }
        />
      </div>

      {discoveredSources.length > 0 && (
        <div className="mt-3 pt-3 border-t border-green-500/20">
          <p className="text-[10px] text-muted-foreground/70 mb-2">
            {discoveredSources.length} public GIS source
            {discoveredSources.length !== 1 ? "s" : ""} discovered
          </p>
          <div className="flex flex-wrap gap-1">
            {discoveredTypes.slice(0, 6).map((type) => (
              <span
                key={type}
                className="text-[10px] rounded-full border border-green-500/20 bg-green-500/10 text-green-400 px-2 py-0.5 capitalize"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
