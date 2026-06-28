import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface Props {
  step: number;
  totalSteps: number;
  question: string;
  options: Option[];
  selected: string | undefined;
  onSelect: (value: string) => void;
}

export function WizardStep({ step, totalSteps, question, options, selected, onSelect }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-semibold text-primary uppercase tracking-widest">
            Step {step} of {totalSteps}
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <h2 className="text-lg font-bold text-foreground">{question}</h2>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i < step - 1 ? "bg-green-400" : i === step - 1 ? "bg-primary" : "bg-border"
            )}
          />
        ))}
      </div>

      <div className="grid gap-2.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={cn(
              "w-full text-left rounded-lg border p-4 transition-all",
              selected === opt.value
                ? "border-primary bg-primary/10 shadow-sm shadow-primary/10"
                : "border-border bg-card hover:border-primary/40 hover:bg-secondary/30"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 transition-colors flex items-center justify-center",
                  selected === opt.value ? "border-primary" : "border-border"
                )}
              >
                {selected === opt.value && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-semibold", selected === opt.value ? "text-primary" : "text-foreground")}>
                  {opt.label}
                </p>
                {opt.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{opt.description}</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
