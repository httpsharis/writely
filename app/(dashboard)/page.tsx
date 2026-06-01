"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { 
  FileText, 
  Users, 
  Globe, 
  ArrowRight, 
  PenLine, 
  Clock,
  Plus
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMounted && (!token || !user)) {
      router.replace("/login");
    }
  }, [isMounted, token, user, router]);

  if (!isMounted || !token || !user) {
    return null; 
  }

  const recentFiles = [
    { id: 1, title: "Arthur Pendragon", type: "Character Profile", icon: Users, time: "2h ago", color: "text-[#10B981]", bg: "bg-[#10B981]/10" },
    { id: 2, title: "The Magic System", type: "World Lore", icon: Globe, time: "Yesterday", color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
    { id: 3, title: "Chapter 3: The Arrival", type: "Draft", icon: FileText, time: "3d ago", color: "text-[#535CE8]", bg: "bg-[#535CE8]/10" },
    { id: 4, title: "The Silent City", type: "Location", icon: Globe, time: "4d ago", color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
  ];

  return (
    // Mobile: h-auto (scrolls naturally), pb-32 (clears the floating nav bar)
    // Desktop: h-full (locked), pb-4
    <div className="max-w-6xl mx-auto flex flex-col h-auto md:h-full w-full animate-in fade-in duration-700 pb-32 md:pb-4 px-4 md:px-8">
      
      {/* HEADER: Scaled down text for mobile */}
      <header className="shrink-0 mb-8 md:mb-12 pt-8 md:pt-12 flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-[44px] font-bold tracking-tight text-white mb-2 leading-tight">
            Good afternoon, {user?.name?.split(' ')[0] || 'Writer'}.
          </h1>
          <p className="text-[#828A9F] text-[15px] md:text-[18px] font-medium">
            Your universe is waiting for you.
          </p>
        </div>
        
        {/* Hidden on mobile, visible on desktop */}
        <button className="hidden md:flex items-center gap-2 px-5 py-3 rounded-full bg-white text-black hover:bg-gray-100 transition-colors font-semibold text-[14px]">
          <Plus className="w-4 h-4 stroke-[2.5]" />
          New Draft
        </button>
      </header>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex flex-col gap-8 md:gap-10 flex-1 md:min-h-0">
        
        {/* HERO CARD */}
        <section className="shrink-0">
          <h2 className="text-[11px] md:text-[12px] font-bold tracking-[0.25em] text-[#828A9F] uppercase mb-4 ml-1">
            Pick up where you left off
          </h2>
          <button className="group relative w-full flex items-center justify-between p-6 md:p-10 rounded-[28px] md:rounded-[32px] bg-[#171926] border border-white/5 hover:border-white/10 transition-all duration-500 text-left overflow-hidden shadow-2xl shadow-black/20">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#535CE8] opacity-[0.08] rounded-full blur-[100px] group-hover:opacity-[0.15] transition-opacity duration-700" />
            
            <div className="relative flex items-center gap-4 md:gap-6 z-10">
              <div className="flex h-14 w-14 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-[18px] md:rounded-[20px] bg-[#292D41] text-white border border-white/5 group-hover:bg-[#535CE8] group-hover:scale-105 transition-all duration-500">
                <PenLine className="h-6 w-6 md:h-7 md:w-7 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-[20px] md:text-[24px] font-semibold text-white mb-1.5 group-hover:text-[#535CE8] transition-colors duration-300 tracking-tight">
                  Chapter 4: The Silent City
                </h3>
                <div className="flex items-center gap-2.5 text-[12px] md:text-[14px] text-[#828A9F] font-medium">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-[#E2E8F0]">Draft</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 md:w-4 md:h-4" /> 10 mins ago</span>
                </div>
              </div>
            </div>
            
            {/* Arrow removed on mobile to save space, visible on desktop */}
            <div className="hidden md:flex relative z-10 h-12 w-12 rounded-full items-center justify-center bg-white/5 opacity-0 -translate-x-6 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out">
              <ArrowRight className="h-5 w-5 text-white" />
            </div>
          </button>
        </section>

        {/* GALLERY GRID */}
        <section className="flex flex-col h-full md:min-h-0">
          <h2 className="shrink-0 text-[11px] md:text-[12px] font-bold tracking-[0.25em] text-[#828A9F] uppercase mb-4 ml-1">
            Recent Workspace
          </h2>
          
          {/* Mobile: overflow-visible (natural scroll) / Desktop: overflow-y-auto (locked scroll) */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-visible md:overflow-y-auto custom-scrollbar md:pb-10">
            {recentFiles.map((file) => (
              <button 
                key={file.id}
                className="group flex flex-col justify-between p-5 h-[160px] rounded-[24px] bg-[#171926] border border-white/5 hover:border-white/10 hover:bg-[#1F2333] hover:-translate-y-1 transition-all duration-300 text-left"
              >
                <div className="flex items-start justify-between w-full">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${file.bg} ${file.color} transition-colors`}>
                    <file.icon className="h-5 w-5 stroke-[2]" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#828A9F] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
                
                <div className="mt-auto">
                  <h4 className="text-[15px] font-semibold text-white mb-1 truncate w-full">
                    {file.title}
                  </h4>
                  <div className="flex items-center justify-between text-[12px] text-[#828A9F] font-medium">
                    <span>{file.type}</span>
                    <span>{file.time}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
        </section>

      </div>
    </div>
  );
}