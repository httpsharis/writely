"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { 
  Edit3, 
  Share2, 
  MapPin, 
  Calendar, 
  Link as LinkIcon,
  Flame,
  Trophy,
  PenTool,
  BookOpen
} from "lucide-react";

export default function ProfilePage() {
  const [isMounted, setIsMounted] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  // Placeholder Stats & Data
  const authorStats = [
    { label: "Total Words", value: "142,500", icon: PenTool, color: "text-[#535CE8]", bg: "bg-[#535CE8]/10" },
    { label: "Current Streak", value: "12 Days", icon: Flame, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
    { label: "Projects", value: "4 Active", icon: BookOpen, color: "text-[#10B981]", bg: "bg-[#10B981]/10" },
  ];

  const pinnedWorks = [
    { id: 1, title: "The Silent City", type: "Novel • Fantasy", status: "Drafting", progress: "45%" },
    { id: 2, title: "Echoes of Eternity", type: "Short Story", status: "Editing", progress: "90%" },
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-auto md:h-full w-full animate-in fade-in duration-700 pb-32 md:pb-12 px-4 md:px-8 pt-6 md:pt-10 custom-scrollbar md:overflow-y-auto">
      
      {/* HEADER / COVER SECTION */}
      <section className="relative mb-16 md:mb-20">
        {/* Cover Gradient */}
        <div className="h-32 md:h-48 w-full rounded-[24px] md:rounded-[32px] bg-gradient-to-r from-[#535CE8]/20 via-[#8B5CF6]/20 to-[#10B981]/20 border border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
        </div>

        {/* Avatar & Actions */}
        <div className="absolute -bottom-12 md:-bottom-16 left-6 md:left-10 flex items-end justify-between w-[calc(100%-48px)] md:w-[calc(100%-80px)]">
          <div className="flex h-24 w-24 md:h-32 md:w-32 items-center justify-center rounded-full bg-[#171926] border-4 md:border-[6px] border-[#0B0D14] shadow-xl text-white overflow-hidden">
            {user?.picture ? (
              <img src={user.picture as string} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl md:text-5xl font-bold text-[#828A9F]">
                {user?.name?.charAt(0) || "W"}
              </span>
            )}
          </div>
          
          <div className="flex gap-2 pb-2 md:pb-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#171926] border border-white/10 text-white hover:bg-[#1F2333] transition-colors text-[13px] font-semibold">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:block">Share</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#535CE8] text-white hover:bg-[#6069F0] transition-colors text-[13px] font-semibold shadow-lg shadow-[#535CE8]/20">
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:block">Edit Profile</span>
            </button>
          </div>
        </div>
      </section>

      {/* AUTHOR IDENTITY */}
      <section className="px-2 md:px-4 mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
          {user?.name || "Author Name"}
        </h1>
        <p className="text-[15px] text-[#535CE8] font-medium mb-4">
          @username
        </p>
        <p className="text-[14px] md:text-[15px] text-[#E2E8F0] leading-relaxed max-w-2xl mb-6">
          Fantasy and Sci-Fi author obsessed with intricate magic systems and morally gray characters. Currently drafting the first book in The Silent City series. 
        </p>

        <div className="flex flex-wrap gap-4 md:gap-6 text-[13px] text-[#828A9F] font-medium">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            New York, USA
          </span>
          <span className="flex items-center gap-1.5">
            <LinkIcon className="w-4 h-4" />
            <a href="#" className="hover:text-white transition-colors">authorwebsite.com</a>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            Joined June 2026
          </span>
        </div>
      </section>

      {/* GAMIFIED STATS */}
      <section className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {authorStats.map((stat, idx) => (
            <div key={idx} className="flex items-center gap-4 p-5 rounded-[24px] bg-[#171926] border border-white/5">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <p className="text-[12px] font-bold tracking-[0.1em] text-[#828A9F] uppercase mb-0.5">
                  {stat.label}
                </p>
                <p className="text-[20px] font-bold text-white tracking-tight">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PINNED WORKS */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-2">
          <Trophy className="w-5 h-5 text-[#F59E0B]" />
          <h2 className="text-[14px] font-bold tracking-[0.15em] text-white uppercase">
            Pinned Works
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pinnedWorks.map((work) => (
            <div key={work.id} className="group p-5 rounded-[24px] bg-[#171926] border border-white/5 hover:border-white/10 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-[17px] font-semibold text-white group-hover:text-[#535CE8] transition-colors">
                  {work.title}
                </h3>
                <span className="px-2.5 py-1 rounded-md bg-[#292D41] text-[#828A9F] text-[11px] font-bold uppercase tracking-wide">
                  {work.status}
                </span>
              </div>
              <p className="text-[13px] text-[#828A9F] mb-4">
                {work.type}
              </p>
              
              {/* Fake Progress Bar */}
              <div className="w-full">
                <div className="flex justify-between text-[11px] font-bold text-[#828A9F] uppercase mb-2">
                  <span>Progress</span>
                  <span>{work.progress}</span>
                </div>
                <div className="h-1.5 w-full bg-[#292D41] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#535CE8] to-[#8B5CF6] rounded-full"
                    style={{ width: work.progress }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}