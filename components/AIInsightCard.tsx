import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInsightCardProps {
  title?: string;
  content: string;
  className?: string;
  variant?: "default" | "compact";
}

export function AIInsightCard({
  title = "AI Analysis",
  content,
  className,
  variant = "default",
}: AIInsightCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-primary/20 bg-primary/5",
        variant === "default" ? "p-5" : "p-4",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/20">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="text-xs font-semibold text-primary uppercase tracking-wide">{title}</span>
      </div>
      <p className={cn("text-foreground leading-relaxed", variant === "default" ? "text-sm" : "text-xs")}>
        {content}
      </p>
    </div>
  );
}
