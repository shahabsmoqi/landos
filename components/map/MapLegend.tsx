const legendItems = [
  { color: "#4f8ef7", label: "Subject Parcel", symbol: "border" },
  { color: "#3b82f699", label: "Flood Zone (FEMA)", symbol: "fill" },
  { color: "#a78bfa55", label: "Zoning Overlay", symbol: "fill" },
  { color: "#fbbf24", label: "Utility Lines", symbol: "dash" },
  { color: "#6b7280", label: "Roads", symbol: "fill" },
  { color: "#a78bfa", label: "Residential Dev.", symbol: "pin" },
  { color: "#f97316", label: "Commercial", symbol: "pin" },
  { color: "#60a5fa", label: "Education", symbol: "pin" },
  { color: "#34d399", label: "Infrastructure", symbol: "pin" },
  { color: "#2dd4bf", label: "Estate Community", symbol: "pin" },
  { color: "#fbbf24", label: "Utility Project", symbol: "pin" },
];

export function MapLegend() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
        Legend
      </p>
      <div className="space-y-1.5">
        {legendItems.map(({ color, label, symbol }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="shrink-0 w-5 flex items-center justify-center">
              {symbol === "border" && (
                <div
                  className="h-3 w-5 rounded-sm border-2"
                  style={{ borderColor: color, backgroundColor: `${color}18` }}
                />
              )}
              {symbol === "fill" && (
                <div
                  className="h-3 w-5 rounded-sm border"
                  style={{ backgroundColor: color, borderColor: color }}
                />
              )}
              {symbol === "dash" && (
                <div className="flex gap-0.5 items-center w-5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-0.5 w-1 rounded-full" style={{ backgroundColor: color }} />
                  ))}
                </div>
              )}
              {symbol === "pin" && (
                <div
                  className="h-3.5 w-3.5 rounded-full border-2 border-background flex items-center justify-center text-[7px] font-bold text-background"
                  style={{ backgroundColor: color }}
                />
              )}
            </div>
            <span className="text-[11px] text-muted-foreground leading-none">{label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground/60 leading-snug">
          Demo geometry — not surveyed. For illustration only.
        </p>
      </div>
    </div>
  );
}
