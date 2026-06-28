import { CheckCircle2, XCircle } from "lucide-react";
import type { PacketDocument } from "@/types/packets";

interface Props {
  documents: PacketDocument[];
}

export function PacketChecklist({ documents }: Props) {
  const available = documents.filter((d) => d.available).length;
  const pct = Math.round((available / documents.length) * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold text-foreground">
          Required Documents ({available}/{documents.length} available)
        </p>
        <span className={`text-xs font-semibold ${pct === 100 ? "text-green-400" : pct >= 50 ? "text-amber-400" : "text-red-400"}`}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${pct === 100 ? "bg-green-400" : pct >= 50 ? "bg-amber-400" : "bg-red-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="space-y-2">
        {documents.map((doc, i) => (
          <li key={i} className="flex items-start gap-2.5">
            {doc.available ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-red-400/60 shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`text-xs leading-snug ${doc.available ? "text-foreground" : "text-muted-foreground"}`}>
                {doc.name}
              </p>
              {doc.note && (
                <p className="text-[10px] text-muted-foreground/70 mt-0.5 leading-snug">{doc.note}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
