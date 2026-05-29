"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, User, Menu, X, Search } from "lucide-react";
import { MAIN_NAV_LINKS } from "@/config/nav";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close mobile menu if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Helper to open the global Command Palette
  const openSearch = () => {
    window.dispatchEvent(new Event("open-command-palette"));
    setIsMobileMenuOpen(false); // Close mobile menu if they click search
  };

  return (
    <div ref={navRef} className="fixed top-0 sm:top-6 left-0 sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-fit px-0">

      <nav className="flex items-center justify-between sm:justify-start gap-1.5 p-3 sm:p-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b sm:border border-black/10 dark:border-white/10 sm:rounded-full shadow-sm w-full">

        {/* LOGO */}
        <Link href="/" className="flex items-end ml-2 sm:mr-3 group shrink-0">
          <span className="font-serif italic font-black text-[22px] leading-none text-foreground group-hover:text-indigo-500 transition-colors duration-300">
            W
          </span>
          <span className="font-mono text-[22px] leading-none font-bold text-indigo-500 animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite] ml-[1px] mb-[1px] will-change-opacity">
            _
          </span>
        </Link>

        {/* ==============================================
            DESKTOP VIEW (Hidden on Mobile)
            ============================================== */}
        <div className="hidden sm:flex items-center gap-1">
          <div className="w-px h-5 bg-border/50 mx-1" />

          {/* Main Links */}
          <div className="flex items-center gap-1 px-1">
            {MAIN_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300 ${isActive ? "bg-foreground text-background shadow-md" : "text-foreground/70 hover:text-foreground hover:bg-foreground/10"
                    }`}
                >
                  <Icon className={`w-[15px] h-[15px] ${isActive ? "opacity-100" : "opacity-70"}`} />
                  <span className="tracking-tight">{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="w-px h-5 bg-border/50 mx-1" />

          {/* Desktop Right Actions */}
          <div className="flex items-center gap-1 pr-0.5">

            {/* Global Search Trigger (Desktop Pill) */}
            <button
              onClick={openSearch}
              className="group flex items-center gap-2 h-9 px-3 mr-1 rounded-full bg-foreground/[0.03] hover:bg-foreground/[0.08] border border-border/50 hover:border-border transition-all text-foreground/50 hover:text-foreground"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline-block text-xs font-medium mr-2">Search...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-sans font-semibold bg-background border border-border/50 rounded-md shadow-sm opacity-70 group-hover:opacity-100 transition-opacity">
                ⌘K
              </kbd>
            </button>

            <Link href="/settings" className="w-9 h-9 flex items-center justify-center rounded-full text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-colors">
              <Settings className="w-4 h-4" />
            </Link>

            <ThemeToggle />

            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-foreground/10 border border-border hover:ring-2 ring-foreground/20 transition-all ml-1 overflow-hidden">
              <User className="w-4 h-4 text-foreground/70" />
            </button>
          </div>
        </div>

        {/* ==============================================
            MOBILE VIEW BUTTONS (Hidden on Desktop)
            ============================================== */}
        <div className="flex sm:hidden items-center gap-1 pr-1">

          {/* Mobile Search Button (In the Header!) */}
          <button
            onClick={openSearch}
            className="w-10 h-10 flex items-center justify-center rounded-full text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-colors"
          >
            <Search className="w-[18px] h-[18px]" />
          </button>

          <ThemeToggle />

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-foreground hover:bg-foreground/10 transition-colors ml-1"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </nav>

      {/* ==============================================
          MOBILE DROPDOWN MENU 
          ============================================== */}
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border shadow-2xl flex flex-col animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col p-4 gap-2">

            {/* Main Links */}
            {MAIN_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${isActive ? "bg-foreground text-background" : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                </Link>
              );
            })}

            <div className="w-full h-px bg-border my-2" />

            {/* Profile */}
            <Link
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl text-foreground/70 hover:bg-foreground/5 hover:text-foreground transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Your Profile</span>
                <span className="text-xs text-foreground/50">Manage account</span>
              </div>
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl text-foreground/70 hover:bg-foreground/5 hover:text-foreground transition-all"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>

          </div>
        </div>
      )}
    </div>
  );
}