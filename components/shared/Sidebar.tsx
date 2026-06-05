"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import { MAIN_NAV_LINKS, USER_MENU_LINKS, type NavItem } from "@/config/nav";

interface SidebarUser {
  name?: string | null;
  picture?: string | null;
}

export function AppSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Mock user for template purposes
  const user: SidebarUser = { name: "Muhammad", picture: null };

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <aside
      className={`relative m-3 flex h-[calc(100vh-24px)] shrink-0 flex-col rounded-2xl bg-card border border-border shadow-sm transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-[68px]" : "w-[240px]"
      }`}
    >
      <button
        onClick={toggleSidebar}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-10 z-50 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-all duration-300 hover:bg-secondary hover:scale-110"
        style={{ transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)" }}
      >
        <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>

      <div
        className={`flex h-16 shrink-0 items-center transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "px-6"}`}
      >
        <div
          className={`flex items-center justify-center overflow-hidden transition-all duration-300 ${isCollapsed ? "gap-0" : "gap-3"}`}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-foreground text-background shadow-sm font-serif font-bold text-xs">
            W
          </div>
          <span
            className={`text-base font-bold tracking-tight text-foreground transition-all duration-300 ${isCollapsed ? "w-0 opacity-0 pointer-events-none" : "w-24 opacity-100"}`}
          >
            Writely
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden px-3 py-2 no-scrollbar">
        <SidebarNavigation
          items={MAIN_NAV_LINKS}
          currentPath={pathname}
          isCollapsed={isCollapsed}
        />
        <hr className="my-4 border-border/50" />
        <SidebarNavigation
          items={USER_MENU_LINKS}
          currentPath={pathname}
          isCollapsed={isCollapsed}
        />
      </div>

      <div className="shrink-0 p-3 pt-2 mt-auto border-t border-border/50">
        <Link
          href="/profile"
          className={`group w-full flex h-14 items-center rounded-xl transition-all duration-200 active:scale-[0.98] hover:bg-secondary/80 ${
            isCollapsed
              ? "justify-center bg-transparent border-transparent px-0"
              : "justify-between px-3 bg-secondary/30 border border-border/50 shadow-sm"
          }`}
        >
          <div
            className={`flex items-center overflow-hidden transition-all duration-200 ${isCollapsed ? "gap-0" : "gap-3"}`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-background text-muted-foreground transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
              {user?.picture ? (
                <Image
                  src={user.picture}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span
                  suppressHydrationWarning
                  className="text-[11px] font-bold text-foreground uppercase"
                >
                  {user?.name?.charAt(0) || "W"}
                </span>
              )}
            </div>

            <div
              className={`flex flex-col items-start min-w-0 transition-all duration-200 ${isCollapsed ? "w-0 opacity-0 pointer-events-none" : "w-28 opacity-100"}`}
            >
              <span className="w-full truncate text-[13px] font-bold leading-tight text-foreground group-hover:text-brand transition-colors duration-200">
                {user?.name || "Writer"}
              </span>
              <span className="w-full truncate text-[11px] font-medium text-muted-foreground mt-0.5">
                View Profile
              </span>
            </div>
          </div>
          <MoreHorizontal
            className={`shrink-0 text-muted-foreground transition-all duration-200 group-hover:text-foreground ${isCollapsed ? "w-0 opacity-0 pointer-events-none" : "h-4 w-4 opacity-100"}`}
          />
        </Link>
      </div>
    </aside>
  );
}

function SidebarNavigation({
  items,
  currentPath,
  isCollapsed,
}: {
  items: NavItem[];
  currentPath: string;
  isCollapsed: boolean;
}) {
  return (
    <nav className="flex flex-col gap-1 w-full">
      {items.map((item) => {
        const isActive =
          currentPath === item.href || currentPath.startsWith(`${item.href}/`);
        const isActuallyActive =
          item.href === "/" ? currentPath === "/" : isActive;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`group flex h-10 items-center rounded-r-xl border-l-[3px] transition-all duration-300 ${
              isActuallyActive
                ? "bg-secondary border-brand text-foreground font-bold shadow-sm"
                : "border-transparent text-muted-foreground hover:bg-secondary/50 hover:text-foreground font-medium"
            } ${isCollapsed ? "justify-center px-0 mx-auto w-10 rounded-l-xl" : "px-3.5 w-full -ml-3"}`}
            title={isCollapsed ? item.name : ""}
          >
            <div className="relative flex shrink-0 items-center justify-center">
              <item.icon
                className={`h-4.5 w-4.5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActuallyActive ? "stroke-2 text-brand" : "stroke-2"}`}
              />
              {item.hasDot && (
                <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-card bg-brand" />
              )}
            </div>
            <span
              className={`whitespace-nowrap text-[13px] transition-all duration-300 overflow-hidden ${isCollapsed ? "w-0 opacity-0 ml-0 pointer-events-none" : "w-28 opacity-100 ml-3.5"}`}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
