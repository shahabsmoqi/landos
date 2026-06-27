"use client";

import { Bookmark, Share2, Bell, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showPropertyActions?: boolean;
}

export function Header({ title = "LandOS", subtitle, showPropertyActions = false }: HeaderProps) {
  const handleSave = () => {
    toast.success("Deal saved to your portfolio", {
      description: "2600 Dave Angel Rd has been added to Saved Deals.",
    });
  };

  const handleShare = () => {
    toast.success("Share link copied", {
      description: "A shareable link has been copied to your clipboard.",
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6">
      <div className="flex items-center gap-3">
        {title && (
          <div>
            <h1 className="text-sm font-semibold text-foreground leading-none">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {showPropertyActions && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs border-border bg-transparent hover:bg-secondary"
              onClick={handleSave}
            >
              <Bookmark className="h-3.5 w-3.5" />
              Save Deal
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs border-border bg-transparent hover:bg-secondary"
              onClick={handleShare}
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <Bell className="h-4 w-4" />
        </Button>

        <button className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-secondary transition-colors">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary">
            <User className="h-3.5 w-3.5" />
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
