"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Map,
  TrendingUp,
  GitBranch,
  DollarSign,
  FileText,
  Bookmark,
  Database,
  Layers,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/analyze", icon: Search, label: "Search" },
  { href: "/dashboard/demo-property", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/demo-property/zoning", icon: Map, label: "Zoning" },
  { href: "/dashboard/demo-property/development", icon: TrendingUp, label: "Development" },
  { href: "/dashboard/demo-property/workflow", icon: GitBranch, label: "Workflow" },
  { href: "/dashboard/demo-property/financials", icon: DollarSign, label: "Financials" },
  { href: "/dashboard/demo-property/report", icon: FileText, label: "AI Report" },
  { href: "/saved", icon: Bookmark, label: "Saved Deals" },
  { href: "/settings/data-sources", icon: Database, label: "Data Sources" },
];

export function AppSidebar() {
  const pathname = usePathname();

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
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="mb-3 px-2">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Navigation</p>
        </div>
        <ul className="space-y-0.5">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active =
              href === "/dashboard/demo-property"
                ? pathname === href
                : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "group flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition-all",
                    active
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    {label}
                  </div>
                  {active && <ChevronRight className="h-3 w-3 text-primary" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Demo badge */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="rounded-md bg-primary/10 border border-primary/20 p-3">
          <p className="text-xs font-medium text-primary mb-0.5">Demo Mode</p>
          <p className="text-[11px] text-muted-foreground leading-tight">
            Showing demo property: 2600 Dave Angel Rd
          </p>
        </div>
      </div>
    </aside>
  );
}
