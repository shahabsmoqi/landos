import { cn } from "@/lib/utils";

type Status = "ready" | "partial" | "draft" | "missing";

interface Props {
  status: Status;
  className?: string;
}

const configs: Record<Status, { label: string; className: string }> = {
  ready: { label: "Ready", className: "bg-green-500/10 text-green-400 border-green-500/20" },
  partial: { label: "Partial", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  draft: { label: "Draft", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  missing: { label: "Incomplete", className: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export function PacketStatusBadge({ status, className }: Props) {
  const { label, className: cls } = configs[status];
  return (
    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-md border", cls, className)}>
      {label}
    </span>
  );
}
