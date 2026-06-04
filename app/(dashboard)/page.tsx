"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Users, 
  Globe, 
  ArrowRight, 
  PenLine, 
  Clock,
  Plus
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// --- Mock Data (Replace with RTK Query later) ---
const RECENT_FILES = [
  { id: 1, title: "Arthur Pendragon", type: "Character Profile", icon: Users, time: "2h ago", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: 2, title: "The Magic System", type: "World Lore", icon: Globe, time: "Yesterday", color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: 3, title: "Chapter 3: The Arrival", type: "Draft", icon: FileText, time: "3d ago", color: "text-primary", bg: "bg-primary/10" },
  { id: 4, title: "The Silent City", type: "Location", icon: Globe, time: "4d ago", color: "text-amber-500", bg: "bg-amber-500/10" },
];

// --- Main Page Component ---
export default function DashboardPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { user, token } = useAuth();

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
    return null; // or a loading skeleton
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-auto w-full animate-in fade-in duration-700 pb-32 md:pb-8 px-4 md:px-8">
      <DashboardHeader userName={user.name} />
      
      <div className="flex flex-col gap-8 md:gap-10 flex-1">
        <HeroCard />
        <RecentWorkspace files={RECENT_FILES} />
      </div>
    </div>
  );
}

// --- Sub-Components ---

function DashboardHeader({ userName }: { userName?: string }) {
  const firstName = userName?.split(' ')[0] || 'Writer';
  
  return (
    <header className="shrink-0 mb-8 md:mb-10 pt-8 md:pt-12 flex justify-between items-end">
      <div>
        <h1 className="text-3xl md:text-[44px] font-bold tracking-tight text-foreground mb-2 leading-tight">
          Good afternoon, {firstName}.
        </h1>
        <p className="text-muted-foreground text-[15px] md:text-[18px] font-medium">
          Your universe is waiting for you.
        </p>
      </div>
      
      {/* Hidden on mobile, visible on desktop */}
      <button className="hidden md:flex items-center gap-2 px-5 py-3 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors font-semibold text-[14px]">
        <Plus className="w-4 h-4 stroke-[2.5]" />
        New Draft
      </button>
    </header>
  );
}

function HeroCard() {
  return (
    <section className="shrink-0">
      <h2 className="text-[11px] md:text-[12px] font-bold tracking-[0.25em] text-muted-foreground uppercase mb-4 ml-1">
        Pick up where you left off
      </h2>
      
      <button className="group relative w-full flex items-center justify-between p-6 md:p-10 rounded-[28px] md:rounded-[32px] bg-card border border-border hover:border-border/80 transition-all duration-300 text-left shadow-sm hover:shadow-md">
        
        <div className="relative flex items-center gap-4 md:gap-6 z-10">
          <div className="flex h-14 w-14 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-[18px] md:rounded-[20px] bg-secondary text-foreground border border-border/50 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 transition-all duration-300">
            <PenLine className="h-6 w-6 md:h-7 md:w-7 stroke-[1.5]" />
          </div>
          <div>
            <h3 className="text-[20px] md:text-[24px] font-semibold text-foreground mb-1.5 transition-colors duration-300 tracking-tight">
              Chapter 4: The Silent City
            </h3>
            <div className="flex items-center gap-2.5 text-[12px] md:text-[14px] text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-foreground/80">
                Draft
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" /> 
                10 mins ago
              </span>
            </div>
          </div>
        </div>
        
        {/* Arrow visible on desktop */}
        <div className="hidden md:flex relative z-10 h-12 w-12 rounded-full items-center justify-center bg-secondary opacity-0 -translate-x-6 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">
          <ArrowRight className="h-5 w-5 text-foreground" />
        </div>
      </button>
    </section>
  );
}

function RecentWorkspace({ files }: { files: any[] }) {
  return (
    <section className="flex flex-col flex-1">
      <h2 className="shrink-0 text-[11px] md:text-[12px] font-bold tracking-[0.25em] text-muted-foreground uppercase mb-4 ml-1">
        Recent Workspace
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-10">
        {files.map((file) => (
          <button 
            key={file.id}
            className="group flex flex-col justify-between p-5 h-[160px] rounded-[24px] bg-card border border-border hover:border-border/80 hover:bg-secondary/50 hover:-translate-y-1 transition-all duration-300 text-left shadow-sm"
          >
            <div className="flex items-start justify-between w-full">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${file.bg} ${file.color} transition-colors`}>
                <file.icon className="h-5 w-5 stroke-[2]" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </div>
            
            <div className="mt-auto w-full">
              <h4 className="text-[15px] font-semibold text-foreground mb-1 truncate w-full">
                {file.title}
              </h4>
              <div className="flex items-center justify-between text-[12px] text-muted-foreground font-medium">
                <span>{file.type}</span>
                <span>{file.time}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}