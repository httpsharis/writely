"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Book,
  Inbox as InboxIcon,
  Users,
  Globe,
  Settings,
  MoreHorizontal,
  ChevronLeft,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { useAuth } from "@/hooks/useAuth";

// --- Types & Config ---
interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  hasDot?: boolean;
}

interface SidebarUser {
  name?: string;
  picture?: string | null;
}

const MAIN_NAVIGATION: NavItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Projects", url: "/project", icon: Book, hasDot: true },
  { title: "Inbox", url: "/inbox", icon: InboxIcon },
  { title: "Characters", url: "/characters", icon: Users },
  { title: "World", url: "/world", icon: Globe },
];

const SECONDARY_NAVIGATION: NavItem[] = [
  { title: "Settings", url: "/settings", icon: Settings },
];

// --- MAIN COMPONENT ---
export function AppSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`relative m-4 flex h-[calc(100vh-32px)] shrink-0 flex-col rounded-3xl bg-card border border-border shadow-lg transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-18" : "w-60"
      }`}
    >
      {/* COLLAPSE TOGGLE BUTTON */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-12 z-50 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-all duration-300 hover:bg-secondary hover:scale-110"
        style={{ transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)" }}
      >
        <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>

      <SidebarHeader isCollapsed={isCollapsed} />

      <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden px-3 py-2 no-scrollbar">
        <SidebarNavigation
          items={MAIN_NAVIGATION}
          currentPath={pathname}
          isCollapsed={isCollapsed}
        />
        <div className="my-4 h-px w-full shrink-0 bg-border" />
        <SidebarNavigation
          items={SECONDARY_NAVIGATION}
          currentPath={pathname}
          isCollapsed={isCollapsed}
        />
      </div>

      <SidebarProfile user={user} isCollapsed={isCollapsed} />
    </aside>
  );
}

// --- SUB-COMPONENTS ---

function SidebarHeader({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div
      className={`flex h-18 shrink-0 items-center transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "px-6"}`}
    >
      {/* 🟢 THE FIX: dynamic gap */}
      <div className={`flex items-center justify-center overflow-hidden transition-all duration-300 ${isCollapsed ? "gap-0" : "gap-3"}`}>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Logo className="h-4 w-4" />
        </div>
        <span
          className={`text-[16px] font-semibold tracking-tight text-foreground transition-all duration-300 ${
            isCollapsed
              ? "w-0 opacity-0 pointer-events-none"
              : "w-25 opacity-100"
          }`}
        >
          Writely
        </span>
      </div>
    </div>
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
          currentPath === item.url || currentPath.startsWith(`${item.url}/`);
        const isActuallyActive =
          item.url === "/" ? currentPath === "/" : isActive;

        return (
          <Link
            key={item.title}
            href={item.url}
            className={`group flex h-10.5 items-center rounded-xl transition-all duration-300 ${
              isActuallyActive
                ? "bg-secondary text-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground font-medium"
            } ${isCollapsed ? "justify-center px-0 mx-auto w-10.5" : "px-3.5 w-full"}`}
            title={isCollapsed ? item.title : ""}
          >
            <div className="relative flex shrink-0 items-center justify-center">
              <item.icon
                className={`h-4.5 w-4.5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActuallyActive ? "stroke-2" : "stroke-[1.5]"}`}
              />
              {item.hasDot && (
                <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-[1.5px] border-card bg-blue-500" />
              )}
            </div>

            <span
              className={`whitespace-nowrap text-[13px] transition-all duration-300 overflow-hidden ${
                isCollapsed
                  ? "w-0 opacity-0 ml-0 pointer-events-none"
                  : "w-30 opacity-100 ml-3.5"
              }`}
            >
              {item.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarProfile({
  user,
  isCollapsed,
}: {
  user: SidebarUser | null;
  isCollapsed: boolean;
}) {
  return (
    <div className="shrink-0 p-3 pt-2 mt-auto border-t border-border/50">
      <Link
        href="/profile"
        className={`group w-full flex h-14 items-center rounded-2xl transition-all duration-300 hover:bg-secondary/80 ${
          isCollapsed
            ? "justify-center bg-transparent border-transparent px-0"
            : "justify-between px-3 bg-secondary/30 border border-border/50 shadow-sm"
        }`}
      >
        {/* 🟢 THE FIX: dynamic gap */}
        <div className={`flex items-center overflow-hidden transition-all duration-300 ${isCollapsed ? "gap-0" : "gap-3"}`}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-background text-muted-foreground transition-transform duration-300 group-hover:scale-105">
            {user?.picture ? (
              <Image
                src={user.picture as string}
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
            className={`flex flex-col items-start min-w-0 transition-all duration-300 ${
              isCollapsed
                ? "w-0 opacity-0 pointer-events-none"
                : "w-27.5 opacity-100"
            }`}
          >
            <span
              suppressHydrationWarning
              className="w-full truncate text-[13px] font-semibold leading-tight text-foreground"
            >
              {user?.name || "Writer"}
            </span>
            <span className="w-full truncate text-[11px] font-medium text-muted-foreground mt-0.5">
              View Profile
            </span>
          </div>
        </div>

        <MoreHorizontal
          className={`shrink-0 text-muted-foreground transition-all duration-300 group-hover:text-foreground ${
            isCollapsed
              ? "w-0 opacity-0 pointer-events-none"
              : "h-5 w-5 opacity-100"
          }`}
        />
      </Link>
    </div>
  );
}