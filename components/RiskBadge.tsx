import { cn } from "@/lib/utils";

type RiskLevel = "Low" | "Low to Medium" | "Medium" | "Medium to High" | "High" | "Very High" | "Unknown";

interface RiskBadgeProps {
  level: RiskLevel | string;
  className?: string;
  size?: "sm" | "md";
}

function getRiskStyle(level: string) {
  const l = level.toLowerCase();
  if (l.includes("very high")) return "bg-red-500/15 text-red-400 border-red-500/30";
  if (l.includes("high")) return "bg-orange-500/15 text-orange-400 border-orange-500/30";
  if (l.includes("medium to") || l.includes("to high")) return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  if (l.includes("medium")) return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
  if (l.includes("low to")) return "bg-blue-500/15 text-blue-400 border-blue-500/30";
  if (l.includes("low")) return "bg-green-500/15 text-green-400 border-green-500/30";
  return "bg-secondary text-muted-foreground border-border";
}

export function RiskBadge({ level, className, size = "sm" }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        getRiskStyle(level),
        className
      )}
    >
      {level}
    </span>
  );
}
