"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lock,
  ExternalLink,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { DiscoveredSource, SourceStatus, SourceType } from "@/types/sources";

const STATUS_CONFIG: Record<
  SourceStatus,
  { icon: React.ElementType; color: string; bg: string; border: string; label: string }
> = {
  connected: {
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    label: "Connected",
  },
  discovered: {
    icon: AlertCircle,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    label: "Discovered",
  },
  failed: {
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    label: "Failed",
  },
  needsKey: {
    icon: Lock,
    color: "text-muted-foreground",
    bg: "bg-secondary",
    border: "border-border",
    label: "Needs Key",
  },
  unsupported: {
    icon: XCircle,
    color: "text-muted-foreground",
    bg: "bg-secondary",
    border: "border-border",
    label: "Unsupported",
  },
};

const TYPE_FILTERS: SourceType[] = [
  "parcel",
  "zoning",
  "flood",
  "landUse",
  "permits",
  "utilities",
  "traffic",
  "schools",
  "demographics",
  "environment",
];

function handleTestQuery(source: DiscoveredSource) {
  if (source.status === "connected") {
    toast.success(`Query test: ${source.name}`, {
      description: "Source is live and responding.",
    });
  } else if (source.status === "needsKey") {
    toast.info(`API key required`, {
      description: source.notes ?? "Configure provider in settings.",
    });
  } else if (source.status === "discovered") {
    toast.info(`Testing ${source.name}…`, {
      description:
        "Candidate source discovered but not yet validated. Use /api/arcgis/query to test.",
    });
  } else {
    toast.error(`${source.name} unavailable`, {
      description: source.notes ?? "Endpoint did not respond.",
    });
  }
}

export function DiscoveredSourcesTable({
  sources,
}: {
  sources: DiscoveredSource[];
}) {
  const [filter, setFilter] = useState<SourceType | "all">("all");

  const filtered =
    filter === "all" ? sources : sources.filter((s) => s.type === filter);

  const presentTypes = [...new Set(sources.map((s) => s.type))];

  return (
    <div className="space-y-3">
      {/* Filter chips */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
            filter === "all"
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
          }`}
        >
          All ({sources.length})
        </button>
        {TYPE_FILTERS.filter((t) => presentTypes.includes(t)).map((type) => {
          const count = sources.filter((s) => s.type === type).length;
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`rounded-full border px-3 py-1 text-[11px] font-medium capitalize transition-colors ${
                filter === type
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
              }`}
            >
              {type} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left px-4 py-2.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Source
              </th>
              <th className="text-left px-4 py-2.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground hidden md:table-cell">
                Type
              </th>
              <th className="text-left px-4 py-2.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground hidden lg:table-cell">
                Jurisdiction
              </th>
              <th className="text-left px-4 py-2.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </th>
              <th className="text-right px-4 py-2.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Score
              </th>
              <th className="text-right px-4 py-2.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filtered.map((source) => {
              const sc = STATUS_CONFIG[source.status];
              const StatusIcon = sc.icon;
              return (
                <tr
                  key={source.id}
                  className="hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground leading-tight">
                      {source.name}
                    </div>
                    {source.notes && (
                      <div className="text-[10px] text-muted-foreground/60 mt-0.5 leading-tight">
                        {source.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge
                      variant="outline"
                      className="text-[10px] border-border text-muted-foreground capitalize py-0"
                    >
                      {source.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {source.jurisdiction}
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 ${sc.bg} ${sc.border}`}
                    >
                      <StatusIcon className={`h-3 w-3 ${sc.color}`} />
                      <span className={`text-[10px] font-medium ${sc.color}`}>
                        {sc.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`font-bold ${
                        source.confidence >= 80
                          ? "text-green-400"
                          : source.confidence >= 60
                          ? "text-amber-400"
                          : source.confidence >= 30
                          ? "text-blue-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {source.confidence > 0 ? source.confidence : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={source.endpointUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        title="Open endpoint"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] px-2 text-muted-foreground hover:text-foreground"
                        onClick={() => handleTestQuery(source)}
                      >
                        <Search className="h-3 w-3 mr-1" />
                        Test
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-xs text-muted-foreground"
                >
                  No sources found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
