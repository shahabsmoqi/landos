"use client";

import { AlertTriangle, ChevronRight, HelpCircle, Building2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { BuildabilityResult } from "@/types/buildability";
import { BuildabilityScore } from "./BuildabilityScore";
import { BuildabilityRiskMatrix } from "./RiskMatrix";
import { RequirementChecklist } from "./RequirementChecklist";

interface Props {
  result: BuildabilityResult;
  onReset: () => void;
}

export function BuildabilityResultView({ result, onReset }: Props) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Buildability Analysis</h2>
          <p className="text-sm text-muted-foreground mt-0.5">2600 Dave Angel Rd · 14.07 acres</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs border-border bg-transparent hover:bg-secondary"
          onClick={onReset}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Run Again
        </Button>
      </div>

      {/* Score + alignment warning */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-6 flex items-center justify-center">
          <BuildabilityScore result={result} />
        </div>
        <div className="md:col-span-2 flex flex-col gap-4">
          {result.alignmentWarning && (
            <div className="flex items-start gap-3 rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-400 mb-1">Alignment Warning</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{result.alignmentWarning}</p>
              </div>
            </div>
          )}

          {/* Summary message */}
          <div className="rounded-lg border border-border bg-secondary/30 p-4 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-2">Analysis Summary</p>
            <p className="text-sm text-foreground leading-relaxed">{result.summaryMessage}</p>
          </div>

          {/* Recommended path */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">Recommended Path</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{result.recommendedPath}</p>
          </div>
        </div>
      </div>

      {/* Risk matrix + timeline */}
      <BuildabilityRiskMatrix result={result} />

      {/* Next steps + Documents */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Required Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {result.nextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="shrink-0 h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-xs text-muted-foreground leading-snug pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <RequirementChecklist title="Required Documents" items={result.requiredDocuments} />
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Approval Agencies</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {result.approvalAgencies.map((a, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <ChevronRight className="h-3 w-3 text-primary shrink-0" />
                    <span className="text-xs text-muted-foreground">{a}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Biggest risks */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-red-400">Biggest Risks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-2">
            {result.biggestRisks.map((risk, i) => (
              <div key={i} className="flex items-start gap-2 rounded-md bg-red-500/5 border border-red-500/10 p-3">
                <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-snug">{risk}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* What to ask the city */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">What to Ask the City / County</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {result.cityQuestions.map((q, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="shrink-0 text-[10px] font-bold text-primary mt-0.5">{i + 1}.</span>
                <span className="text-xs text-muted-foreground leading-snug">{q}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
