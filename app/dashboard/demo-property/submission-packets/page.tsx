"use client";

import { useState } from "react";
import { Send, Info } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PacketSelector } from "@/components/packets/PacketSelector";
import { PacketDetail } from "@/components/packets/PacketDetail";
import { submissionPackets } from "@/data/submissionPackets";
import type { PacketId } from "@/types/packets";

export default function SubmissionPacketsPage() {
  const [selected, setSelected] = useState<PacketId>("predevelopment-meeting");

  const activePacket = submissionPackets.find((p) => p.id === selected)!;

  return (
    <DashboardLayout
      title="Submission Packets"
      subtitle="Generate structured checklists and draft submissions for city, county, utility, and investor audiences."
      showPropertyActions
    >
      <div className="p-6 space-y-6">
        {/* Header bar */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <Send className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Submission Packet Generator</p>
                <p className="text-xs text-muted-foreground">
                  {submissionPackets.length} packet types · 2600 Dave Angel Rd
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border border-border">
              <Info className="h-3 w-3 shrink-0" />
              Select a packet type to view its checklist and generated draft
            </div>
          </div>
        </div>

        {/* Two-panel layout */}
        <div className="grid xl:grid-cols-[260px_1fr] gap-6">
          {/* Left — packet list */}
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-1">
              Packet Types
            </p>
            <PacketSelector
              packets={submissionPackets}
              selected={selected}
              onSelect={setSelected}
            />
            <div className="rounded-lg bg-secondary/30 border border-border p-3">
              <p className="text-[10px] text-muted-foreground leading-snug">
                <strong className="text-foreground">Coming in Session 4:</strong> One-click document export, e-signature integration, and direct submission portal connections.
              </p>
            </div>
          </div>

          {/* Right — packet detail */}
          <div>
            <PacketDetail packet={activePacket} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
