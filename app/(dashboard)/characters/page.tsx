"use client";

import { useEffect, useState } from "react";
import { 
  Search, 
  Plus, 
  Filter,
  MoreVertical,
  User,
  Swords,
  Crown,
  Sparkles
} from "lucide-react";

export default function CharactersPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  // Placeholder Data
  const characters = [
    { 
      id: 1, 
      name: "Arthur Pendragon", 
      role: "Protagonist", 
      archetype: "Reluctant Hero",
      lastEdited: "2 hrs ago", 
      icon: Crown,
      color: "text-[#535CE8]", 
      bg: "bg-[#535CE8]/10",
      border: "border-[#535CE8]/20"
    },
    { 
      id: 2, 
      name: "Morgana Le Fay", 
      role: "Antagonist", 
      archetype: "Fallen Scholar",
      lastEdited: "Yesterday", 
      icon: Swords,
      color: "text-[#F59E0B]", 
      bg: "bg-[#F59E0B]/10",
      border: "border-[#F59E0B]/20"
    },
    { 
      id: 3, 
      name: "Merlin", 
      role: "Mentor", 
      archetype: "Archmage",
      lastEdited: "3 days ago", 
      icon: Sparkles,
      color: "text-[#10B981]", 
      bg: "bg-[#10B981]/10",
      border: "border-[#10B981]/20"
    },
    { 
      id: 4, 
      name: "Lancelot", 
      role: "Supporting", 
      archetype: "Loyal Knight",
      lastEdited: "1 week ago", 
      icon: User,
      color: "text-[#828A9F]", 
      bg: "bg-[#828A9F]/10",
      border: "border-[#828A9F]/20"
    },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-auto md:h-full w-full animate-in fade-in duration-700 pb-32 md:pb-4 px-4 md:px-8">
      
      {/* HEADER & SEARCH */}
      <header className="shrink-0 mb-8 pt-8 md:pt-12 flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-white mb-2 leading-tight">
              Characters
            </h1>
            <p className="text-[#828A9F] text-[15px] md:text-[17px] font-medium">
              The cast of your universe.
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 px-5 py-3 rounded-full bg-[#535CE8] text-white hover:bg-[#6069F0] transition-colors font-semibold text-[14px] shadow-lg shadow-[#535CE8]/20">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            New Character
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#828A9F]" />
            <input 
              type="text" 
              placeholder="Search by name, role, or traits..." 
              className="w-full h-12 md:h-14 bg-[#171926] border border-white/5 focus:border-[#535CE8]/50 rounded-[20px] pl-12 pr-4 text-[15px] text-white placeholder:text-[#828A9F] outline-none transition-all"
            />
          </div>
          <button className="flex items-center justify-center h-12 w-12 md:h-14 md:w-14 shrink-0 bg-[#171926] border border-white/5 hover:bg-[#1F2333] rounded-[20px] text-[#828A9F] hover:text-white transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex flex-col gap-8 flex-1 md:min-h-0 md:overflow-y-auto custom-scrollbar md:pr-2">
        
        {/* CHARACTERS GRID */}
        <section>
          <div className="flex items-center justify-between mb-4 ml-1">
            <h2 className="text-[12px] font-bold tracking-[0.25em] text-[#828A9F] uppercase">
              Main Cast
            </h2>
            <span className="text-[13px] text-[#828A9F] font-medium">{characters.length} profiles</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {characters.map((char) => (
              <button 
                key={char.id}
                className="group relative flex flex-col p-5 h-[200px] rounded-[24px] bg-[#171926] border border-white/5 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
              >
                {/* Header of Card: Avatar and Options */}
                <div className="flex justify-between items-start w-full mb-auto">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full border ${char.bg} ${char.color} ${char.border}`}>
                    <span className="text-[16px] font-bold">
                      {char.name.charAt(0)}
                    </span>
                  </div>
                  <MoreVertical className="h-5 w-5 text-[#828A9F] opacity-0 group-hover:opacity-100 transition-opacity hover:text-white" />
                </div>
                
                {/* Body of Card: Name and Details */}
                <div className="w-full">
                  <h4 className="text-[17px] font-semibold text-white mb-2 truncate">
                    {char.name}
                  </h4>
                  
                  {/* Pill Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-[#292D41] text-[#E2E8F0] text-[11px] font-medium uppercase tracking-wide">
                      {char.role}
                    </span>
                    <span className="flex items-center gap-1.5 text-[12px] text-[#828A9F] font-medium">
                      <char.icon className="w-3.5 h-3.5" />
                      {char.archetype}
                    </span>
                  </div>
                  
                  {/* Footer of Card */}
                  <div className="text-[11.5px] text-[#828A9F] font-medium border-t border-white/5 pt-3 mt-1">
                    Last edited {char.lastEdited}
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