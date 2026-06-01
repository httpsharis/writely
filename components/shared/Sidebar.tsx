"use client";

import { useState } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  Library, 
  Users, 
  Globe, 
  Settings, 
  MoreHorizontal,
  StickyNote,
  ChevronLeft
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { usePathname } from "next/navigation";
import Link from "next/link"; 
import Image from "next/image";
import { Logo } from "@/components/shared/Logo";

const mainNav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Drafts", url: "/drafts", icon: FileText, hasDot: true },
  { title: "Library", url: "/library", icon: Library },
  { title: "Characters", url: "/characters", icon: Users },
  { title: "World", url: "/world", icon: Globe },
  { title: "Notes", url: "/notes", icon: StickyNote },
];

const secondaryNav = [
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const user = useSelector((state: RootState) => state.auth.user);
  const pathname = usePathname();
  
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={`relative m-4 flex h-[calc(100vh-32px)] flex-col rounded-[24px] bg-[#171926] shadow-2xl transition-all duration-500 ease-in-out ${
        isCollapsed ? "w-[72px]" : "w-[240px]"
      }`}
    >
      
      {/* THE TOGGLE */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-12 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-black shadow-md transition-transform duration-500 hover:bg-gray-100"
        style={{ transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)" }}
      >
        <ChevronLeft className="h-3.5 w-3.5" strokeWidth={3} />
      </button>

      {/* HEADER */}
      <div className={`flex h-[72px] shrink-0 items-center transition-all duration-500 ${
        isCollapsed ? "justify-center px-0" : "px-6"
      }`}>
        <div className={`flex items-center overflow-hidden transition-all duration-500 ${isCollapsed ? "gap-0" : "gap-3"}`}>
          
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#535CE8] text-white shadow-sm">
            <Logo className="h-4 w-4" />
          </div>
          
          {/* Smooth Text Shrink */}
          <span className={`text-[16px] font-semibold tracking-tight text-white transition-all duration-500 overflow-hidden whitespace-nowrap ${
            isCollapsed ? "w-0 opacity-0" : "w-[100px] opacity-100"
          }`}>
            Writely
          </span>
          
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Main Nav */}
        <nav className="flex flex-col gap-1">
          {mainNav.map((item) => {
            const isActive = pathname === item.url;
            return (
              <Link 
                key={item.title}
                href={item.url} 
                className={`group flex h-[42px] items-center rounded-[12px] transition-all duration-500 ${
                  isActive 
                  ? "bg-[#292D41] text-white shadow-sm" 
                  : "text-[#828A9F] hover:bg-[#1F2333] hover:text-white"
                } ${isCollapsed ? "justify-center px-0" : "px-3.5"}`}
                title={isCollapsed ? item.title : ""}
              >
                <div className="relative flex shrink-0 items-center justify-center">
                  <item.icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? "stroke-[2]" : "stroke-[1.5]"}`} />
                  {item.hasDot && (
                    <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full border-[1.5px] border-[#171926] bg-[#FF7132]" />
                  )}
                </div>
                
                {/* Smooth Text Shrink */}
                <span className={`whitespace-nowrap text-[13px] transition-all duration-500 overflow-hidden ${isActive ? "font-semibold" : "font-medium"} ${
                  isCollapsed ? "w-0 opacity-0 ml-0" : "w-[120px] opacity-100 ml-3.5"
                }`}>
                  {item.title}
                </span>
                
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="my-4 h-px w-full bg-white/5" />

        {/* Secondary Nav */}
        <nav className="flex flex-col gap-1">
          {secondaryNav.map((item) => {
            const isActive = pathname === item.url;
            return (
              <Link 
                key={item.title}
                href={item.url} 
                className={`group flex h-[42px] items-center rounded-[12px] transition-all duration-500 ${
                  isActive 
                  ? "bg-[#292D41] text-white shadow-sm" 
                  : "text-[#828A9F] hover:bg-[#1F2333] hover:text-white"
                } ${isCollapsed ? "justify-center px-0" : "px-3.5"}`}
                title={isCollapsed ? item.title : ""}
              >
                <div className="relative flex shrink-0 items-center justify-center">
                  <item.icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? "stroke-[2]" : "stroke-[1.5]"}`} />
                </div>
                
                {/* Smooth Text Shrink */}
                <span className={`whitespace-nowrap text-[13px] transition-all duration-500 overflow-hidden ${isActive ? "font-semibold" : "font-medium"} ${
                  isCollapsed ? "w-0 opacity-0 ml-0" : "w-[120px] opacity-100 ml-3.5"
                }`}>
                  {item.title}
                </span>
                
              </Link>
            )
          })}
        </nav>
      </div>

      {/* PINNED FOOTER */}
      <div className="shrink-0 p-3 pt-2">
        <Link 
          href="/profile"
          className={`w-full flex h-[56px] items-center rounded-[16px] transition-all duration-500 hover:bg-[#1F2333] ${
            isCollapsed ? "justify-center border-transparent bg-transparent px-0" : "justify-between px-3 bg-[#1B1E2E] border border-white/5 shadow-sm"
          }`}
        >
          <div className={`flex items-center overflow-hidden transition-all duration-500 ${isCollapsed ? "gap-0" : "gap-3"}`}>
            
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#292D41]">
              {user?.picture ? (
                <Image 
                  src={user.picture as string} 
                  alt="Profile" 
                  width={32}
                  height={32}
                  className="h-full w-full object-cover" 
                />
              ) : (
                <span suppressHydrationWarning className="text-[11px] font-bold text-[#828A9F]">
                  {user?.name?.charAt(0) || "W"}
                </span>
              )}
            </div>
            
            {/* Smooth Text Shrink */}
            <div className={`flex flex-col items-start overflow-hidden transition-all duration-500 ${
              isCollapsed ? "w-0 opacity-0" : "w-[110px] opacity-100"
            }`}>
              <span suppressHydrationWarning className="w-full truncate text-[13px] font-semibold leading-tight text-white">
                {user?.name || "Writer"}
              </span>
              <span className="mt-0.5 w-full truncate text-[11px] font-medium text-[#828A9F]">
                Profile
              </span>
            </div>

          </div>
          
          {/* Smooth Icon Shrink */}
          <MoreHorizontal className={`shrink-0 text-[#828A9F] transition-all duration-500 hover:text-white ${
            isCollapsed ? "w-0 opacity-0 overflow-hidden" : "h-5 w-5 opacity-100"
          }`} />

        </Link>
      </div>

    </aside>
  );
}