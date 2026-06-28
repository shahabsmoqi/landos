import { X } from "lucide-react";
import type { DevelopmentPin } from "@/types/map";

interface PopupProps {
  pin: DevelopmentPin;
  onClose: () => void;
}

export function PinPopup({ pin, onClose }: PopupProps) {
  const typeLabels: Record<string, string> = {
    residential: "Residential Development",
    commercial: "Commercial Development",
    education: "Education / School District",
    infrastructure: "Infrastructure / Access",
    utility: "Utility Project",
  };

  return (
    <div
      className="absolute z-20 w-64 rounded-xl border border-border bg-card shadow-xl shadow-black/40"
      style={{
        left: Math.min(pin.x + 16, 620),
        top: Math.max(pin.y - 40, 8),
      }}
    >
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <div className="flex items-center gap-1.5">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: pin.color }}
          />
          <span className="text-xs font-semibold text-foreground truncate">{pin.name}</span>
        </div>
        <button onClick={onClose} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex flex-wrap gap-1">
          <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-md border border-border">
            {typeLabels[pin.type] ?? pin.type}
          </span>
          <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-md border border-border">
            {pin.distance}
          </span>
          <span className="text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded-md border border-green-500/20">
            {pin.status}
          </span>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide font-medium mb-0.5">Why It Matters</p>
          <p className="text-[11px] text-muted-foreground leading-snug">{pin.whyItMatters}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide font-medium mb-0.5">Impact on Parcel</p>
          <p className="text-[11px] text-foreground leading-snug">{pin.impact}</p>
        </div>
      </div>
    </div>
  );
}
