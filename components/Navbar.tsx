"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  PenTool,
  Library,
  Globe,
  User,
  Settings,
  CreditCard,
  LogOut,
  BookOpen,
} from "lucide-react";

// Import our new shadcn Dropdown Menu components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

const NAV_LINKS = [
  { name: "Studio", href: "/", icon: PenTool },
  { name: "Library", href: "/library", icon: Library },
  { name: "Universe", href: "/universe", icon: Globe },
];

export function GlassNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <>
      {/* =========================================
          DESKTOP NAVIGATION (Top Floating Pill)
          ========================================= */}
      <div className="hidden md:flex fixed top-6 left-0 right-0 z-50 justify-center px-4 pointer-events-none">
        <nav className="bg-white/60 dark:bg-[#09090b]/60 backdrop-blur-xl backdrop-saturate-150 border border-black/10 dark:border-white/10 shadow-xl px-3 py-3 rounded-full flex items-center pointer-events-auto transition-colors duration-300">
          {/* Logo */}
          <div className="px-5 flex items-center space-x-2 border-r border-black/10 dark:border-white/10">
            <div className="w-2 h-2 bg-black dark:bg-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)] dark:shadow-[0_0_10px_#FFF]"></div>
            <span className="font-bold text-sm tracking-widest uppercase text-black dark:text-white">
              Writely
            </span>
          </div>

          {/* The 3 Pillars */}
          <div className="flex items-center space-x-1 px-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                      : "text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="ml-2 pl-4 pr-1 py-1 border-l border-black/10 dark:border-white/10 flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-300 relative overflow-hidden"
              aria-label="Toggle Theme"
            >
              <Sun className="w-4 h-4 transition-all duration-300 dark:-translate-y-10 dark:opacity-0" />
              <Moon className="w-4 h-4 absolute transition-all duration-300 translate-y-10 opacity-0 dark:translate-y-0 dark:opacity-100" />
            </button>

            {/* Profile Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button className="w-9 h-9 rounded-full overflow-hidden border border-black/10 dark:border-white/20 hover:border-black dark:hover:border-white transition outline-none ring-0">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
                    alt="Profile"
                    fill
                    className="w-full h-full object-cover"
                  />
                </button>
              </DropdownMenuTrigger>

              {/* Glassmorphism styling applied directly to the Dropdown Content */}
              <DropdownMenuContent
                align="end"
                sideOffset={12}
                className="w-56 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl backdrop-saturate-150 border-black/10 dark:border-white/10 rounded-2xl shadow-2xl"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Sarah Writer
                    </p>
                    <p className="text-xs leading-none text-slate-500 dark:text-slate-400">
                      sarah@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-black/5 dark:bg-white/10" />

                <DropdownMenuItem className="cursor-pointer focus:bg-black/5 dark:focus:bg-white/10 rounded-xl">
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Public Author Page</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer focus:bg-black/5 dark:focus:bg-white/10 rounded-xl">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer focus:bg-black/5 dark:focus:bg-white/10 rounded-xl">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-black/5 dark:bg-white/10" />

                <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-500/10 dark:focus:bg-red-500/10 rounded-xl">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>

      {/* =========================================
          MOBILE NAVIGATION (Bottom iOS-Style Tab Bar)
          ========================================= */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 pointer-events-none">
        <nav className="bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-2xl backdrop-saturate-200 border border-black/10 dark:border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] px-2 py-2 rounded-3xl flex items-center justify-between pointer-events-auto transition-colors duration-300">
          {/* Core Links */}
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex flex-col items-center justify-center w-full py-2 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "text-accent dark:text-indigo-400 bg-black/5 dark:bg-white/5"
                    : "text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mb-1 ${isActive ? "fill-accent/20 dark:fill-indigo-400/20" : ""}`}
                />
                <span className="text-[10px] font-medium tracking-wide">
                  {link.name}
                </span>
              </Link>
            );
          })}

          {/* Mobile Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex flex-col items-center justify-center w-full py-2 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-all duration-300 relative"
          >
            <div className="relative w-5 h-5 mb-1">
              <Sun className="absolute inset-0 w-full h-full transition-all duration-300 dark:-translate-y-5 dark:opacity-0" />
              <Moon className="absolute inset-0 w-full h-full transition-all duration-300 translate-y-5 opacity-0 dark:translate-y-0 dark:opacity-100" />
            </div>
            <span className="text-[10px] font-medium tracking-wide">Theme</span>
          </button>

          {/* Profile Mobile */}
          <Link
            href="/settings"
            className={`flex flex-col items-center justify-center w-full py-2 rounded-2xl transition-all duration-300 ${
              pathname.includes("/settings")
                ? "text-accent dark:text-indigo-400 bg-black/5 dark:bg-white/5"
                : "text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium tracking-wide">
              Profile
            </span>
          </Link>
        </nav>
      </div>
    </>
  );
}
