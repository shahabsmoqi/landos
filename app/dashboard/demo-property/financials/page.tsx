"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { NormalizedListing, PropertyIntelligence } from "@/types/normalized";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { DollarSign, AlertTriangle, Building2, Home, ExternalLink } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000)
    return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000)
    return `$${Math.round(n / 1_000).toLocaleString()}K`;
  return `$${Math.round(n).toLocaleString()}`;
}

function pct(n: number) {
  return `${n.toFixed(1)}%`;
}

interface FinancialInputs {
  purchasePrice: number;
  acres: number;
  lots: number;
  avgLotPrice: number;
  softCosts: number;
  infrastructure: number;
  financing: number;
  closingCosts: number;
  contingencyPct: number;
}

function calcModel(inputs: FinancialInputs) {
  const contingency = (inputs.softCosts + inputs.infrastructure + inputs.financing) * (inputs.contingencyPct / 100);
  const totalCost =
    inputs.purchasePrice +
    inputs.softCosts +
    inputs.infrastructure +
    inputs.financing +
    inputs.closingCosts +
    contingency;
  const grossRevenue = inputs.lots * inputs.avgLotPrice;
  const profit = grossRevenue - totalCost;
  const margin = grossRevenue > 0 ? (profit / grossRevenue) * 100 : 0;
  const costPerLot = inputs.lots > 0 ? totalCost / inputs.lots : 0;
  const revenuePerAcre = inputs.acres > 0 ? grossRevenue / inputs.acres : 0;
  const breakEvenLotPrice = inputs.lots > 0 ? totalCost / inputs.lots : 0;
  return { totalCost, grossRevenue, profit, margin, costPerLot, revenuePerAcre, breakEvenLotPrice, contingency };
}

