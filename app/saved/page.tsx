"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  ArrowRight,
  Search,
  Filter,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { savedDeals, DealStatus } from "@/data/savedDeals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const statusConfig: Record<DealStatus, { bg: string; text: string }> = {
  Watching: { bg: "bg-blue-500/15 border-blue-500/30", text: "text-blue-400" },
  "Under Review": { bg: "bg-purple-500/15 border-purple-500/30", text: "text-purple-400" },
  Feasibility: { bg: "bg-amber-500/15 border-amber-500/30", text: "text-amber-400" },
  Submitted: { bg: "bg-green-500/15 border-green-500/30", text: "text-green-400" },
  Passed: { bg: "bg-secondary border-border", text: "text-muted-foreground" },
};

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 85 ? "#22c55e" : score >= 75 ? "#3b82f6" : score >= 65 ? "#f59e0b" : "#ef4444";
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 44, height: 44 }}>
      <svg width={44} height={44} viewBox="0 0 44 44" className="-rotate-90 absolute inset-0">
        <circle cx={22} cy={22} r={r} fill="none" stroke="oklch(0.24 0.02 250)" strokeWidth={3} />
        <circle
          cx={22}
          cy={22}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="text-xs font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

export default function SavedDealsPage() {
  const [search, setSearch] = useState("");
  const deals = savedDeals.filter(
    (d) =>
      d.address.toLowerCase().includes(search.toLowerCase()) ||
      d.city.toLowerCase().includes(search.toLowerCase()) ||
      d.intendedUse.toLowerCase().includes(search.toLowerCase())
  );

  const totalDeals = savedDeals.length;
  const avgScore = Math.round(savedDeals.reduce((s, d) => s + d.score, 0) / savedDeals.length);
  const activeDeals = savedDeals.filter((d) => d.status !== "Passed").length;

  return (
    <DashboardLayout title="Saved Deals" subtitle={`${totalDeals} properties tracked`}>
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Deals", value: totalDeals.toString(), icon: Bookmark },
            { label: "Active Deals", value: activeDeals.toString(), icon: TrendingUp },
            { label: "Avg. Score", value: avgScore.toString(), icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        {/* Search / filter bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by address, city, or use..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-secondary border-border text-sm"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs border-border bg-transparent hover:bg-secondary"
            onClick={() => toast.info("Filters coming soon")}
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>
          <Button asChild size="sm" className="h-9 text-xs gap-1.5">
            <Link href="/analyze">
              <Search className="h-3.5 w-3.5" />
              Add Property
            </Link>
          </Button>
        </div>

        {/* Table view */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Portfolio ({deals.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[700px]">
                <thead>
                  <tr className="border-b border-border">
                    {["Score", "Address", "Acres", "Intended Use", "$/Acre", "Status", "Last Updated", "Action"].map(
                      (h) => (
                        <th key={h} className="text-left text-muted-foreground font-medium py-2.5 pr-4 last:pr-0">
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal) => {
                    const sc = statusConfig[deal.status];
                    return (
                      <tr key={deal.id} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                        <td className="py-3 pr-4">
                          <ScoreRing score={deal.score} />
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              <p className="font-medium text-foreground leading-tight">{deal.address}</p>
                              <p className="text-muted-foreground text-[10px]">{deal.city}, {deal.state} {deal.zip}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">{deal.acres} ac</td>
                        <td className="py-3 pr-4 text-muted-foreground">{deal.intendedUse}</td>
                        <td className="py-3 pr-4 text-muted-foreground">${deal.pricePerAcre.toLocaleString()}</td>
                        <td className="py-3 pr-4">
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${sc.bg} ${sc.text}`}>
                            {deal.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {new Date(deal.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="py-3">
                          {deal.isDemo ? (
                            <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-primary hover:bg-primary/10 px-2">
                              <Link href="/dashboard/demo-property">
                                Open <ArrowRight className="h-3 w-3 ml-1" />
                              </Link>
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-muted-foreground hover:text-foreground px-2"
                              onClick={() => toast.info("Demo only — opens 2600 Dave Angel Rd report")}
                            >
                              Open <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Deal cards (mobile-friendly) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deals.map((deal) => {
            const sc = statusConfig[deal.status];
            return (
              <div
                key={deal.id}
                className={`rounded-lg border bg-card p-4 ${deal.isDemo ? "border-primary/30" : "border-border"}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground leading-tight truncate">{deal.address}</p>
                    <p className="text-[11px] text-muted-foreground">{deal.city}, {deal.state}</p>
                  </div>
                  <ScoreRing score={deal.score} />
                </div>
                <div className="space-y-1.5 text-[11px] mb-3">
                  {[
                    { l: "Acres", v: `${deal.acres} ac` },
                    { l: "Intended Use", v: deal.intendedUse },
                    { l: "Asking", v: `$${deal.askingPrice.toLocaleString()}` },
                  ].map(({ l, v }) => (
                    <div key={l} className="flex justify-between">
                      <span className="text-muted-foreground">{l}</span>
                      <span className="font-medium text-foreground">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border/40">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${sc.bg} ${sc.text}`}>
                    {deal.status}
                  </span>
                  {deal.isDemo ? (
                    <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-primary hover:bg-primary/10 px-2">
                      <Link href="/dashboard/demo-property">
                        View Report <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground px-2"
                      onClick={() => toast.info("Opens demo property report")}
                    >
                      View Report <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
