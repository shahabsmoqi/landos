"use client";

import Link from "next/link";
import {
  ArrowRight,
  Map,
  TrendingUp,
  Shield,
  Zap,
  GitBranch,
  DollarSign,
  Sparkles,
  Building2,
  Layers,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Map,
    title: "Zoning Intelligence",
    description:
      "Instant zoning classification, allowed uses, ETJ status, rezoning probability scores, and ordinance lookup — without digging through PDFs.",
  },
  {
    icon: TrendingUp,
    title: "Development Potential",
    description:
      "Scenario modeling for estate lots, subdivisions, townhomes, and special uses. Side-by-side comparison of fit scores, timelines, and capital requirements.",
  },
  {
    icon: Shield,
    title: "Flood & Environmental Risk",
    description:
      "FEMA flood zone determination, floodplain acreage impact, drainage requirements, and Phase I environmental flag indicators.",
  },
  {
    icon: Zap,
    title: "Utility Availability",
    description:
      "Water, sewer, electric, gas, and fiber availability signals — pulled from provider service area data with risk ratings.",
  },
  {
    icon: GitBranch,
    title: "Permit Roadmap",
    description:
      "Step-by-step approval workflow from discovery through execution. Know what's required, who's responsible, and how long it takes.",
  },
  {
    icon: DollarSign,
    title: "Financial Feasibility",
    description:
      "Interactive financial model with editable inputs, profit margin analysis, sensitivity tables, and break-even lot pricing.",
  },
  {
    icon: Sparkles,
    title: "AI Deal Summary",
    description:
      "Investment-grade narrative summary generated for every parcel — executive summary, key risks, and recommended next steps.",
  },
  {
    icon: Building2,
    title: "Comparable Projects",
    description:
      "Nearby development activity, builder presence, retail expansion signals, and school district growth indicators.",
  },
];

const personas = [
  "Land Developers",
  "Homebuilders",
  "Land Brokers",
  "Civil Engineers",
  "Private Lenders",
  "Municipal Planners",
  "Real Estate Investors",
  "Capital Partners",
];

const problems = [
  "City zoning portals that require GIS expertise to navigate",
  "County CAD records buried behind outdated search tools",
  "FEMA flood maps in PDFs with no parcel context",
  "Utility availability requiring calls to 4+ providers",
  "Permit roadmaps that live in each municipality's head",
  "Financial models built from scratch in every spreadsheet",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Layers className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold tracking-tight">LandOS</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/saved" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Saved Deals
            </Link>
            <Link href="/settings/data-sources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Data Sources
            </Link>
            <Button asChild size="sm" className="h-8 text-xs">
              <Link href="/analyze">Analyze a Property</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 grid-bg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 mb-8">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">Developer Intelligence Platform</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            The operating system for{" "}
            <span className="text-gradient">land development</span>{" "}
            decisions.
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Analyze zoning, utilities, flood risk, development potential, permits, and financial
            feasibility from one address — in seconds, not days.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="h-12 px-8 text-sm font-semibold gap-2">
              <Link href="/analyze">
                Analyze a Property
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8 text-sm font-semibold gap-2 border-border bg-transparent hover:bg-secondary"
            >
              <Link href="/dashboard/demo-property">
                View Demo Report
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Demo property preview */}
          <div className="mt-16 max-w-3xl mx-auto rounded-xl border border-border bg-card overflow-hidden glow-blue">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              <span className="ml-3 text-xs text-muted-foreground font-mono">landos.app/dashboard/demo-property</span>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Analyzing</p>
                  <h3 className="text-base font-semibold">2600 Dave Angel Rd, Burleson, TX 76028</h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {["14.07 Acres", "Outside City Limits", "Development Candidate"].map((b) => (
                      <span key={b} className="inline-flex text-[11px] rounded-full border border-border bg-secondary px-2 py-0.5 text-muted-foreground">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-400">87</p>
                  <p className="text-xs text-muted-foreground">/100 score</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Zoning Risk", value: "Medium" },
                  { label: "Flood Zone", value: "Zone X" },
                  { label: "Utility Risk", value: "Medium" },
                  { label: "Development Fit", value: "Strong" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-secondary/50 p-3">
                    <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
                    <p className="text-xs font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">The Problem</p>
            <h2 className="text-3xl font-bold mb-4">Fragmented data. Wasted hours.</h2>
            <p className="text-muted-foreground leading-relaxed">
              Today, evaluating a parcel means navigating a dozen disconnected systems with no
              unified workflow, no scoring, and no summary — just raw data left to interpretation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {problems.map((problem) => (
              <div key={problem} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-red-500/30 bg-red-500/10 flex items-center justify-center">
                  <span className="text-red-400 text-xs font-bold">×</span>
                </div>
                <p className="text-sm text-muted-foreground">{problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">The Solution</p>
              <h2 className="text-3xl font-bold mb-4">One address. Full intelligence.</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                LandOS aggregates public data from county CADs, municipal GIS systems, FEMA flood maps,
                utility provider networks, and permit portals — then translates it into a clear,
                structured development intelligence report.
              </p>
              <ul className="space-y-3">
                {[
                  "No GIS expertise required",
                  "No spreadsheet model to rebuild",
                  "No calls to city planning to understand the process",
                  "Investment-grade output in under 60 seconds",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span className="font-medium">Analysis Progress</span>
                <span className="text-primary font-semibold">Complete</span>
              </div>
              {[
                { step: "Parcel & Ownership", pct: 100 },
                { step: "Zoning Classification", pct: 100 },
                { step: "Flood & Environmental", pct: 100 },
                { step: "Utility Availability", pct: 85 },
                { step: "Development Scenarios", pct: 100 },
                { step: "Financial Feasibility", pct: 100 },
                { step: "AI Narrative Report", pct: 100 },
              ].map(({ step, pct }) => (
                <div key={step}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground">{step}</span>
                    <span className={pct === 100 ? "text-green-400" : "text-amber-400"}>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pct === 100 ? "bg-green-400" : "bg-amber-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Core Features</p>
            <h2 className="text-3xl font-bold">Everything a land decision requires.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-lg border border-border bg-card p-5 hover:border-primary/30 transition-colors group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Who It&apos;s For</p>
          <h2 className="text-3xl font-bold mb-4">Built for serious land professionals.</h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Whether you&apos;re sourcing deals, underwriting capital, or navigating approvals — LandOS gives
            you the intelligence layer you&apos;ve been missing.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {personas.map((p) => (
              <span
                key={p}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-default"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-6">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Analyze your next parcel in 60 seconds.
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Enter any address. Get a full development intelligence report — zoning, utilities,
            scenarios, financials, and AI recommendation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="h-12 px-8 text-sm font-semibold gap-2">
              <Link href="/analyze">
                Analyze a Property
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8 text-sm font-semibold border-border bg-transparent hover:bg-secondary"
            >
              <Link href="/dashboard/demo-property">
                View Demo Report
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <Layers className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold">LandOS</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Prototype — For demonstration purposes only. All data is simulated.
          </p>
        </div>
      </footer>
    </div>
  );
}
