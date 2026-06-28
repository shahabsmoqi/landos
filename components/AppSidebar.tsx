"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import {
  Search,
  LayoutDashboard,
  MapPin,
  TrendingUp,
  GitBranch,
  DollarSign,
  FileText,
  Bookmark,
  Database,
  Layers,
  ChevronRight,
  Map,
  Wrench,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/analyze", icon: Search, label: "Search" },
  { href: "/dashboard/demo-property", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/dashboard/demo-property/map", icon: Map, label: "Map Intelligence" },
  { href: "/dashboard/demo-property/zoning", icon: MapPin, label: "Zoning" },
  { href: "/dashboard/demo-property/development", icon: TrendingUp, label: "Development" },
  { href: "/dashboard/demo-property/buildability", icon: Wrench, label: "Buildability Wizard" },
  { href: "/dashboard/demo-property/workflow", icon: GitBranch, label: "Workflow" },
  { href: "/dashboard/demo-property/financials", icon: DollarSign, label: "Financial Model" },
  { href: "/dashboard/demo-property/submission-packets", icon: Send, label: "Submission Packets" },
  { href: "/dashboard/demo-property/report", icon: FileText, label: "AI Report" },
  { href: "/saved", icon: Bookmark, label: "Saved Deals" },
  { href: "/settings/data-sources", icon: Database, label: "Data Sources" },
];

function AppSidebarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isLiveMode = searchParams.get("mode") === "live";
  const [liveAddress, setLiveAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!isLiveMode) return;
    try {
      const raw = localStorage.getItem("landos_property_intelligence");
      if (raw) {
        const intel = JSON.parse(raw) as { address?: string };
        setLiveAddress(intel.address ?? null);
      }
    } catch {}
  }, [isLiveMode]);

  const resolveHref = (href: string) =>
    isLiveMode && href.startsWith("/dashboard/demo-property")
      ? `${href}?mode=live`
      : href;

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] flex flex-col border-r border-sidebar-border bg-sidebar z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Layers className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <span className="text-sm font-bold tracking-tight text-foreground">LandOS</span>
          <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Developer Intelligence</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        <div className="mb-2 px-2">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Navigation</p>
        </div>
        <ul className="space-y-0.5">
          {navItems.map(({ href, icon: Icon, label, exact }) => {
            const active = exact
              ? pathname === href
              : pathname === href || (pathname.startsWith(href) && href !== "/analyze");
            return (
              <li key={href}>
                <Link
                  href={resolveHref(href)}
                  className={cn(
                    "group flex items-center justify-between gap-3 rounded-md px-3 py-1.5 text-sm transition-all",
                    active
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 transition-colors",
                        active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span className="text-xs">{label}</span>
                  </div>
                  {active && <ChevronRight className="h-3 w-3 text-primary" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mode badge */}
      <div className="p-3 border-t border-sidebar-border">
        <div className={cn(
          "rounded-md border p-2.5",
          isLiveMode ? "bg-green-500/10 border-green-500/20" : "bg-primary/10 border-primary/20"
        )}>
          <p className={cn("text-xs font-medium mb-0.5", isLiveMode ? "text-green-400" : "text-primary")}>
            {isLiveMode ? "Live Mode" : "Demo Mode"}
          </p>
          <p className="text-[10px] text-muted-foreground leading-tight truncate">
            {isLiveMode ? (liveAddress ?? "Loading…") : "2600 Dave Angel Rd, Burleson TX"}
          </p>
        </div>
      </div>
    </aside>
  );
}

export function AppSidebar() {
  return (
    <Suspense fallback={null}>
      <AppSidebarInner />
    </Suspense>
  );
}
