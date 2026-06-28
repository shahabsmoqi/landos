import { cn } from "@/lib/utils";
import type { BuildabilityResult, RiskLevel, Difficulty } from "@/types/buildability";

interface Props {
  result: BuildabilityResult;
}

function RiskBadge({ level }: { level: RiskLevel | Difficulty }) {
  const l = level.toLowerCase();
  const cls =
    l === "low"
      ? "bg-green-500/10 text-green-400 border-green-500/20"
      : l === "high"
      ? "bg-red-500/10 text-red-400 border-red-500/20"
      : "bg-amber-500/10 text-amber-400 border-amber-500/20";
  return (
    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-md border", cls)}>
      {level}
    </span>
  );
}

export function BuildabilityRiskMatrix({ result }: Props) {
  const rows = [
    { label: "Entitlement Difficulty", value: result.entitlementDifficulty },
    { label: "Utility Risk", value: result.utilityRisk },
    { label: "Capital Intensity", value: result.capitalIntensity },
    { label: "Timeline Estimate", value: result.timelineEstimate, isText: true },
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Risk & Complexity Matrix</h3>
      <div className="divide-y divide-border/50">
        {rows.map(({ label, value, isText }) => (
          <div key={label} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
            <span className="text-xs text-muted-foreground">{label}</span>
            {isText ? (
              <span className="text-xs font-medium text-foreground">{value}</span>
            ) : (
              <RiskBadge level={value as RiskLevel | Difficulty} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
