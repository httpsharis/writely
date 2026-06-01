"use client";

import { LayoutDashboard, Library, Users, StickyNote, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function MobileBottomBar() {
  const pathname = usePathname();

  return (
    // The Floating Wrapper: positioned slightly off the bottom and sides
    <div className="md:hidden fixed bottom-6 inset-x-6 z-50">
      
      {/* The Pill Container */}
      <div className="flex h-[68px] items-center justify-between rounded-[34px] bg-[#171926]/95 backdrop-blur-xl border border-white/10 px-6 shadow-2xl shadow-black/80">
        
        {/* Left Side */}
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center p-2 transition-all duration-300 ${pathname === "/" ? "text-white" : "text-[#828A9F] hover:text-white"}`}
        >
          <LayoutDashboard className={`h-5 w-5 ${pathname === "/" ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
        </Link>
        
        <Link 
          href="/library" 
          className={`flex flex-col items-center justify-center p-2 transition-all duration-300 ${pathname === "/library" ? "text-white" : "text-[#828A9F] hover:text-white"}`}
        >
          <Library className={`h-5 w-5 ${pathname === "/library" ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
        </Link>

        {/* Center Floating Action Button (FAB) */}
        <div className="relative -top-5">
          <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#535CE8] text-white shadow-lg shadow-[#535CE8]/40 hover:bg-[#6069F0] active:scale-95 transition-all duration-300 border-[4px] border-[#0B0D14]">
            <Plus className="h-6 w-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Right Side */}
        <Link 
          href="/characters" 
          className={`flex flex-col items-center justify-center p-2 transition-all duration-300 ${pathname === "/characters" ? "text-white" : "text-[#828A9F] hover:text-white"}`}
        >
          <Users className={`h-5 w-5 ${pathname === "/characters" ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
        </Link>

        <Link 
          href="/notes" 
          className={`flex flex-col items-center justify-center p-2 transition-all duration-300 ${pathname === "/notes" ? "text-white" : "text-[#828A9F] hover:text-white"}`}
        >
          <StickyNote className={`h-5 w-5 ${pathname === "/notes" ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
        </Link>

      </div>
    </div>
  );
}