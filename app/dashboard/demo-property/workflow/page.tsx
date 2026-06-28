"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Pause,
  FileText,
  User,
  Calendar,
  StickyNote,
  ChevronDown,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { workflowColumns, workflowTasks, WorkflowTask, TaskStatus } from "@/data/workflowTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PropertyIntelligence } from "@/types/normalized";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const statusConfig: Record<TaskStatus, { label: string; color: string; icon: React.ElementType }> = {
  not_started: { label: "Not Started", color: "text-muted-foreground", icon: Clock },
  in_progress: { label: "In Progress", color: "text-blue-400", icon: Clock },
  waiting: { label: "Waiting on City", color: "text-amber-400", icon: Pause },
  completed: { label: "Completed", color: "text-green-400", icon: CheckCircle2 },
  blocked: { label: "Blocked", color: "text-red-400", icon: AlertCircle },
};

function StatusBadge({ status }: { status: TaskStatus }) {
  const { label, color } = statusConfig[status];
  const bg =
    status === "completed"
      ? "bg-green-500/15 border-green-500/30"
      : status === "in_progress"
      ? "bg-blue-500/15 border-blue-500/30"
      : status === "waiting"
      ? "bg-amber-500/15 border-amber-500/30"
      : status === "blocked"
      ? "bg-red-500/15 border-red-500/30"
      : "bg-secondary border-border";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${color} ${bg}`}>
      {label}
    </span>
  );
}

const columnColorMap: Record<string, string> = {
  discovery: "border-blue-500/40 bg-blue-500/5",
  feasibility: "border-purple-500/40 bg-purple-500/5",
  entitlements: "border-amber-500/40 bg-amber-500/5",
  engineering: "border-orange-500/40 bg-orange-500/5",
  approval: "border-green-500/40 bg-green-500/5",
  execution: "border-teal-500/40 bg-teal-500/5",
};

const columnHeaderColor: Record<string, string> = {
  discovery: "text-blue-400",
  feasibility: "text-purple-400",
  entitlements: "text-amber-400",
  engineering: "text-orange-400",
  approval: "text-green-400",
  execution: "text-teal-400",
};

function WorkflowContent() {
  const searchParams = useSearchParams();
  const isLiveMode = searchParams.get("mode") === "live";
  const [intelligence, setIntelligence] = useState<PropertyIntelligence | null>(null);
  const [tasks, setTasks] = useState(workflowTasks);
  const [selectedTask, setSelectedTask] = useState<WorkflowTask | null>(null);

  useEffect(() => {
    if (!isLiveMode) return;
    try {
      const raw = localStorage.getItem("landos_property_intelligence");
      if (raw) setIntelligence(JSON.parse(raw) as PropertyIntelligence);
    } catch {}
  }, [isLiveMode]);

  const displayAddress = isLiveMode
    ? (intelligence?.address ?? "Loading…")
    : "2600 Dave Angel Rd, Burleson, TX 76028";

  const getColumnTasks = (columnId: string) => tasks.filter((t) => t.column === columnId);

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
    toast.success("Status updated", { description: `Task marked as ${statusConfig[status].label}` });
  };

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;

  return (
    <DashboardLayout
      title="Approval Workflow"
      subtitle={displayAddress}
      showPropertyActions
    >
      <div className="p-6 space-y-4">
        {/* Stats bar */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total Tasks:</span>
            <span className="font-semibold">{tasks.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Completed:</span>
            <span className="font-semibold text-green-400">{completedCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">In Progress:</span>
            <span className="font-semibold text-blue-400">{inProgressCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Progress:</span>
            <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-green-400 rounded-full"
                style={{ width: `${(completedCount / tasks.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {Math.round((completedCount / tasks.length) * 100)}%
            </span>
          </div>
        </div>

        {/* Kanban board */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1100px]">
            {workflowColumns.map((col) => {
              const colTasks = getColumnTasks(col.id);
              return (
                <div key={col.id} className="flex-1 min-w-[200px]">
                  <div
                    className={`rounded-lg border p-4 ${columnColorMap[col.id] || "border-border bg-card"}`}
                  >
                    {/* Column header */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-xs font-semibold uppercase tracking-wider ${columnHeaderColor[col.id] || "text-foreground"}`}>
                        {col.title}
                      </h3>
                      <span className="text-[10px] text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
                        {colTasks.length}
                      </span>
                    </div>

                    {/* Tasks */}
                    <div className="space-y-2">
                      {colTasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => setSelectedTask(task)}
                          className="w-full text-left rounded-lg border border-border bg-card p-3 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-[11px] font-medium text-foreground leading-tight">{task.title}</p>
                            {task.priority === "high" && (
                              <div className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0 mt-1" />
                            )}
                          </div>
                          <StatusBadge status={task.status} />
                          <p className="text-[10px] text-muted-foreground mt-2 line-clamp-2">
                            {task.estimatedDuration}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Task Drawer */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedTask(null)}
          />
          <div className="w-[480px] h-full bg-card border-l border-border overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-start justify-between z-10">
              <div className="flex-1 pr-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                  {workflowColumns.find((c) => c.id === selectedTask.column)?.title}
                </p>
                <h3 className="text-sm font-semibold">{selectedTask.title}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => setSelectedTask(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-5 space-y-5">
              {/* Status selector */}
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-2">Status</p>
                <Select
                  value={selectedTask.status}
                  onValueChange={(val) => {
                    const newStatus = val as TaskStatus;
                    updateTaskStatus(selectedTask.id, newStatus);
                    setSelectedTask((prev) => prev ? { ...prev, status: newStatus } : null);
                  }}
                >
                  <SelectTrigger className="w-full bg-secondary border-border text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="waiting">Waiting on City</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Description</p>
                </div>
                <p className="text-xs text-foreground leading-relaxed bg-secondary/50 rounded-lg p-3">
                  {selectedTask.description}
                </p>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-secondary/50 p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Responsible Party</p>
                  </div>
                  <p className="text-xs font-medium">{selectedTask.responsibleParty}</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Est. Duration</p>
                  </div>
                  <p className="text-xs font-medium">{selectedTask.estimatedDuration}</p>
                </div>
              </div>

              {/* Required Documents */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Required Documents</p>
                </div>
                <ul className="space-y-1.5">
                  {selectedTask.requiredDocuments.map((doc) => (
                    <li key={doc} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Notes */}
              {selectedTask.notes && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <StickyNote className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Notes</p>
                  </div>
                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                    <p className="text-xs text-amber-300 leading-relaxed">{selectedTask.notes}</p>
                  </div>
                </div>
              )}

              {/* Priority */}
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-2">Priority</p>
                <Badge
                  className={
                    selectedTask.priority === "high"
                      ? "bg-red-500/15 text-red-400 border-red-500/30"
                      : selectedTask.priority === "medium"
                      ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                      : "bg-secondary text-muted-foreground border-border"
                  }
                >
                  {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function WorkflowPage() {
  return (
    <Suspense fallback={null}>
      <WorkflowContent />
    </Suspense>
  );
}
