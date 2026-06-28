"use client";

import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  draftText: string;
  filename: string;
}

export function GeneratedDraft({ draftText, filename }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(draftText).then(() => {
      setCopied(true);
      toast.success("Draft copied to clipboard", {
        description: "Paste into your email client or document editor.",
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    toast.success("Preparing download", {
      description: `${filename} — document export coming in Session 4.`,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-foreground">Generated Draft</p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-xs border-border bg-transparent hover:bg-secondary"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-400" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            {copied ? "Copied!" : "Copy Text"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-xs border-border bg-transparent hover:bg-secondary"
            onClick={handleDownload}
          >
            <Download className="h-3 w-3" />
            Export
          </Button>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-secondary/20 p-4 max-h-96 overflow-y-auto">
        <pre className="text-[11px] text-muted-foreground leading-relaxed whitespace-pre-wrap font-mono">
          {draftText}
        </pre>
      </div>
      <p className="text-[10px] text-muted-foreground/60">
        Edit the bracketed fields before sending. This draft is AI-generated and requires professional review.
      </p>
    </div>
  );
}
