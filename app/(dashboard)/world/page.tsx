"use client";

import { useEffect, useState } from "react";
import { 
  Search, 
  Plus, 
  Filter,
  MoreVertical,
  Globe,
  Map,
  Sparkles,
  BookOpen,
  Shield,
  Flag
} from "lucide-react";

export default function UniversePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  // Placeholder Data - Grouped by type
  const locations = [
    { id: 1, title: "The Silent City", category: "Geography", type: "Capital City", lastEdited: "2 hrs ago", icon: Globe, color: "text-[#535CE8]", bg: "bg-[#535CE8]/10" },
    { id: 2, title: "The Whispering Woods", category: "Geography", type: "Forest", lastEdited: "5 days ago", icon: Map, color: "text-[#10B981]", bg: "bg-[#10B981]/10" },
    { id: 3, title: "Iron Keep", category: "Geography", type: "Fortress", lastEdited: "1 week ago", icon: Flag, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
  ];

  const loreAndSystems = [
    { id: 4, title: "Aetherial Magic", category: "Magic System", type: "Ruleset", lastEdited: "Yesterday", icon: Sparkles, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10" },
    { id: 5, title: "The Great Schism", category: "History", type: "Event", lastEdited: "3 days ago", icon: BookOpen, color: "text-[#EF4444]", bg: "bg-[#EF4444]/10" },
    { id: 6, title: "The Crimson Order", category: "Faction", type: "Guild", lastEdited: "2 weeks ago", icon: Shield, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-auto md:h-full w-full animate-in fade-in duration-700 pb-32 md:pb-4 px-4 md:px-8">
      
      {/* HEADER & SEARCH */}
      <header className="shrink-0 mb-8 pt-8 md:pt-12 flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-white mb-2 leading-tight">
              Universe
            </h1>
            <p className="text-[#828A9F] text-[15px] md:text-[17px] font-medium">
              The lore, locations, and rules of your world.
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 px-5 py-3 rounded-full bg-[#535CE8] text-white hover:bg-[#6069F0] transition-colors font-semibold text-[14px] shadow-lg shadow-[#535CE8]/20">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            New Entry
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#828A9F]" />
            <input 
              type="text" 
              placeholder="Search lore, places, or history..." 
              className="w-full h-12 md:h-14 bg-[#171926] border border-white/5 focus:border-[#535CE8]/50 rounded-[20px] pl-12 pr-4 text-[15px] text-white placeholder:text-[#828A9F] outline-none transition-all"
            />
          </div>
          <button className="flex items-center justify-center h-12 w-12 md:h-14 md:w-14 shrink-0 bg-[#171926] border border-white/5 hover:bg-[#1F2333] rounded-[20px] text-[#828A9F] hover:text-white transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex flex-col gap-10 flex-1 md:min-h-0 md:overflow-y-auto custom-scrollbar md:pr-2">
        
        {/* LOCATIONS SECTION */}
        <section>
          <div className="flex items-center justify-between mb-4 ml-1">
            <h2 className="text-[12px] font-bold tracking-[0.25em] text-[#828A9F] uppercase">
              Realms & Locations
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((item) => (
              <button 
                key={item.id}
                className="group flex items-center justify-between p-4 rounded-[20px] bg-[#171926] border border-white/5 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.bg} ${item.color} transition-colors`}>
                    <item.icon className="h-6 w-6 stroke-[1.5]" />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-semibold text-white mb-0.5 truncate group-hover:text-[#535CE8] transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[13px] text-[#828A9F] font-medium">
                      {item.type}
                    </span>
                  </div>
                </div>
                <MoreVertical className="h-5 w-5 text-[#828A9F] opacity-0 group-hover:opacity-100 transition-opacity hover:text-white" />
              </button>
            ))}
          </div>
        </section>

        {/* LORE & SYSTEMS SECTION */}
        <section>
          <div className="flex items-center justify-between mb-4 ml-1">
            <h2 className="text-[12px] font-bold tracking-[0.25em] text-[#828A9F] uppercase">
              Lore, Rules & Factions
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loreAndSystems.map((item) => (
              <button 
                key={item.id}
                className="group flex items-center justify-between p-4 rounded-[20px] bg-[#171926] border border-white/5 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.bg} ${item.color} transition-colors`}>
                    <item.icon className="h-6 w-6 stroke-[1.5]" />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-semibold text-white mb-0.5 truncate group-hover:text-[#535CE8] transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[13px] text-[#828A9F] font-medium">
                      {item.category} • {item.type}
                    </span>
                  </div>
                </div>
                <MoreVertical className="h-5 w-5 text-[#828A9F] opacity-0 group-hover:opacity-100 transition-opacity hover:text-white" />
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}