"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Share2,
  Bookmark,
  GitBranch,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Printer,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ScoreCard } from "@/components/ScoreCard";
import { RiskBadge } from "@/components/RiskBadge";
import { reportSections } from "@/data/reportSections";
import { demoProperty } from "@/data/demoProperty";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

function ReportSectionBlock({
  title,
  content,
  defaultOpen = false,
}: {
  title: string;
  content: string[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/60 last:border-0">
      <button
        className="w-full flex items-center justify-between py-4 text-left hover:bg-secondary/20 px-1 rounded transition-colors"
        onClick={() => setOpen(!open)}
      >
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && (
        <div className="pb-4 px-1 space-y-3">
          {content.map((para, i) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReportPage() {
  const p = demoProperty;
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleExport = () => {
    toast.info("PDF Export Coming Soon", {
      description: "PDF export will be available in the next release.",
      duration: 3000,
    });
  };

  const handleShare = () => {
    toast.success("Share link copied", {
      description: "A shareable link has been copied to your clipboard.",
    });
  };

  const handleSave = () => {
    toast.success("Deal saved", {
      description: "2600 Dave Angel Rd has been added to your Saved Deals.",
    });
  };

  return (
    <DashboardLayout
      title="AI Intelligence Report"
      subtitle="2600 Dave Angel Rd, Burleson, TX 76028"
      showPropertyActions
    >
      <div className="p-6 space-y-6">
        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs border-border bg-transparent hover:bg-secondary"
            onClick={handleExport}
          >
            <Download className="h-3.5 w-3.5" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs border-border bg-transparent hover:bg-secondary"
            onClick={handleShare}
          >
            <Share2 className="h-3.5 w-3.5" />
            Share Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs border-border bg-transparent hover:bg-secondary"
            onClick={handleSave}
          >
            <Bookmark className="h-3.5 w-3.5" />
            Save Deal
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs border-border bg-transparent hover:bg-secondary"
          >
            <Link href="/dashboard/demo-property/workflow">
              <GitBranch className="h-3.5 w-3.5" />
              Start Workflow
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => window.print()}
          >
            <Printer className="h-3.5 w-3.5" />
            Print
          </Button>
        </div>

        {/* Report header */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Report title bar */}
          <div className="border-b border-border bg-secondary/30 px-6 py-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/20">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                LandOS Development Intelligence Report
              </span>
            </div>
            <h1 className="text-xl font-bold text-foreground mb-1">{p.fullAddress}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>Report Date: {date}</span>
              <span>·</span>
              <span>Johnson County, TX</span>
              <span>·</span>
              <span>14.07 Acres</span>
              <span>·</span>
              <span>Demo Report</span>
            </div>
          </div>

          {/* Score summary */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Key Metrics Summary
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: "Opportunity Score", value: "87 / 100" },
                    { label: "Rezoning Probability", value: "72 / 100" },
                    { label: "Flood Risk", value: "Low to Medium" },
                    { label: "Utility Risk", value: "Medium" },
                    { label: "Recommended Scenario", value: "Estate Lot Sub." },
                    { label: "Est. Timeline", value: "9–15 months" },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg bg-secondary/50 p-3">
                      <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
                      <p className="text-sm font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="shrink-0 flex gap-6">
                <ScoreCard score={87} label="Opportunity" size="sm" />
                <ScoreCard score={72} label="Rezoning" size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Risk dashboard */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Risk Assessment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { category: "Zoning / Entitlement", level: "Medium" },
                { category: "Flood / Environmental", level: "Low to Medium" },
                { category: "Utility Availability", level: "Medium" },
                { category: "Market Absorption", level: "Low" },
                { category: "Infrastructure Cost", level: "Medium" },
                { category: "Jurisdiction Clarity", level: "High" },
                { category: "Timeline Certainty", level: "Medium" },
                { category: "Capital Structure", level: "Low" },
              ].map(({ category, level }) => (
                <div key={category} className="rounded-lg bg-secondary/30 p-3">
                  <p className="text-[10px] text-muted-foreground mb-2">{category}</p>
                  <RiskBadge level={level} size="md" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Full report sections */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-0">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold">Full Investment Memo</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              AI-generated analyst narrative. Click any section to expand.
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            {reportSections.map((section, i) => (
              <ReportSectionBlock
                key={section.id}
                title={`${i + 1}. ${section.title}`}
                content={section.content}
                defaultOpen={i === 0}
              />
            ))}
          </CardContent>
        </Card>

        {/* Footer disclaimer */}
        <div className="rounded-lg border border-border bg-secondary/20 p-4">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Disclaimer:</strong> This report is generated from demo/simulated data for
            prototype demonstration purposes only. It does not constitute legal, financial, engineering, or real estate
            advice. All data should be independently verified before making any investment, development, or transactional
            decisions. LandOS is not responsible for actions taken based on this report.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
