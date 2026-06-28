"use client";

import { useState } from "react";
import { Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { SubmissionPacket } from "@/types/packets";
import { PacketChecklist } from "./PacketChecklist";
import { GeneratedDraft } from "./GeneratedDraft";
import { PacketStatusBadge } from "./PacketStatusBadge";

interface Props {
  packet: SubmissionPacket;
}

const categoryColors: Record<string, string> = {
  government: "text-blue-400 border-blue-500/20 bg-blue-500/10",
  utility: "text-amber-400 border-amber-500/20 bg-amber-500/10",
  investor: "text-purple-400 border-purple-500/20 bg-purple-500/10",
};

const categoryLabels: Record<string, string> = {
  government: "Government / Planning",
  utility: "Utility Provider",
  investor: "Investor / Capital",
};

export function PacketDetail({ packet }: Props) {
  const [marked, setMarked] = useState(false);

  const available = packet.requiredDocuments.filter((d) => d.available).length;
  const status = available === packet.requiredDocuments.length ? "ready" : available >= packet.requiredDocuments.length * 0.5 ? "partial" : "missing";

  const handleMark = () => {
    setMarked(true);
    toast.success("Packet marked as ready", {
      description: `${packet.title} has been queued for submission.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Packet header */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${categoryColors[packet.category]}`}>
                {categoryLabels[packet.category]}
              </span>
              <PacketStatusBadge status={marked ? "ready" : status} />
            </div>
            <h2 className="text-base font-bold text-foreground">{packet.title}</h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs border-border bg-transparent hover:bg-secondary"
              onClick={handleMark}
              disabled={marked}
            >
              <Send className="h-3.5 w-3.5" />
              {marked ? "Marked Ready" : "Mark as Ready"}
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-muted-foreground/70 uppercase tracking-wide font-medium text-[10px] mb-1">Purpose</p>
            <p className="text-muted-foreground leading-relaxed">{packet.purpose}</p>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-muted-foreground/70 uppercase tracking-wide font-medium text-[10px] mb-0.5">Recipient</p>
              <p className="text-foreground font-medium">{packet.recipient}</p>
              <p className="text-muted-foreground text-[11px]">{packet.recipientRole}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Est. prep time: </span>
              <span className="text-foreground font-medium">{packet.prepTimeEstimate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Document checklist */}
      <div className="rounded-xl border border-border bg-card p-5">
        <PacketChecklist documents={packet.requiredDocuments} />
      </div>

      {/* Generated draft */}
      <div className="rounded-xl border border-border bg-card p-5">
        <GeneratedDraft
          draftText={packet.draftText}
          filename={`LandOS-${packet.id}-draft.txt`}
        />
      </div>
    </div>
  );
}
