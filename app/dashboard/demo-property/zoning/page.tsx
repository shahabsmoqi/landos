"use client";

import { useState, useEffect } from "react";
import { Map, CheckCircle2, XCircle, Sparkles, ChevronDown, Droplets, AlertTriangle, ExternalLink, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ScoreCard } from "@/components/ScoreCard";
import { AIInsightCard } from "@/components/AIInsightCard";
import { RiskBadge } from "@/components/RiskBadge";
import { demoProperty } from "@/data/demoProperty";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FloodZoneResult } from "@/lib/floodZone";

const zoningQA = [
  {
    q: "Can I build townhomes here?",
    a: "Based on the demo data, townhomes would likely require rezoning or planned development (PD) approval. The property is currently in county jurisdiction with unrestricted zoning — which permits residential and agricultural uses but doesn't define density standards. The strongest first step would be a pre-development meeting with the city or county to confirm jurisdiction, utilities, density tolerance, road standards, and drainage requirements. Budget 18–30 months for a townhome entitlement process.",
  },
  {
    q: "How many lots could fit?",
    a: "At 14.07 acres, the parcel could theoretically support 5–8 large estate lots (1.5–2.5 acres each) with minimal infrastructure, or 20–35 smaller residential lots (7,000–10,000 sqft) with full engineering and rezoning. The actual yield depends on drainage easements, road right-of-way, utility corridors, and applicable setback and open space requirements. A civil engineer should prepare a concept plan before committing to any specific lot count.",
  },
  {
    q: "Would rezoning be required?",
    a: "For an estate lot minor subdivision (5–8 lots), rezoning may not be required under current county regulations. For a standard residential subdivision (20+ lots), rezoning is likely required. The property's county jurisdiction complicates this — if Burleson has ETJ authority, you would be subject to their platting standards without having access to city utilities. Confirming ETJ status is the single most important early step in this process.",
  },
  {
    q: "What should I ask the city?",
    a: "At a pre-development meeting, your key questions should be: (1) Does Burleson or Johnson County have jurisdiction over platting and development standards for this parcel? (2) Is the property in Burleson's ETJ? (3) What utility infrastructure is within extension reach? (4) What road standards apply to internal subdivision streets? (5) What density would be approved without rezoning? (6) What is the current platting process and timeline? (7) Are there any known drainage or floodplain concerns the city is aware of?",
  },
  {
    q: "What are the biggest entitlement risks?",
    a: "The top entitlement risks for this property are: (1) ETJ/jurisdiction ambiguity — if both city and county claim authority, the process becomes unpredictable; (2) utility availability — no public water or sewer confirmation, which may block any platting approval; (3) drainage requirements — stormwater detention requirements can consume 10–20% of the site and significantly impact lot yield; (4) road standards — county road requirements may require costly paving upgrades to Dave Angel Rd; (5) neighborhood opposition if pursuing higher density near existing rural residential properties.",
  },
];

