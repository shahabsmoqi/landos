"use client";

import { useState } from "react";
import {
  Database,
  CheckCircle2,
  Clock,
  Upload,
  Lock,
  RefreshCw,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { dataSources, DataSource, DataSourceStatus } from "@/data/dataSources";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const statusConfig: Record<DataSourceStatus, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  Connected: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30" },
  Pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  "Manual Upload": { icon: Upload, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  "Coming Soon": { icon: Lock, color: "text-muted-foreground", bg: "bg-secondary", border: "border-border" },
};

const categories = ["All", "Property Records", "Zoning & Land Use", "Environmental", "Utilities", "Permits", "Demographics", "Transportation", "Imagery"];

function DataSourceCard({ source }: { source: DataSource }) {
  const sc = statusConfig[source.status];
  const StatusIcon = sc.icon;

  return (
    <div className={`rounded-lg border bg-card p-4 ${source.status === "Connected" ? "border-green-500/20" : "border-border"} hover:border-primary/20 transition-colors`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xs font-semibold text-foreground">{source.name}</h3>
          </div>
          <Badge variant="outline" className="text-[10px] border-border text-muted-foreground py-0">
            {source.category}
          </Badge>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${sc.bg} ${sc.border}`}>
          <StatusIcon className={`h-3 w-3 ${sc.color}`} />
          <span className={`text-[10px] font-medium ${sc.color}`}>{source.status}</span>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">{source.description}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {source.dataTypes.slice(0, 4).map((t) => (
          <span key={t} className="text-[10px] rounded-full bg-secondary px-2 py-0.5 text-muted-foreground">
            {t}
          </span>
        ))}
        {source.dataTypes.length > 4 && (
          <span className="text-[10px] rounded-full bg-secondary px-2 py-0.5 text-muted-foreground">
            +{source.dataTypes.length - 4} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/40">
        {source.lastSync ? (
          <span className="text-[10px] text-muted-foreground">
            Last sync: {new Date(source.lastSync).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground">
            {source.status === "Coming Soon" ? "In development" : "Not synced"}
          </span>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-[10px] px-2 text-muted-foreground hover:text-foreground"
          onClick={() => {
            if (source.status === "Connected") {
              toast.success(`Syncing ${source.name}...`, { description: "Data refresh queued." });
            } else if (source.status === "Coming Soon") {
              toast.info("Coming Soon", { description: `${source.name} integration is in development.` });
            } else if (source.status === "Manual Upload") {
              toast.info("Upload", { description: "Manual upload feature coming soon." });
            } else {
              toast.info("Pending", { description: "Integration setup in progress." });
            }
          }}
        >
          {source.status === "Connected" ? (
            <><RefreshCw className="h-3 w-3 mr-1" />Sync</>
          ) : source.status === "Coming Soon" ? (
            <>Notify Me <ChevronRight className="h-3 w-3 ml-1" /></>
          ) : (
            <>Configure <ChevronRight className="h-3 w-3 ml-1" /></>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function DataSourcesPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? dataSources
    : dataSources.filter((s) => s.category === activeCategory);

  const connectedCount = dataSources.filter((s) => s.status === "Connected").length;
  const totalCount = dataSources.length;

  return (
    <DashboardLayout title="Data Sources" subtitle="Integration & data pipeline status">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold">Data Integration Hub</h2>
        </div>
        <p className="text-sm text-muted-foreground -mt-4 max-w-2xl">
          LandOS aggregates data from multiple public and commercial sources to power the development intelligence layer.
          This page shows the current integration status and data pipeline architecture.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "Connected",
              value: connectedCount.toString(),
              color: "text-green-400",
              bg: "border-green-500/20 bg-green-500/5",
              icon: CheckCircle2,
            },
            {
              label: "Pending",
              value: dataSources.filter((s) => s.status === "Pending").toString().length.toString(),
              color: "text-amber-400",
              bg: "border-amber-500/20 bg-amber-500/5",
              icon: Clock,
            },
            {
              label: "Manual Upload",
              value: dataSources.filter((s) => s.status === "Manual Upload").length.toString(),
              color: "text-blue-400",
              bg: "border-blue-500/20 bg-blue-500/5",
              icon: Upload,
            },
            {
              label: "Coming Soon",
              value: dataSources.filter((s) => s.status === "Coming Soon").length.toString(),
              color: "text-muted-foreground",
              bg: "border-border bg-secondary/30",
              icon: Lock,
            },
          ].map(({ label, value, color, bg, icon: Icon }) => (
            <div key={label} className={`rounded-lg border p-4 ${bg}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Overall health */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Data Pipeline Health</span>
            <span className="text-xs text-green-400 font-medium">{connectedCount}/{totalCount} active</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 rounded-full"
              style={{ width: `${(connectedCount / totalCount) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            {connectedCount} of {totalCount} data sources connected and syncing. Pending integrations
            are in active development.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${
                activeCategory === cat
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-transparent text-muted-foreground hover:border-border/80 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Data source cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((source) => (
            <DataSourceCard key={source.id} source={source} />
          ))}
        </div>

        {/* Future architecture note */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold text-primary">Platform Architecture Note</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              This Data Sources page represents the future integration architecture of LandOS. In the production
              platform, each module will connect to live APIs, updated on configurable refresh cycles ranging from
              real-time (permit status) to weekly (CAD valuations) to quarterly (comprehensive plan updates).
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The prototype demo uses locally stored simulation data. All connected/pending statuses shown here are
              illustrative of the planned production integration state.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
