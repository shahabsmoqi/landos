"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Home,
  Droplets,
  Zap,
  TrendingUp,
  Building2,
  DollarSign,
  GitBranch,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  Map,
  Wrench,
  Send,
  Download,
  Info,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ScoreCard } from "@/components/ScoreCard";
import { AIInsightCard } from "@/components/AIInsightCard";
import { RiskBadge } from "@/components/RiskBadge";
import { LiveDataStatus } from "@/components/intelligence/LiveDataStatus";
import { demoProperty } from "@/data/demoProperty";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FloodZoneResult } from "@/lib/floodZone";
import type { PropertyIntelligence } from "@/types/normalized";

function UtilityRow({ label, status, risk }: { label: string; status: string; risk: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-foreground">{status}</span>
        <RiskBadge level={risk === "high" ? "High" : risk === "medium" ? "Medium" : "Low"} />
      </div>
    </div>
  );
}

function DashboardPageInner() {
  const p = demoProperty;
  const searchParams = useSearchParams();
  const isLiveMode = searchParams.get("mode") === "live";

  const [intelligence, setIntelligence] = useState<PropertyIntelligence | null>(null);
  const [flood, setFlood] = useState<FloodZoneResult | null>(null);
  const [floodLoading, setFloodLoading] = useState(true);

  // Load stored intelligence object in live mode
  useEffect(() => {
    if (!isLiveMode) return;
    try {
      const raw = localStorage.getItem("landos_property_intelligence");
      if (raw) {
        const parsed = JSON.parse(raw) as PropertyIntelligence;
        setIntelligence(parsed);

        // Use pre-fetched flood data — skip re-fetch
        if (parsed.flood) {
          setFlood({
            zone: parsed.flood.zoneCode,
            subtype: parsed.flood.zoneSubtype,
            isSpecialHazard: parsed.flood.sfha,
            firmPanel: parsed.flood.firmPanel,
            riskLabel: parsed.flood.riskLabel,
            riskLevel: parsed.flood.riskLevel,
            description: parsed.flood.description,
            lat: parsed.flood.lat,
            lng: parsed.flood.lng,
            source: "fema_nfhl",
          });
          setFloodLoading(false);
          return;
        }
      }
    } catch {
      // localStorage unavailable or parse error
    }
  }, [isLiveMode]);

  useEffect(() => {
    // Only fetch FEMA if we didn't already get it from intelligence
    if (isLiveMode && intelligence?.flood) return;
    if (isLiveMode && intelligence !== null && !intelligence.flood) {
      setFloodLoading(false);
      return;
    }
    if (isLiveMode && intelligence === null) return; // wait for intelligence to load

    fetch("/api/flood-zone?address=2600+Dave+Angel+Rd+Burleson+TX+76028")
      .then((r) => r.json())
      .then((data: FloodZoneResult) => setFlood(data))
      .catch(() => {})
      .finally(() => setFloodLoading(false));
  }, [isLiveMode, intelligence]);

  const displayAddress =
    isLiveMode && intelligence?.geocode?.matchedAddress
      ? intelligence.geocode.matchedAddress
      : p.fullAddress;

  const locationSubtitle = (() => {
    if (!isLiveMode || !intelligence?.geocode) return "Burleson, TX 76028 · Johnson County";
    const g = intelligence.geocode;
    const cityState = [g.city, g.stateAbbr, g.zip].filter(Boolean).join(", ");
    const county = g.countyName ? ` · ${g.countyName}` : "";
    return cityState ? cityState + county : displayAddress;
  })();

  return (
    <DashboardLayout
      title="Property Dashboard"
      subtitle={displayAddress}
      showPropertyActions
    >
      <div className="p-6 space-y-6">

        {/* Live intelligence status (live mode only) */}
        {isLiveMode && intelligence && (
          <LiveDataStatus intelligence={intelligence} />
        )}

        {/* Demo mode banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <div className="flex items-start gap-2.5">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isLiveMode && intelligence ? (
                <>
                  <strong className="text-primary">Live Mode:</strong> Geocoded via Census TIGER/MAF.
                  FEMA flood, Census demographics, and Parcelum parcel data live. Zoning requires provider integration.
                </>
              ) : (
                <>
                  <strong className="text-primary">Demo Mode:</strong> This property uses live FEMA flood lookup plus
                  simulated zoning, parcel, utility, and development data for demonstration purposes.
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Link
              href="/dashboard/demo-property/map"
              className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border bg-transparent hover:bg-secondary text-[11px] font-medium text-foreground transition-colors"
            >
              <Map className="h-3 w-3 text-primary" />
              Map Intelligence
            </Link>
            <Link
              href="/dashboard/demo-property/buildability"
              className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border bg-transparent hover:bg-secondary text-[11px] font-medium text-foreground transition-colors"
            >
              <Wrench className="h-3 w-3 text-primary" />
              Buildability Wizard
            </Link>
            <Link
              href="/dashboard/demo-property/submission-packets"
              className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border bg-transparent hover:bg-secondary text-[11px] font-medium text-foreground transition-colors"
            >
              <Send className="h-3 w-3 text-primary" />
              Submission Packets
            </Link>
            <a
              href="/api/report-pdf"
              download="LandOS-Report-2600-Dave-Angel-Rd.pdf"
              className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border bg-transparent hover:bg-secondary text-[11px] font-medium text-foreground transition-colors"
            >
              <Download className="h-3 w-3 text-primary" />
              Export AI Report
            </a>
          </div>
        </div>

        {/* Property header */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>{locationSubtitle}</span>
              </div>
              <h1 className="text-xl font-bold mb-3">{displayAddress}</h1>
              <div className="flex flex-wrap gap-1.5">
                {isLiveMode ? (
                  <>
                    <Badge className="bg-green-500/15 text-green-400 border-green-500/30 hover:bg-green-500/20">
                      Live Analysis
                    </Badge>
                    {intelligence?.parcel?.propertyUse && (
                      <Badge variant="outline" className="bg-secondary text-muted-foreground border-border">
                        {intelligence.parcel.propertyUse}
                      </Badge>
                    )}
                    {intelligence?.flood && (
                      <Badge className={intelligence.flood.sfha ? "bg-red-500/15 text-red-400 border-red-500/30" : "bg-green-500/15 text-green-400 border-green-500/30"}>
                        {intelligence.flood.sfha ? "SFHA Flood Zone" : `Flood Zone ${intelligence.flood.zoneCode}`}
                      </Badge>
                    )}
                  </>
                ) : (
                  p.badges.map((badge) => (
                    <Badge
                      key={badge.label}
                      variant={badge.variant === "success" ? "default" : badge.variant === "warning" ? "secondary" : badge.variant}
                      className={
                        badge.variant === "success"
                          ? "bg-green-500/15 text-green-400 border-green-500/30 hover:bg-green-500/20"
                          : badge.variant === "warning"
                          ? "bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                          : "bg-secondary text-muted-foreground border-border"
                      }
                    >
                      {badge.label}
                    </Badge>
                  ))
                )}
              </div>
            </div>
            <div className="shrink-0">
              <ScoreCard score={p.opportunityScore} label="Opportunity Score" size="md" />
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-border">
            <AIInsightCard content={p.aiSummary} />
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(isLiveMode ? [
            {
              label: "Parcel Size",
              value: intelligence?.parcel?.acreage != null ? `${intelligence.parcel.acreage.toFixed(2)} ac` : "—",
              sub: intelligence?.parcel?.landSqft ? `${intelligence.parcel.landSqft.toLocaleString()} sqft` : "Not in coverage",
            },
            {
              label: "Market Value",
              value: intelligence?.parcel?.marketValue ? `$${intelligence.parcel.marketValue.toLocaleString()}` : "—",
              sub: intelligence?.parcel?.marketValue ? "County CAD" : "Not in coverage",
            },
            {
              label: "Assessed Value",
              value: intelligence?.parcel?.assessedValue ? `$${intelligence.parcel.assessedValue.toLocaleString()}` : "—",
              sub: intelligence?.parcel?.assessedValue ? "County CAD" : "Not in coverage",
            },
            {
              label: "Flood Zone",
              value: intelligence?.flood ? `Zone ${intelligence.flood.zoneCode}` : "—",
              sub: intelligence?.flood ? intelligence.flood.riskLabel : "FEMA unavailable",
            },
          ] : [
            { label: "Parcel Size", value: "14.07 ac", sub: "$66,446 / acre" },
            { label: "Market Value (Est.)", value: "$934,900", sub: "Johnson County CAD" },
            { label: "Road Frontage", value: "~450 ft", sub: "Dave Angel Rd" },
            { label: "Rezoning Score", value: "72 / 100", sub: "Medium probability" },
          ]).map(({ label, value, sub }) => (
            <div key={label} className="rounded-lg border border-border bg-card p-4">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
              <p className={`text-lg font-bold ${value === "—" ? "text-muted-foreground" : "text-foreground"}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Main cards grid */}
        <div className="grid lg:grid-cols-2 gap-4">

          {/* Parcel Overview */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-semibold">Parcel Overview</CardTitle>
                </div>
                {isLiveMode ? (
                  intelligence?.parcel ? (
                    <Badge variant="secondary" className="text-[10px] gap-1 bg-green-500/10 text-green-400 border border-green-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block" />
                      Live · Parcelum.io
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400">Not Found</Badge>
                  )
                ) : (
                  <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">Demo Data</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-0">
              {isLiveMode && !intelligence?.parcel ? (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm font-medium text-muted-foreground">Parcel data not found</p>
                  <p className="text-[11px] text-muted-foreground/60 max-w-[220px]">
                    This address is not in Parcelum&apos;s current coverage area. Data available for most major TX counties.
                  </p>
                </div>
              ) : (
                (isLiveMode && intelligence?.parcel ? [
                  { label: "Parcel ID", value: intelligence.parcel.parcelId ?? "—" },
                  { label: "Owner", value: intelligence.parcel.ownerName ?? "Confidential" },
                  { label: "Parcel Size", value: intelligence.parcel.acreage != null ? `${intelligence.parcel.acreage.toFixed(2)} acres` : "—" },
                  { label: "Property Use", value: intelligence.parcel.propertyUse ?? "—" },
                  { label: "Improvement", value: intelligence.parcel.improvementSqft ? `${intelligence.parcel.improvementSqft.toLocaleString()} sqft` : "—" },
                  { label: "Year Built", value: intelligence.parcel.yearBuilt ? String(intelligence.parcel.yearBuilt) : "—" },
                  { label: "Market Value", value: intelligence.parcel.marketValue ? `$${intelligence.parcel.marketValue.toLocaleString()}` : "—" },
                  { label: "Assessed Value", value: intelligence.parcel.assessedValue ? `$${intelligence.parcel.assessedValue.toLocaleString()}` : "—" },
                ] : [
                  { label: "Parcel Size", value: "14.07 acres" },
                  { label: "Existing Use", value: "Single-family with acreage" },
                  { label: "Improvement", value: "2,490 sqft home" },
                  { label: "Year Built", value: "1998" },
                  { label: "Est. Market Value", value: "$934,900" },
                  { label: "Price Per Acre", value: "$66,446" },
                  { label: "Road Frontage", value: "~450 ft" },
                  { label: "Access", value: "Public road" },
                ]).map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className={`text-xs font-medium text-right max-w-[55%] truncate ${value === "—" ? "text-muted-foreground/50" : "text-foreground"}`}>{value}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Zoning */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-semibold">Zoning & Jurisdiction</CardTitle>
                </div>
                {isLiveMode ? (
                  <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400">Not Available</Badge>
                ) : (
                  <Link href="/dashboard/demo-property/zoning">
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:bg-primary/10">
                      Details <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-0">
              {isLiveMode ? (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm font-medium text-muted-foreground">Zoning data not available</p>
                  <p className="text-[11px] text-muted-foreground/60 max-w-[220px]">
                    Live zoning lookup requires an ArcGIS layer query or a zoning data provider for this jurisdiction.
                  </p>
                </div>
              ) : (
                [
                  { label: "Current Zoning", value: "Unrestricted / County" },
                  { label: "City Limits", value: "Outside" },
                  { label: "ETJ Status", value: "Needs verification" },
                  { label: "School District", value: "Mansfield ISD" },
                  { label: "Allowed Uses", value: "Res / Agricultural / Estate" },
                  { label: "Rezoning Required", value: "Likely for dense subdivision" },
                  { label: "Rezoning Score", value: "72 / 100 — Medium" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="text-xs font-medium text-foreground text-right max-w-[55%]">{value}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Flood Risk */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-400" />
                  <CardTitle className="text-sm font-semibold">Flood & Environmental Risk</CardTitle>
                </div>
                {!floodLoading && flood && !flood.error && (
                  <Badge variant="secondary" className="text-[10px] gap-1 bg-green-500/10 text-green-400 border border-green-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block" />
                    Live
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {floodLoading ? (
                <div className="flex items-center gap-2 py-4 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs">Querying FEMA NFHL…</span>
                </div>
              ) : flood && !flood.error ? (
                <>
                  <div className={`flex items-center gap-3 mb-4 rounded-lg p-3 border ${
                    flood.riskLevel === "low"
                      ? "bg-green-500/10 border-green-500/20"
                      : flood.riskLevel === "high" || flood.riskLevel === "very high"
                      ? "bg-red-500/10 border-red-500/20"
                      : "bg-amber-500/10 border-amber-500/20"
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
                  {[
                    { label: "FEMA Zone", value: `Zone ${flood.zone}` },
                    { label: "100-yr Floodplain", value: flood.isSpecialHazard ? "Yes — SFHA" : "Not detected" },
                    { label: "FIRM Panel", value: flood.firmPanel },
                    { label: "Risk Level", value: <RiskBadge level={flood.riskLevel} /> },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className="text-xs font-medium">{value}</span>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4 rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                    <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-green-400">FEMA Zone X</p>
                      <p className="text-[11px] text-muted-foreground">Minimal flood hazard area — favorable designation</p>
                    </div>
                  </div>
                  {[
                    { label: "FEMA Zone", value: "Zone X" },
                    { label: "100-yr Floodplain", value: "Not detected" },
                    { label: "Drainage Review", value: "Required" },
                    { label: "Risk Level", value: <RiskBadge level="Low to Medium" /> },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className="text-xs font-medium">{value}</span>
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>

          {/* Utilities */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <CardTitle className="text-sm font-semibold">Utility Availability</CardTitle>
                </div>
                <RiskBadge level="Medium" size="md" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                <p className="text-[11px] text-muted-foreground">
                  Water and sewer verification is the critical path item for this project.
                </p>
              </div>
              <UtilityRow label="Water" status="Nearby — verify required" risk="medium" />
              <UtilityRow label="Sewer" status="Unknown / Septic likely" risk="high" />
              <UtilityRow label="Electric" status="Available nearby" risk="low" />
              <UtilityRow label="Gas" status="Unknown" risk="medium" />
              <UtilityRow label="Fiber" status="Unknown" risk="low" />
            </CardContent>
          </Card>
        </div>

        {/* Census Demographics — live data card */}
        {intelligence?.demographics && (
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-semibold">Census Demographics</CardTitle>
                </div>
                <Badge
                  variant="secondary"
                  className="text-[10px] gap-1 bg-green-500/10 text-green-400 border border-green-500/20"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block" />
                  Live · ACS {intelligence.demographics.year}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {
                    label: "Population",
                    value: intelligence.demographics.population
                      ? intelligence.demographics.population.toLocaleString()
                      : "N/A",
                    sub: `Tract ${intelligence.demographics.tract}`,
                  },
                  {
                    label: "Median HH Income",
                    value: intelligence.demographics.medianHouseholdIncome
                      ? `$${intelligence.demographics.medianHouseholdIncome.toLocaleString()}`
                      : "N/A",
                    sub: "ACS 5-year estimate",
                  },
                  {
                    label: "Owner Occupied",
                    value: intelligence.demographics.ownerOccupiedRate != null
                      ? `${(intelligence.demographics.ownerOccupiedRate * 100).toFixed(1)}%`
                      : "N/A",
                    sub: "Of occupied housing",
                  },
                  {
                    label: "Median Age",
                    value: intelligence.demographics.medianAge
                      ? `${intelligence.demographics.medianAge} yrs`
                      : "N/A",
                    sub: "Census tract",
                  },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="rounded-lg bg-secondary/50 p-3">
                    <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">
                      {label}
                    </p>
                    <p className="text-sm font-bold text-foreground">{value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Development Potential */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">Development Potential</CardTitle>
              </div>
              <Link href="/dashboard/demo-property/development">
                <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:bg-primary/10">
                  Full Analysis <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  name: "Scenario A: Estate Lots",
                  units: "5–8 lots",
                  timeline: "9–15 months",
                  capital: "$300K–$900K",
                  complexity: "Medium",
                  fit: 82,
                  recommended: true,
                },
                {
                  name: "Scenario B: Residential Subdivision",
                  units: "20–35 lots",
                  timeline: "18–30 months",
                  capital: "$1M–$3M",
                  complexity: "High",
                  fit: 78,
                  recommended: false,
                },
                {
                  name: "Scenario C: Special Use",
                  units: "N/A",
                  timeline: "6–18 months",
                  capital: "$150K–$700K",
                  complexity: "Medium",
                  fit: 70,
                  recommended: false,
                },
              ].map((s) => (
                <div
                  key={s.name}
                  className={`rounded-lg border p-4 ${s.recommended ? "border-primary/30 bg-primary/5" : "border-border"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold">{s.name}</p>
                    {s.recommended && (
                      <Badge className="text-[10px] bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1.5 text-[11px] text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Units / Lots</span>
                      <span className="text-foreground font-medium">{s.units}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timeline</span>
                      <span className="text-foreground font-medium">{s.timeline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capital</span>
                      <span className="text-foreground font-medium">{s.capital}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Complexity</span>
                      <span className="text-foreground font-medium">{s.complexity}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/50 flex justify-between items-center">
                    <span className="text-[11px] text-muted-foreground">Fit Score</span>
                    <span className={`text-sm font-bold ${s.fit >= 80 ? "text-green-400" : "text-blue-400"}`}>
                      {s.fit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom row */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Nearby Growth */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">Nearby Growth Signals</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {p.nearbyGrowth.map((item) => (
                <div key={item.label} className="flex items-start gap-3 py-2 border-b border-border/40 last:border-0">
                  <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-green-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium truncate">{item.label}</p>
                      <span className="text-[11px] text-muted-foreground shrink-0">{item.distance}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.note}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Approval Roadmap Preview */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-semibold">Approval Roadmap</CardTitle>
                </div>
                <Link href="/dashboard/demo-property/workflow">
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:bg-primary/10">
                    Full Board <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { step: "Parcel verification", status: "in_progress" },
                  { step: "Survey", status: "not_started" },
                  { step: "Utility availability request", status: "not_started" },
                  { step: "Concept plan", status: "not_started" },
                  { step: "Pre-development meeting", status: "not_started" },
                  { step: "Engineering feasibility", status: "not_started" },
                  { step: "Rezoning / platting", status: "not_started" },
                  { step: "Final plat / permits", status: "not_started" },
                ].map(({ step, status }) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="shrink-0">
                      {status === "completed" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                      ) : status === "in_progress" ? (
                        <Clock className="h-3.5 w-3.5 text-blue-400" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border border-border" />
                      )}
                    </div>
                    <span className={`text-xs ${status === "in_progress" ? "text-blue-400 font-medium" : "text-muted-foreground"}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial snapshot */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">Financial Snapshot</CardTitle>
              </div>
              <Link href="/dashboard/demo-property/financials">
                <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:bg-primary/10">
                  Full Model <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                { label: "Asking Price", value: "$934,900" },
                { label: "Soft Costs (Est.)", value: "$120K–$300K" },
                { label: "Infrastructure (Est.)", value: "$500K–$1.8M" },
                { label: "Feasibility", value: "Promising" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
                  <p className="text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-secondary/30 p-3 text-xs text-muted-foreground">
              <strong className="text-foreground">Potential exit strategies: </strong>
              {p.financial.potentialExitStrategies.join(" · ")}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardPageInner />
    </Suspense>
  );
}
