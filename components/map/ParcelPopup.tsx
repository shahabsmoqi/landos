import { X, MapPin } from "lucide-react";
import { demoProperty } from "@/data/demoProperty";

interface Props {
  onClose: () => void;
}

export function ParcelPopup({ onClose }: Props) {
  const p = demoProperty;
  return (
    <div className="absolute top-4 left-4 z-20 w-64 rounded-xl border border-primary/30 bg-card shadow-xl shadow-black/40">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">Subject Parcel</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="p-3 space-y-1.5">
        <p className="text-[11px] font-medium text-foreground">{p.fullAddress}</p>
        {[
          { label: "APN", value: p.parcel.apn },
          { label: "Size", value: `${p.parcel.size} acres` },
          { label: "Frontage", value: p.parcel.roadFrontage },
          { label: "Zoning", value: "Unrestricted / County" },
          { label: "FEMA Zone", value: "Zone X" },
          { label: "Est. Value", value: "$934,900" },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-[10px] text-muted-foreground">{label}</span>
            <span className="text-[10px] font-medium text-foreground">{value}</span>
          </div>
        ))}
      </div>
      <div className="px-3 pb-3">
        <div className="rounded-md bg-primary/10 border border-primary/20 px-2 py-1.5 text-center">
          <span className="text-[10px] text-primary font-medium">Opportunity Score: 87 / 100</span>
        </div>
      </div>
    </div>
  );
}
