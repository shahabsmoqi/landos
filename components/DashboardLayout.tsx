import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showPropertyActions?: boolean;
}

export function DashboardLayout({
  children,
  title,
  subtitle,
  showPropertyActions = false,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col ml-[220px]">
        <Header title={title} subtitle={subtitle} showPropertyActions={showPropertyActions} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
