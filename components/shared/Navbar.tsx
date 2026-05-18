"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, User, Menu, X } from "lucide-react";
import { MAIN_NAV_LINKS } from "@/config/nav";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 1. Create a reference to the navbar container
  const navRef = useRef<HTMLDivElement>(null);

  // 2. Listen for clicks outside the container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the menu is open, and the click happened outside our navRef element, close it.
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    // Only attach the listener if the menu is actually open
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function to remove the listener when the component unmounts or menu closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    // 3. Attach the ref right here to the outermost wrapper
    <div ref={navRef} className="fixed top-0 sm:top-6 left-0 sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-fit px-0">

      <nav className="flex items-center justify-between sm:justify-start gap-1.5 p-3 sm:p-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b sm:border border-black/10 dark:border-white/10 sm:rounded-full shadow-sm w-full">

        {/* LOGO */}
        <Link href="/" className="flex items-end ml-2 sm:mr-3 group">
          <span className="font-serif italic font-black text-[22px] leading-none text-foreground group-hover:text-indigo-500 transition-colors duration-300">
            W
          </span>
          <span className="font-mono text-[22px] leading-none font-bold text-indigo-500 animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite] ml-[1px] mb-[1px]">
            _
          </span>
        </Link>

        {/* DESKTOP VIEW */}
        <div className="hidden sm:flex items-center gap-1">
          <div className="w-px h-5 bg-black/10 dark:bg-white/10 mx-1" />

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

          <div className="w-px h-5 bg-black/10 dark:bg-white/10 mx-1" />

          <div className="flex items-center gap-1 pr-0.5">
            <Link href="/settings" className="w-9 h-9 flex items-center justify-center rounded-full text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-colors">
              <Settings className="w-4 h-4" />
            </Link>
            <ThemeToggle />
            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-foreground/10 border border-border hover:ring-2 ring-foreground/20 transition-all ml-1 overflow-hidden">
              <User className="w-4 h-4 text-foreground/70" />
            </button>
          </div>
        </div>

        {/* MOBILE VIEW BUTTONS */}
        <div className="flex sm:hidden items-center gap-2 pr-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-foreground/5 text-foreground hover:bg-foreground/10 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </nav>

      {/* MOBILE DROPDOWN MENU */}
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