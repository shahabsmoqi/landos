"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, CheckCircle2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AIInsightCard } from "@/components/AIInsightCard";
import { RiskBadge } from "@/components/RiskBadge";
import { developmentScenarios } from "@/data/developmentScenarios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PropertyIntelligence } from "@/types/normalized";

const COLORS = {
  fit: ["#22c55e", "#3b82f6", "#3b82f6", "#f59e0b", "#f59e0b"],
};

function FitBar({ score, max = 100 }: { score: number; max?: number }) {
  const pct = (score / max) * 100;
  const color = score >= 80 ? "#22c55e" : score >= 70 ? "#3b82f6" : "#f59e0b";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-bold w-8 text-right" style={{ color }}>{score}</span>
    </div>
  );
}

function DevelopmentContent() {
  const searchParams = useSearchParams();
  const isLiveMode = searchParams.get("mode") === "live";
  const [intelligence, setIntelligence] = useState<PropertyIntelligence | null>(null);

  useEffect(() => {
    if (!isLiveMode) return;
    try {
      const raw = localStorage.getItem("landos_property_intelligence");
      if (raw) setIntelligence(JSON.parse(raw) as PropertyIntelligence);
    } catch {}
  }, [isLiveMode]);

  const displayAddress = isLiveMode
    ? (intelligence?.address ?? "Loading…")
    : "2600 Dave Angel Rd, Burleson, TX 76028";

  const fitChartData = developmentScenarios.map((s) => ({
    name: s.shortName,
    score: s.fitScore,
  }));

  const timelineData = developmentScenarios
    .filter((s) => s.timelineMax > 0)
    .map((s) => ({
      name: s.shortName,
      min: s.timelineMin,
      max: s.timelineMax,
    }));

  return (
    <DashboardLayout
      title="Development Potential"
      subtitle={displayAddress}
      showPropertyActions
    >
      <div className="p-6 space-y-6">
        {/* Page header */}
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold">Development Scenario Analysis</h2>
        </div>
        <p className="text-sm text-muted-foreground -mt-4">
          Side-by-side comparison of all viable development scenarios for this parcel.
        </p>

        {/* Comparison table */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Scenario Comparison Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[800px]">
                <thead>
                  <tr className="border-b border-border">
                    {["Scenario", "Units / Lots", "Complexity", "Timeline", "Capital Required", "Ent. Risk", "Upside", "Fit Score"].map(
                      (h) => (
                        <th key={h} className="text-left text-muted-foreground font-medium py-2.5 pr-4 last:pr-0">
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {developmentScenarios.map((s) => (
                    <tr
                      key={s.id}
                      className={`border-b border-border/40 transition-colors ${
                        s.recommended
                          ? "bg-primary/5 hover:bg-primary/8"
                          : "hover:bg-secondary/20"
                      }`}
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{s.name}</span>
                          {s.recommended && (
                            <Badge className="text-[10px] bg-green-500/15 text-green-400 border-green-500/30 hover:bg-green-500/20 shrink-0">
                              Recommended
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{s.units}</td>
                      <td className="py-3 pr-4">
                        <RiskBadge
                          level={s.complexity === "Very High" ? "Very High" : s.complexity === "High" ? "High" : s.complexity === "Medium" ? "Medium" : "Low"}
                        />
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{s.timelineLabel}</td>
                      <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{s.capitalLabel}</td>
                      <td className="py-3 pr-4">
                        <RiskBadge level={s.entitlementRisk} />
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{s.upside}</td>
                      <td className="py-3">
                        <span
                          className={`text-sm font-bold ${
                            s.fitScore >= 80
                              ? "text-green-400"
                              : s.fitScore >= 70
                              ? "text-blue-400"
                              : "text-amber-400"
                          }`}
                        >
                          {s.fitScore}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Fit Score chart */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Fit Score by Scenario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fitChartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.02 250)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "oklch(0.60 0.02 240)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "oklch(0.60 0.02 240)" }} axisLine={false} tickLine={false} domain={[50, 100]} />
                    <Tooltip
                      contentStyle={{ background: "oklch(0.15 0.02 250)", border: "1px solid oklch(0.24 0.02 250)", borderRadius: 6, fontSize: 12 }}
                      itemStyle={{ color: "oklch(0.94 0.01 240)" }}
                      labelStyle={{ color: "oklch(0.60 0.02 240)", marginBottom: 4 }}
                    />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {fitChartData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={
                            fitChartData[i].score >= 80
                              ? "oklch(0.65 0.15 160)"
                              : fitChartData[i].score >= 70
                              ? "oklch(0.65 0.18 250)"
                              : "oklch(0.75 0.15 85)"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Timeline comparison */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Timeline Comparison (months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                {developmentScenarios.map((s) => (
                  <div key={s.id}>
                    <div className="flex justify-between text-[11px] mb-1.5">
                      <span className="text-muted-foreground">{s.shortName}</span>
                      <span className="text-foreground font-medium">{s.timelineLabel}</span>
                    </div>
                    {s.timelineMax > 0 ? (
                      <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 h-full rounded-full bg-primary/40"
                          style={{ left: `${(s.timelineMin / 48) * 100}%`, width: `${((s.timelineMax - s.timelineMin) / 48) * 100}%` }}
                        />
                        <div
                          className="absolute top-0 h-full rounded-full bg-primary"
                          style={{ left: "0%", width: `${(s.timelineMin / 48) * 100}%` }}
                        />
                      </div>
                    ) : (
                      <div className="h-2 bg-secondary/50 rounded-full" />
                    )}
                  </div>
                ))}
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>0 mo</span>
                  <span>12 mo</span>
                  <span>24 mo</span>
                  <span>36 mo</span>
                  <span>48 mo</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed scenario cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {developmentScenarios.map((s) => (
            <Card
              key={s.id}
              className={`border-border bg-card ${s.recommended ? "border-primary/30" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xs font-semibold leading-tight">{s.name}</CardTitle>
                  {s.recommended && (
                    <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-muted-foreground">{s.units}</span>
                  <span
                    className={`text-xl font-bold ${
                      s.fitScore >= 80 ? "text-green-400" : s.fitScore >= 70 ? "text-blue-400" : "text-amber-400"
                    }`}
                  >
                    {s.fitScore}
                  </span>
                </div>
                <FitBar score={s.fitScore} />
              </CardHeader>
              <CardContent>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">{s.description}</p>
                <div className="space-y-1.5 text-[11px] mb-3">
                  {[
                    { l: "Timeline", v: s.timelineLabel },
                    { l: "Capital", v: s.capitalLabel },
                    { l: "Entitlement Risk", v: s.entitlementRisk },
                    { l: "Complexity", v: s.complexity },
                  ].map(({ l, v }) => (
                    <div key={l} className="flex justify-between">
                      <span className="text-muted-foreground">{l}</span>
                      <span className="font-medium text-foreground">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border/40 pt-3">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Pros</p>
                  <ul className="space-y-1">
                    {s.pros.slice(0, 3).map((pro) => (
                      <li key={pro} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                        <div className="mt-1 h-1 w-1 rounded-full bg-green-400 shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5 mt-2.5">Cons</p>
                  <ul className="space-y-1">
                    {s.cons.slice(0, 2).map((con) => (
                      <li key={con} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                        <div className="mt-1 h-1 w-1 rounded-full bg-red-400 shrink-0" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommendation */}
        <AIInsightCard
          title="Development Recommendation"
          content="Best near-term strategy: verify utilities and jurisdiction first, then test the estate lot subdivision concept (5–8 lots) before pursuing aggressive rezoning. The estate lot path offers the highest risk-adjusted return for this parcel — lower entitlement complexity, shorter timeline, proven buyer demand in the DFW rural corridor, and preservation of optionality to pursue a denser scenario once infrastructure is confirmed. Do not commit engineering dollars to a 20+ lot subdivision concept until water and sewer availability are confirmed in writing from the relevant utility providers."
        />
      </div>
    </DashboardLayout>
  );
}

export default function DevelopmentPage() {
  return (
    <Suspense fallback={null}>
      <DevelopmentContent />
    </Suspense>
  );
}
