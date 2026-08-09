"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { ChevronLeft, LogOut } from "lucide-react";
import { MAIN_NAV_LINKS, USER_MENU_LINKS, type NavItem } from "@/config/nav";
import { UserButton, useUser, SignOutButton } from "@clerk/nextjs";


export function AppSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useUser();
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
        
        <SignOutButton>
          <button
            className={`group flex mt-1 h-10 items-center rounded-r-xl border-l-[3px] border-transparent text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300 font-medium ${isCollapsed ? "justify-center px-0 mx-auto w-10 rounded-l-xl" : "px-3.5 w-full -ml-3"}`}
            title={isCollapsed ? "Log out" : ""}
          >
            <div className="relative flex shrink-0 items-center justify-center">
              <LogOut className="h-4.5 w-4.5 shrink-0 transition-transform duration-300 group-hover:scale-110 stroke-2" />
            </div>
            <span
              className={`whitespace-nowrap text-[13px] transition-all duration-300 overflow-hidden text-left ${isCollapsed ? "w-0 opacity-0 ml-0 pointer-events-none" : "w-28 opacity-100 ml-3.5"}`}
            >
              Log out
            </span>
          </button>
        </SignOutButton>
      </div>

      <div className="shrink-0 p-3 pt-2 mt-auto border-t border-border/50">
        <div
          className={`group w-full flex h-14 items-center rounded-xl transition-all duration-200 ${
            isCollapsed
              ? "justify-center px-0"
              : "justify-between px-3 bg-secondary/30 border border-border/50 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-center w-full">
            <UserButton
              appearance={{
                elements: {
                  userButtonBox: isCollapsed ? "justify-center" : "justify-start gap-3 w-full",
                  userButtonOuterIdentifier: "text-foreground font-bold text-[13px]",
                  avatarBox: "w-8 h-8 rounded-full border border-border hover:scale-105 transition-transform"
                }
              }}
              showName={!isCollapsed}
            />
          </div>
        </div>
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
