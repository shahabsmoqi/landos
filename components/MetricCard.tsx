import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
  highlight?: boolean;
}

export function MetricCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  className,
  highlight = false,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-colors",
        highlight
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-card hover:border-border/80",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        {Icon && (
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md",
              highlight ? "bg-primary/20" : "bg-secondary"
            )}
          >
            <Icon className={cn("h-3.5 w-3.5", highlight ? "text-primary" : "text-muted-foreground")} />
          </div>
        )}
      </div>
      <p className={cn("text-xl font-bold leading-tight", highlight ? "text-primary" : "text-foreground")}>
        {value}
      </p>
      {subtext && (
        <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
      )}
    </div>
  );
}
