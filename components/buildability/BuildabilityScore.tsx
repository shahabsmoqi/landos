import { cn } from "@/lib/utils";
import type { BuildabilityResult } from "@/types/buildability";

interface Props {
  result: BuildabilityResult;
}

function getScoreColor(score: number) {
  if (score >= 80) return { stroke: "#4ade80", text: "text-green-400", bg: "bg-green-500/10 border-green-500/20" };
  if (score >= 65) return { stroke: "#60a5fa", text: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" };
  if (score >= 50) return { stroke: "#fbbf24", text: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" };
  return { stroke: "#f87171", text: "text-red-400", bg: "bg-red-500/10 border-red-500/20" };
}

const gradeMessages: Record<string, string> = {
  A: "Highly Feasible",
  B: "Feasible — Verify Key Risks",
  C: "Conditionally Feasible",
  D: "Challenging — Reconsider",
  F: "Not Recommended",
};

export function BuildabilityScore({ result }: Props) {
  const { score, grade } = result;
  const colors = getScoreColor(score);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg viewBox="0 0 130 130" className="h-36 w-36 -rotate-90">
          <circle cx="65" cy="65" r={radius} fill="none" stroke="#1a2642" strokeWidth="10" />
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="10"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-3xl font-bold", colors.text)}>{score}</span>
          <span className="text-[11px] text-muted-foreground">/100</span>
        </div>
      </div>
      <div className="text-center">
        <div className={cn("inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 mb-2", colors.bg)}>
          <span className={cn("text-lg font-bold", colors.text)}>Grade {grade}</span>
        </div>
        <p className={cn("text-sm font-semibold", colors.text)}>{gradeMessages[grade]}</p>
      </div>
    </div>
  );
}
