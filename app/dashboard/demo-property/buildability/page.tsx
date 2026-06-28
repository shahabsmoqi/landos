import { DashboardLayout } from "@/components/DashboardLayout";
import { BuildabilityWizard } from "@/components/buildability/BuildabilityWizard";
import { Wrench, AlertTriangle } from "lucide-react";

export default function BuildabilityPage() {
  return (
    <DashboardLayout
      title="Buildability Wizard"
      subtitle="Can I build this? Answer 5 questions and get a feasibility score, recommended path, and action plan."
      showPropertyActions
    >
      <div className="p-6 space-y-6">
        {/* Header context card */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <Wrench className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-1">Development Feasibility Engine</h2>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                  Select your intended project type, risk profile, capital position, and timeline. LandOS will score
                  the feasibility of your plan against this parcel&apos;s characteristics and generate a structured action plan.
                </p>
              </div>
            </div>
            <div className="shrink-0 rounded-lg bg-secondary/50 border border-border px-4 py-3 text-center min-w-[140px]">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Analyzing</p>
              <p className="text-xs font-semibold text-foreground leading-snug">2600 Dave Angel Rd</p>
              <p className="text-[11px] text-muted-foreground">14.07 ac · Johnson Co.</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15 px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Results are educational estimates using deterministic local logic. They are not legal, engineering, or financial advice.
            Always verify findings with licensed professionals before making development decisions.
          </p>
        </div>

        {/* Wizard */}
        <BuildabilityWizard />
      </div>
    </DashboardLayout>
  );
}