function FinancialsContent() {
  const searchParams = useSearchParams();
  const isLiveMode = searchParams.get("mode") === "live";
  const [intelligence, setIntelligence] = useState<PropertyIntelligence | null>(null);
  const [inputs, setInputs] = useState<FinancialInputs>({
    purchasePrice: 934900,
    acres: 14.07,
    lots: 24,
    avgLotPrice: 95000,
    softCosts: 180000,
    infrastructure: 950000,
    financing: 120000,
    closingCosts: 45000,
    contingencyPct: 10,
  });

  useEffect(() => {
    if (!isLiveMode) return;
    try {
      const raw = localStorage.getItem("landos_property_intelligence");
      if (raw) {
        const intel = JSON.parse(raw) as PropertyIntelligence;
        setIntelligence(intel);

        const updates: Partial<FinancialInputs> = {};

        if (intel.parcel?.acreage != null) {
          updates.acres = parseFloat(intel.parcel.acreage.toFixed(2));
        }
        if (intel.parcel?.marketValue || intel.parcel?.assessedValue) {
          updates.purchasePrice = intel.parcel.marketValue ?? intel.parcel.assessedValue!;
        }
        if (intel.listings?.length) {
          const prices = intel.listings
            .filter((l) => l.listPrice && l.listPrice > 0)
            .map((l) => l.listPrice!)
            .sort((a, b) => a - b);
          if (prices.length) {
            updates.avgLotPrice = prices[Math.floor(prices.length / 2)];
          }
        }

        if (Object.keys(updates).length) {
          setInputs((prev) => ({ ...prev, ...updates }));
        }
      }
    } catch {}
  }, [isLiveMode]);

  const displayAddress = isLiveMode
    ? (intelligence?.address ?? "Loading…")
    : "2600 Dave Angel Rd, Burleson, TX 76028";

  const model = useMemo(() => calcModel(inputs), [inputs]);

  const update = (key: keyof FinancialInputs, raw: string) => {
    const val = parseFloat(raw.replace(/[^0-9.]/g, "")) || 0;
    setInputs((prev) => ({ ...prev, [key]: val }));
  };

  const sensitivityPrices = [75000, 85000, 95000, 105000, 115000];
  const sensitivityData = sensitivityPrices.map((price) => {
    const m = calcModel({ ...inputs, avgLotPrice: price });
    return {
      price: `$${price / 1000}K`,
      profit: Math.round(m.profit / 1000),
      margin: parseFloat(m.margin.toFixed(1)),
      revenue: Math.round(m.grossRevenue / 1000),
    };
  });

  const isProfit = model.profit >= 0;

  return (
    <DashboardLayout
      title="Financial Model"
      subtitle={displayAddress}
      showPropertyActions
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold">Financial Feasibility Calculator</h2>
        </div>

        <div className="rounded-lg border border-amber-500/20 bg-amber-500/8 p-4 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300 leading-relaxed">
            This is a prototype estimate only. Real feasibility requires a survey, civil engineering
            assessment, utility verification, market comparables, and local approval confirmation.
            All inputs are adjustable — defaults are illustrative only.
          </p>
        </div>

        <div className="grid lg:grid-cols-[380px,1fr] gap-6">
          {/* Inputs */}
          <Card className="border-border bg-card h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Model Inputs</CardTitle>
              <p className="text-xs text-muted-foreground">All fields are editable</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "purchasePrice" as const, label: "Purchase Price", prefix: "$" },
                { key: "acres" as const, label: "Total Acres", prefix: "" },
                { key: "lots" as const, label: "Number of Lots", prefix: "" },
                { key: "avgLotPrice" as const, label: "Avg Lot Sale Price", prefix: "$" },
                { key: "softCosts" as const, label: "Soft Costs", prefix: "$" },
                { key: "infrastructure" as const, label: "Infrastructure Cost", prefix: "$" },
                { key: "financing" as const, label: "Financing Cost", prefix: "$" },
                { key: "closingCosts" as const, label: "Closing Costs", prefix: "$" },
                { key: "contingencyPct" as const, label: "Contingency %", prefix: "" },
              ].map(({ key, label, prefix }) => (
                <div key={key}>
                  <Label className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1.5 block">
                    {label}
                  </Label>
                  <div className="relative">
                    {prefix && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        {prefix}
                      </span>
                    )}
                    <Input
                      value={inputs[key]}
                      onChange={(e) => update(key, e.target.value)}
                      className={`bg-secondary border-border text-sm h-9 ${prefix ? "pl-6" : ""}`}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Outputs */}
          <div className="space-y-4">
            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Total Project Cost",
                  value: fmt(model.totalCost),
                  sub: "All-in including contingency",
                  highlight: false,
                },
                {
                  label: "Gross Revenue",
                  value: fmt(model.grossRevenue),
                  sub: `${inputs.lots} lots × ${fmt(inputs.avgLotPrice)}`,
                  highlight: false,
                },
                {
                  label: "Estimated Profit",
                  value: fmt(model.profit),
                  sub: isProfit ? "Above break-even" : "Below break-even",
                  highlight: true,
                  positive: isProfit,
                },
                {
                  label: "Profit Margin",
                  value: pct(model.margin),
                  sub: "As % of gross revenue",
                  highlight: true,
                  positive: isProfit,
                },
                {
                  label: "Cost Per Lot",
                  value: fmt(model.costPerLot),
                  sub: "All-in cost ÷ lots",
                  highlight: false,
                },
                {
                  label: "Revenue Per Acre",
                  value: fmt(model.revenuePerAcre),
                  sub: `${inputs.acres} acres`,
                  highlight: false,
                },
                {
                  label: "Break-Even Lot Price",
                  value: fmt(model.breakEvenLotPrice),
                  sub: "Minimum lot price needed",
                  highlight: false,
                },
                {
                  label: "Contingency",
                  value: fmt(model.contingency),
                  sub: `${inputs.contingencyPct}% of hard + soft costs`,
                  highlight: false,
                },
              ].map(({ label, value, sub, highlight, positive }) => (
                <div
                  key={label}
                  className={`rounded-lg border p-4 ${
                    highlight
                      ? positive !== false
                        ? "border-green-500/30 bg-green-500/8"
                        : "border-red-500/30 bg-red-500/8"
                      : "border-border bg-card"
                  }`}
                >
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
                  <p
                    className={`text-xl font-bold ${
                      highlight ? (positive !== false ? "text-green-400" : "text-red-400") : "text-foreground"
                    }`}
                  >
                    {value}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            {/* P&L Summary */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {[
                  { label: "Purchase Price", amount: inputs.purchasePrice },
                  { label: "Soft Costs", amount: inputs.softCosts },
                  { label: "Infrastructure", amount: inputs.infrastructure },
                  { label: "Financing Cost", amount: inputs.financing },
                  { label: "Closing Costs", amount: inputs.closingCosts },
                  { label: `Contingency (${inputs.contingencyPct}%)`, amount: model.contingency },
                ].map(({ label, amount }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="text-xs font-medium">{fmt(amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 mt-1 border-t border-border">
                  <span className="text-xs font-semibold text-foreground">Total Project Cost</span>
                  <span className="text-sm font-bold text-foreground">{fmt(model.totalCost)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Sensitivity Table */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Sensitivity Analysis — Avg Lot Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        {["Lot Price", "Gross Revenue", "Profit / (Loss)", "Margin"].map((h) => (
                          <th key={h} className="text-left text-muted-foreground font-medium py-2 pr-4 last:pr-0">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sensitivityData.map((row) => (
                        <tr
                          key={row.price}
                          className={`border-b border-border/40 ${
                            row.price === `$${inputs.avgLotPrice / 1000}K` ? "bg-primary/5" : "hover:bg-secondary/20"
                          } transition-colors`}
                        >
                          <td className="py-2.5 pr-4 font-medium">
                            {row.price}
                            {row.price === `$${inputs.avgLotPrice / 1000}K` && (
                              <span className="ml-2 text-[10px] text-primary">(current)</span>
                            )}
                          </td>
                          <td className="py-2.5 pr-4 text-muted-foreground">${row.revenue}K</td>
                          <td className={`py-2.5 pr-4 font-medium ${row.profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                            {row.profit >= 0 ? "+" : ""}${row.profit}K
                          </td>
                          <td className={`py-2.5 font-medium ${row.margin >= 0 ? "text-green-400" : "text-red-400"}`}>
                            {row.margin >= 0 ? "" : ""}{row.margin}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Sensitivity chart */}
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sensitivityData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.02 250)" vertical={false} />
                      <XAxis dataKey="price" tick={{ fontSize: 11, fill: "oklch(0.60 0.02 240)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "oklch(0.60 0.02 240)" }} axisLine={false} tickLine={false} unit="K" />
                      <Tooltip
                        contentStyle={{ background: "oklch(0.15 0.02 250)", border: "1px solid oklch(0.24 0.02 250)", borderRadius: 6, fontSize: 12 }}
                        formatter={(val) => [`$${val}K`, "Profit"]}
                      />
                      <ReferenceLine y={0} stroke="oklch(0.60 0.02 240)" strokeDasharray="4 2" />
                      <Line
                        type="monotone"
                        dataKey="profit"
                        stroke="oklch(0.65 0.18 250)"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "oklch(0.65 0.18 250)", stroke: "none" }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Market Comparables — live mode only */}
        {isLiveMode && intelligence?.listings?.length ? (
          <MarketComps listings={intelligence.listings} />
        ) : isLiveMode ? (
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <Building2 className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No nearby listings found for this area
            </p>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
}

function fmtPrice(n?: number) {
  if (!n) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  return `$${Math.round(n / 1000)}K`;
}

function MarketComps({ listings }: { listings: NormalizedListing[] }) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-semibold">
            Market Comparables
          </CardTitle>
          <span className="ml-auto text-[11px] text-muted-foreground">
            {listings.length} listing{listings.length !== 1 ? "s" : ""}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Nearby properties from Zillow and MLS
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {listings.map((l) => (
            <div
              key={l.listingId}
              className="rounded-lg border border-border bg-secondary/30 p-3 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-medium text-foreground leading-tight line-clamp-2">
                  {l.address}
                </p>
                {l.listingUrl && (
                  <a
                    href={l.listingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-foreground">
                  {fmtPrice(l.listPrice)}
                </span>
                {l.pricePerSqft && (
                  <span className="text-[11px] text-muted-foreground">
                    ${l.pricePerSqft}/sqft
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                {l.beds != null && (
                  <span className="flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    {l.beds} bd
                  </span>
                )}
                {l.baths != null && <span>{l.baths} ba</span>}
                {l.sqft != null && <span>{l.sqft.toLocaleString()} sqft</span>}
                {l.acres != null && <span>{l.acres} ac</span>}
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                    l.listingStatus?.includes("SALE") || l.listingStatus === "Active"
                      ? "bg-green-500/15 text-green-400"
                      : l.listingStatus?.includes("SOLD") || l.listingStatus === "Closed"
                      ? "bg-blue-500/15 text-blue-400"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {l.listingStatus ?? "Unknown"}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded border ${
                    l.source === "zillow"
                      ? "border-blue-500/30 text-blue-400"
                      : "border-purple-500/30 text-purple-400"
                  }`}
                >
                  {l.source === "zillow" ? "Zillow" : "MLS"}
                </span>
              </div>
              {l.daysOnMarket != null && (
                <p className="text-[10px] text-muted-foreground">
                  {l.daysOnMarket} days on market
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function FinancialsPage() {
  return (
    <Suspense fallback={null}>
      <FinancialsContent />
    </Suspense>
  );
}
