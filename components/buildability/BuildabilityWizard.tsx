"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WizardStep } from "./WizardStep";
import { BuildabilityResultView } from "./BuildabilityResult";
import { runBuildabilityEngine } from "@/lib/buildabilityEngine";
import type { WizardInputs, ProjectType, RiskTolerance, CapitalPosition, TimelineGoal, BuildabilityResult } from "@/types/buildability";

const TOTAL_STEPS = 5;

const PROJECT_OPTIONS = [
  {
    value: "estate-lots",
    label: "Estate Lot Subdivision",
    description: "5–10 large residential lots (1+ acres each) with minimal density",
  },
  {
    value: "sf-subdivision",
    label: "Single-Family Subdivision",
    description: "20–50 standard residential lots with full infrastructure",
  },
  {
    value: "townhomes",
    label: "Townhomes / Attached Residential",
    description: "Dense attached units, typically 8–20+ units/acre",
  },
  {
    value: "multifamily",
    label: "Multifamily / Apartments",
    description: "40+ rental units — requires density rezoning and public sewer",
  },
  {
    value: "commercial",
    label: "Commercial / Mixed-Use",
    description: "Retail, office, or mixed-use development — highest entitlement complexity",
  },
  {
    value: "venue",
    label: "Event Venue / Retreat",
    description: "Special-use facility: wedding venue, corporate retreat, agritourism",
  },
  {
    value: "land-bank",
    label: "Hold / Land Bank",
    description: "Patient capital — hold for appreciation, rezoning uplift, or future development",
  },
];

const RISK_OPTIONS = [
  {
    value: "conservative",
    label: "Conservative",
    description: "Prefer low-risk paths with predictable timelines. Avoid complex entitlements.",
  },
  {
    value: "balanced",
    label: "Balanced",
    description: "Accept moderate entitlement risk for meaningful upside. Manage risks carefully.",
  },
  {
    value: "aggressive",
    label: "Aggressive",
    description: "Willing to pursue complex rezoning or density plays for maximum return.",
  },
];

const CAPITAL_OPTIONS = [
  { value: "under-250k", label: "Under $250K", description: "Limited capital — must minimize upfront costs" },
  { value: "250k-750k", label: "$250K – $750K", description: "Moderate capital position" },
  { value: "750k-2m", label: "$750K – $2M", description: "Solid capital base for infrastructure-heavy projects" },
  { value: "2m-plus", label: "$2M+", description: "Institutional-scale capital available" },
];

const TIMELINE_OPTIONS = [
  { value: "6-12mo", label: "6–12 Months", description: "Need fast execution — limited time for complex approvals" },
  { value: "12-24mo", label: "12–24 Months", description: "Standard development timeline" },
  { value: "24-36mo", label: "24–36 Months", description: "Comfortable with longer entitlement and construction cycle" },
  { value: "flexible", label: "Flexible", description: "Timeline is not a primary constraint — willing to wait for the right outcome" },
];

interface State {
  projectType?: ProjectType;
  riskTolerance?: RiskTolerance;
  capitalPosition?: CapitalPosition;
  timelineGoal?: TimelineGoal;
}

export function BuildabilityWizard() {
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState<State>({});
  const [result, setResult] = useState<BuildabilityResult | null>(null);

  const canAdvance = (): boolean => {
    if (step === 1) return !!inputs.projectType;
    if (step === 2) return !!inputs.riskTolerance;
    if (step === 3) return !!inputs.capitalPosition;
    if (step === 4) return !!inputs.timelineGoal;
    return false;
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      // Run analysis
      const fullInputs: WizardInputs = {
        projectType: inputs.projectType!,
        riskTolerance: inputs.riskTolerance!,
        capitalPosition: inputs.capitalPosition!,
        timelineGoal: inputs.timelineGoal!,
      };
      setResult(runBuildabilityEngine(fullInputs));
    }
  };

  const handleReset = () => {
    setStep(1);
    setInputs({});
    setResult(null);
  };

  if (result) {
    return <BuildabilityResultView result={result} onReset={handleReset} />;
  }

  const steps = [
    {
      question: "What do you want to build on this parcel?",
      options: PROJECT_OPTIONS,
      key: "projectType" as keyof State,
    },
    {
      question: "What is your risk tolerance for entitlement and approval?",
      options: RISK_OPTIONS,
      key: "riskTolerance" as keyof State,
    },
    {
      question: "What is your current capital position for this project?",
      options: CAPITAL_OPTIONS,
      key: "capitalPosition" as keyof State,
    },
    {
      question: "What is your target development timeline?",
      options: TIMELINE_OPTIONS,
      key: "timelineGoal" as keyof State,
    },
    {
      question: "Ready to run your buildability analysis?",
      options: [],
      key: null,
    },
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="max-w-2xl mx-auto">
      {step < TOTAL_STEPS ? (
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <WizardStep
            step={step}
            totalSteps={TOTAL_STEPS}
            question={currentStep.question}
            options={currentStep.options}
            selected={currentStep.key ? (inputs[currentStep.key] as string) : undefined}
            onSelect={(value) => {
              if (currentStep.key) {
                setInputs((prev) => ({ ...prev, [currentStep.key!]: value }));
              }
            }}
          />
          <div className="flex justify-between items-center pt-2">
            {step > 1 ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => setStep((s) => s - 1)}
              >
                Back
              </Button>
            ) : (
              <div />
            )}
            <Button
              size="sm"
              className="gap-1.5 text-xs"
              onClick={handleNext}
              disabled={!canAdvance()}
            >
              {step === TOTAL_STEPS - 1 ? "Continue to Review" : "Next"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ) : (
        /* Step 5 — Review & run */
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-semibold text-primary uppercase tracking-widest">
                Step {TOTAL_STEPS} of {TOTAL_STEPS}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Review & Run Analysis</h2>
          </div>

          {/* Progress bar */}
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${i < TOTAL_STEPS - 1 ? "bg-green-400" : "bg-primary"}`}
              />
            ))}
          </div>

          <div className="space-y-3">
            {[
              { label: "Project Type", value: PROJECT_OPTIONS.find((o) => o.value === inputs.projectType)?.label },
              { label: "Risk Tolerance", value: RISK_OPTIONS.find((o) => o.value === inputs.riskTolerance)?.label },
              { label: "Capital Position", value: CAPITAL_OPTIONS.find((o) => o.value === inputs.capitalPosition)?.label },
              { label: "Timeline Goal", value: TIMELINE_OPTIONS.find((o) => o.value === inputs.timelineGoal)?.label },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center rounded-md bg-secondary/50 px-3 py-2.5">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-xs font-semibold text-foreground">{value}</span>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              LandOS will analyze this parcel against your inputs using local deterministic logic tuned
              for Johnson County, TX. Results are educational estimates — always verify with licensed
              professionals before making development decisions.
            </p>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </Button>
            <Button size="sm" className="gap-1.5" onClick={handleNext}>
              Run Buildability Analysis
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
