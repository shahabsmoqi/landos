import { CheckCircle2, Circle, FileText } from "lucide-react";

interface Props {
  title: string;
  items: string[];
  checked?: boolean;
}

export function RequirementChecklist({ title, items, checked = false }: Props) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            {checked ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0 mt-0.5" />
            ) : (
              <Circle className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 mt-0.5" />
            )}
            <span className="text-xs text-muted-foreground leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
