import { cn } from "@/lib/utils";
import type { IntelligenceCard } from "@/types/map";
import type { LayerId } from "@/types/map";

interface Props {
  cards: IntelligenceCard[];
  activeLayers: Set<LayerId>;
  onCardClick: (layerId?: LayerId) => void;
}

const statusColors = {
  green: "bg-green-500/10 text-green-400 border-green-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  muted: "bg-secondary text-muted-foreground border-border",
};

const ratingColors = {
  green: "text-green-400",
  amber: "text-amber-400",
  red: "text-red-400",
};

export function MapMetricPanel({ cards, activeLayers, onCardClick }: Props) {
  return (
    <div className="space-y-2">
      {cards.map((card) => {
        const layerActive = !card.layerId || activeLayers.has(card.layerId);
        return (
          <div
            key={card.id}
            onClick={() => onCardClick(card.layerId)}
            className={cn(
              "rounded-lg border p-3 cursor-pointer transition-all",
              layerActive
                ? "border-border bg-card hover:border-primary/30"
                : "border-border/40 bg-card/50 opacity-60"
            )}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <p className="text-xs font-semibold text-foreground leading-none">{card.title}</p>
              <span
                className={cn(
                  "shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-md border",
                  statusColors[card.statusColor]
                )}
              >
                {card.statusLabel}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug mb-1.5">{card.insight}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground/60">Rating</span>
              <span className={cn("text-[11px] font-semibold", ratingColors[card.ratingColor])}>
                {card.rating}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
