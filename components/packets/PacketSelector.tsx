import { cn } from "@/lib/utils";
import type { SubmissionPacket } from "@/types/packets";
import type { PacketId } from "@/types/packets";
import { PacketStatusBadge } from "./PacketStatusBadge";

interface Props {
  packets: SubmissionPacket[];
  selected: PacketId | null;
  onSelect: (id: PacketId) => void;
}

const categoryColors: Record<string, string> = {
  government: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  utility: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  investor: "bg-purple-500/10 border-purple-500/20 text-purple-400",
};

export function PacketSelector({ packets, selected, onSelect }: Props) {
  return (
    <div className="space-y-1.5">
      {packets.map((packet) => {
        const available = packet.requiredDocuments.filter((d) => d.available).length;
        const status =
          available === packet.requiredDocuments.length
            ? "ready"
            : available >= packet.requiredDocuments.length * 0.5
            ? "partial"
            : "missing";
        const isSelected = selected === packet.id;

        return (
          <button
            key={packet.id}
            onClick={() => onSelect(packet.id)}
            className={cn(
              "w-full text-left rounded-lg border p-3 transition-all",
              isSelected
                ? "border-primary/40 bg-primary/5"
                : "border-border bg-card hover:border-primary/20 hover:bg-secondary/30"
            )}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className={cn("text-xs font-semibold leading-snug", isSelected ? "text-primary" : "text-foreground")}>
                {packet.shortTitle}
              </p>
              <PacketStatusBadge status={status} className="shrink-0" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className={cn("text-[9px] font-medium px-1.5 py-0.5 rounded border", categoryColors[packet.category])}>
                {packet.category === "government"
                  ? "Gov"
                  : packet.category === "utility"
                  ? "Utility"
                  : "Investor"}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {available}/{packet.requiredDocuments.length} docs ready
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
