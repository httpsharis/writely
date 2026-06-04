"use client";

import { LayoutDashboard, Library, Users, StickyNote, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function MobileBottomBar() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-6 inset-x-6 z-50">
      
      {/* The Pill Container */}
      <div className="flex h-16 items-center justify-between rounded-full bg-card/95 backdrop-blur-xl border border-border px-6 shadow-2xl">
        
        {/* Left Side */}
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center p-2 transition-all duration-300 ${pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <LayoutDashboard className={`h-5 w-5 ${pathname === "/" ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
        </Link>
        
        <Link 
          href="/library" 
          className={`flex flex-col items-center justify-center p-2 transition-all duration-300 ${pathname === "/library" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Library className={`h-5 w-5 ${pathname === "/library" ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
        </Link>

        {/* Center Floating Action Button (FAB) */}
        <div className="relative -top-5">
          <button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 hover:bg-primary/90 active:scale-95 transition-all duration-300 border-4 border-background">
            <Plus className="h-6 w-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Right Side */}
        <Link 
          href="/characters" 
          className={`flex flex-col items-center justify-center p-2 transition-all duration-300 ${pathname === "/characters" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Users className={`h-5 w-5 ${pathname === "/characters" ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
        </Link>

        <Link 
          href="/notes" 
          className={`flex flex-col items-center justify-center p-2 transition-all duration-300 ${pathname === "/notes" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <StickyNote className={`h-5 w-5 ${pathname === "/notes" ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
        </Link>

      </div>
    </div>
  );
}