export default function ZoningPage() {
  const [activeQ, setActiveQ] = useState<number | null>(null);
  const [flood, setFlood] = useState<FloodZoneResult | null>(null);
  const [floodLoading, setFloodLoading] = useState(true);
  const p = demoProperty;

  useEffect(() => {
    fetch("/api/flood-zone?address=2600+Dave+Angel+Rd+Burleson+TX+76028")
      .then((r) => r.json())
      .then((data: FloodZoneResult) => setFlood(data))
      .catch(() => {})
      .finally(() => setFloodLoading(false));
  }, []);

  return (
    <DashboardLayout
      title="Zoning & Entitlements"
      subtitle="2600 Dave Angel Rd, Burleson, TX 76028"
      showPropertyActions
    >
      <div className="p-6 space-y-6">
        {/* Page header */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Map className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold">Zoning Intelligence Command Center</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Current jurisdiction, zoning classification, entitlement requirements, and rezoning probability assessment.
            </p>
          </div>
          <ScoreCard score={p.zoning.rezoningScore} label="Rezoning Probability" size="sm" />
        </div>

        {/* Jurisdiction grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Current Jurisdiction</CardTitle>
            </CardHeader>
            <CardContent>
              {[
                { label: "City", value: "Burleson, TX (ETJ — unconfirmed)" },
                { label: "County", value: "Johnson County" },
                { label: "ETJ Status", value: "Needs verification" },
                { label: "School District", value: "Mansfield ISD (placeholder)" },
                { label: "Fire District", value: "Burleson Fire (placeholder)" },
                { label: "Water District", value: "TBD — verification required" },
                { label: "Platting Authority", value: "County or Burleson ETJ" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-xs font-medium text-right max-w-[55%]">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Zoning Classification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-secondary/50 p-4 mb-4">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Current Zoning</p>
                <p className="text-lg font-bold text-foreground">{p.zoning.currentZoning}</p>
              </div>
              {[
                { label: "City Limits", value: p.zoning.cityLimits },
                { label: "ETJ", value: p.zoning.etj },
                { label: "Rezoning Needed", value: p.zoning.rezoningNeeded },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-xs font-medium text-right max-w-[55%]">{value}</span>
                </div>
              ))}
              <div className="mt-3">
                <p className="text-[11px] text-muted-foreground mb-2">Allowed Uses</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.zoning.allowedUses.map((use) => (
                    <Badge key={use} variant="secondary" className="text-[11px] bg-secondary text-muted-foreground">
                      {use}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rezoning probability */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Rezoning Probability Analysis</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-400">{p.zoning.rezoningScore}</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wide">Positive Factors</h4>
                </div>
                <ul className="space-y-2">
                  {p.zoning.rezoningFactors.positive.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="h-4 w-4 text-red-400" />
                  <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wide">Risk Factors</h4>
                </div>
                <ul className="space-y-2">
                  {p.zoning.rezoningFactors.negative.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Entitlement Requirements */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Entitlement Requirements by Scenario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-muted-foreground font-medium py-2 pr-4">Scenario</th>
                    <th className="text-left text-muted-foreground font-medium py-2 pr-4">Rezoning</th>
                    <th className="text-left text-muted-foreground font-medium py-2 pr-4">Platting</th>
                    <th className="text-left text-muted-foreground font-medium py-2 pr-4">Engineering</th>
                    <th className="text-left text-muted-foreground font-medium py-2">Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { scenario: "Estate Lots (5–8)", rezoning: "Unlikely", platting: "Minor Plat", engineering: "Limited", timeline: "9–15 mo" },
                    { scenario: "Residential Sub (20–35)", rezoning: "Likely", platting: "Prelim + Final", engineering: "Full", timeline: "18–30 mo" },
                    { scenario: "Townhomes (50–90)", rezoning: "Required", platting: "Full", engineering: "Full + TIA", timeline: "24–42 mo" },
                    { scenario: "Special Use Venue", rezoning: "SUP Required", platting: "May Not Apply", engineering: "Moderate", timeline: "6–18 mo" },
                  ].map((row) => (
                    <tr key={row.scenario} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                      <td className="py-2.5 pr-4 font-medium text-foreground">{row.scenario}</td>
                      <td className="py-2.5 pr-4 text-muted-foreground">{row.rezoning}</td>
                      <td className="py-2.5 pr-4 text-muted-foreground">{row.platting}</td>
                      <td className="py-2.5 pr-4 text-muted-foreground">{row.engineering}</td>
                      <td className="py-2.5 text-muted-foreground">{row.timeline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Live FEMA Flood Zone */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-400" />
                <CardTitle className="text-sm font-semibold">Live FEMA Flood Zone</CardTitle>
              </div>
              {!floodLoading && flood && !flood.error && (
                <Badge variant="secondary" className="text-[10px] gap-1 bg-green-500/10 text-green-400 border border-green-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block" />
                  Live — FEMA NFHL
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {floodLoading ? (
              <div className="flex items-center gap-3 py-6 justify-center text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-xs">Querying FEMA National Flood Hazard Layer…</span>
              </div>
            ) : flood?.error ? (
              <div className="flex items-center gap-3 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-400">FEMA API Unavailable</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {p.flood.note}
                  </p>
                </div>
              </div>
            ) : flood ? (
              <div className="space-y-4">
                <div className={`flex items-center gap-3 rounded-lg p-3 border ${
                  flood.riskLevel === "low"
                    ? "bg-green-500/10 border-green-500/20"
                    : flood.riskLevel === "medium" || flood.riskLevel === "low to medium"
                    ? "bg-amber-500/10 border-amber-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}>
                  {flood.riskLevel === "low" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                  ) : (
                    <AlertTriangle className={`h-4 w-4 shrink-0 ${flood.riskLevel === "high" || flood.riskLevel === "very high" ? "text-red-400" : "text-amber-400"}`} />
                  )}
                  <div>
                    <p className={`text-xs font-semibold ${flood.riskLevel === "low" ? "text-green-400" : flood.riskLevel === "high" || flood.riskLevel === "very high" ? "text-red-400" : "text-amber-400"}`}>
                      FEMA Zone {flood.zone} — {flood.riskLabel}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{flood.description}</p>
                  </div>
                </div>
                <div className="space-y-0">
                  {[
                    { label: "FEMA Zone", value: `Zone ${flood.zone}` },
                    { label: "Zone Subtype", value: flood.subtype || "—" },
                    { label: "Special Flood Hazard Area", value: flood.isSpecialHazard ? "Yes — SFHA" : "No" },
                    { label: "FIRM Panel", value: flood.firmPanel },
                    { label: "Risk Level", value: <RiskBadge level={flood.riskLevel} /> },
                    { label: "Data Source", value: "FEMA NFHL (live)" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className="text-xs font-medium text-right">{value}</span>
                    </div>
                  ))}
                </div>
                <a
                  href={`https://msc.fema.gov/portal/search#searchresultsanchor`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  View FEMA FIRM Map Service Center
                </a>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* AI Zoning Assistant */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/20">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <CardTitle className="text-sm font-semibold text-primary">AI Zoning Assistant</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Click a question to see the AI-generated analysis for this property.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {zoningQA.map(({ q, a }, index) => (
              <div
                key={q}
                className="rounded-lg border border-border/50 bg-background/50 overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-3.5 text-left hover:bg-secondary/30 transition-colors"
                  onClick={() => setActiveQ(activeQ === index ? null : index)}
                >
                  <span className="text-xs font-medium text-foreground pr-3">{q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${
                      activeQ === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeQ === index && (
                  <div className="px-4 pb-4">
                    <div className="border-t border-border/40 pt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-3 w-3 text-primary" />
                        <span className="text-[10px] text-primary font-semibold uppercase tracking-wide">AI Analysis</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{a}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Summary */}
        <AIInsightCard
          title="Zoning & Entitlement Summary"
          content={`This parcel's most favorable near-term entitlement path is an estate lot minor subdivision (5–8 lots) under county jurisdiction, which would likely not require formal rezoning and could reach a recorded plat in 9–15 months. The Rezoning Probability Score of ${p.zoning.rezoningScore}/100 reflects genuine market support for residential development but significant process uncertainty given the ETJ ambiguity and utility unknowns. Any higher-density scenario should begin with a paid pre-development consultation with a local land use attorney and a pre-development meeting with the city/county — both of which are low-cost, high-value steps that will dramatically reduce project uncertainty before committing engineering dollars.`}
        />
      </div>
    </DashboardLayout>
  );
}
