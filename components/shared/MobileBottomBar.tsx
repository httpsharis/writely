"use client";

import { LayoutDashboard, Library, Users, StickyNote, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function MobileBottomBar() {
  const pathname = usePathname();

  // Hide the floating bottom bar only on active full-screen writing/editor canvas
  const isWritingCanvas = pathname?.includes("/write") || pathname?.includes("/editor");
  if (isWritingCanvas) {
    return null;
  }

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 pointer-events-none pb-[calc(0.85rem+env(safe-area-inset-bottom,0px))] px-4 flex justify-center animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      {/* The Pill Container: Interactive only within the pill boundaries */}
      <div className="w-full max-w-sm pointer-events-auto flex h-14 items-center justify-between rounded-full bg-card/95 backdrop-blur-xl border border-border/80 px-5 shadow-2xl shadow-black/20">
        
        {/* Dashboard */}
        <Link 
          href="/" 
          aria-label="Dashboard"
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200 ${
            pathname === "/" ? "text-brand scale-110" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutDashboard className={`h-5 w-5 ${pathname === "/" ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
        </Link>
        
        {/* Library */}
        <Link 
          href="/library" 
          aria-label="Library"
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200 ${
            pathname === "/library" ? "text-brand scale-110" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Library className={`h-5 w-5 ${pathname === "/library" ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
        </Link>

        {/* Center Floating Action Button (FAB) -> Create Novel */}
        <div className="relative -top-3">
          <Link 
            href="/project/new"
            aria-label="Create New Manuscript"
            className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 border-2 border-background shadow-md ${
              pathname === "/project/new" 
                ? "bg-brand text-white ring-2 ring-brand/40" 
                : "bg-foreground text-background hover:bg-foreground/90 active:scale-95"
            }`}
          >
            <Plus className="h-5 w-5 stroke-[2.5]" />
          </Link>
        </div>

        {/* Characters */}
        <Link 
          href="/characters" 
          aria-label="Characters"
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200 ${
            pathname?.startsWith("/characters") ? "text-brand scale-110" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className={`h-5 w-5 ${pathname?.startsWith("/characters") ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
        </Link>

        {/* Global Notes / Settings */}
        <Link 
          href="/settings" 
          aria-label="Settings"
          className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200 ${
            pathname === "/settings" ? "text-brand scale-110" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <StickyNote className={`h-5 w-5 ${pathname === "/settings" ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
        </Link>

      </div>
    </nav>
  );
}