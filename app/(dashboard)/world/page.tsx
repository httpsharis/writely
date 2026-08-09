"use client";

import { useState } from "react";
import { Search, Plus, Map, Shield, Sparkles, BookOpen } from "lucide-react";
import Image from "next/image";

// ==========================================
// MOCK DATA
// ==========================================
const WORLD_ENTRIES = [
  { 
    id: "1", 
    name: "The Glass Citadel", 
    category: "Locations", 
    type: "Capital City", 
    snippet: "A sprawling metropolis built from ancient translucent stone. Seat of the High Council and the wealthiest district in the realm.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&h=400&q=80"
  },
  { 
    id: "2", 
    name: "Shadow Weaving", 
    category: "Magic", 
    type: "Forbidden Art", 
    snippet: "The ability to manipulate ambient darkness into physical constructs. Outlawed by the High Council fifty years ago.",
    imageUrl: null
  },
  { 
    id: "3", 
    name: "The Syndicate", 
    category: "Factions", 
    type: "Underworld Guild", 
    snippet: "A ruthless organization controlling the black market in the lower rings. They hold a monopoly on smuggled arcane artifacts.",
    imageUrl: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=400&h=400&q=80"
  },
  { 
    id: "4", 
    name: "The Breaking", 
    category: "Lore", 
    type: "Historical Event", 
    snippet: "The cataclysmic war that shattered the old continent, leading to the rise of the Citadel and the suppression of the Old Gods.",
    imageUrl: null
  },
];

export default function WorldPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter logic
  const filteredEntries = WORLD_ENTRIES.filter(entry => {
    const matchesTab = activeTab === "All" || entry.category === activeTab;
    const matchesSearch = entry.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-[720px] mx-auto px-8 py-12 md:py-16 flex flex-col">
      
      {/* Header Area */}
      <div className="flex items-start justify-between mb-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] font-semibold tracking-tight text-[#1A1008] dark:text-[#F0EBE4] leading-none">
            World Codex
          </h1>
          <p className="text-[14px] text-[#9C8870] dark:text-[#5C5652]">
            Encyclopedia of locations, factions, lore, and magic systems.
          </p>
        </div>
        
        {/* Outline Button matching your spec */}
        <button className="flex items-center gap-2 px-4 py-1.5 rounded-md text-[12px] font-medium border border-[#E8E0D5] dark:border-[#242424] text-[#1A1008] dark:text-[#F0EBE4] hover:border-[#C8973F] dark:hover:border-[#C8973F] transition-colors bg-transparent shrink-0">
          <Plus className="w-3.5 h-3.5" />
          New Entry
        </button>
      </div>

      {/* Search Bar (Minimalist) */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C8870] dark:text-[#5C5652]" />
        <input 
          type="text"
          placeholder="Search the codex..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border border-[#E8E0D5] dark:border-[#242424] rounded-xl pl-11 pr-4 py-3 text-[13px] text-[#1A1008] dark:text-[#F0EBE4] placeholder:text-[#9C8870] dark:placeholder:text-[#5C5652] focus:outline-none focus:border-[#C8973F] dark:focus:border-[#C8973F] transition-colors"
        />
      </div>

      {/* Editorial Tabs */}
      <div className="flex items-center gap-8 border-b border-[#E8E0D5] dark:border-[#242424] mb-4 overflow-x-auto no-scrollbar">
        {[
          { name: "All", icon: null },
          { name: "Locations", icon: Map },
          { name: "Factions", icon: Shield },
          { name: "Magic", icon: Sparkles },
          { name: "Lore", icon: BookOpen }
        ].map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`pb-3 text-[12px] uppercase tracking-[0.1em] font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.name 
                ? "text-[#1A1008] dark:text-[#F0EBE4]" 
                : "text-[#9C8870] dark:text-[#5C5652] hover:text-[#1A1008] dark:hover:text-[#F0EBE4]"
            }`}
          >
            {tab.icon && <tab.icon className="w-3.5 h-3.5 mb-0.5" />}
            {tab.name}
            {activeTab === tab.name && (
              <div className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-[#1A1008] dark:bg-[#F0EBE4]" />
            )}
          </button>
        ))}
      </div>

      {/* Codex List */}
      <div className="flex flex-col">
        {filteredEntries.map((entry) => (
          <div 
            key={entry.id}
            className="group flex flex-col sm:flex-row sm:items-center gap-6 py-6 border-b border-[#E8E0D5] dark:border-[#242424] hover:bg-[#1A1008]/[0.02] dark:hover:bg-[#F0EBE4]/[0.02] transition-colors cursor-pointer -mx-6 px-6 rounded-xl"
          >
            
            {/* Thumbnail (Optional based on data) */}
            {entry.imageUrl ? (
              <Image 
                src={entry.imageUrl} 
                alt={entry.name}
                width={400}
                height={400}
                // Rectangular aspect ratio for world elements (locations, artifacts) looks more serious than circles
                className="w-full sm:w-[96px] h-[120px] sm:h-[96px] rounded-lg object-cover border border-[#E8E0D5] dark:border-[#242424] shrink-0"
              />
            ) : (
              // Empty state placeholder
              <div className="w-full sm:w-[96px] h-[120px] sm:h-[96px] rounded-lg border border-dashed border-[#E8E0D5] dark:border-[#242424] bg-transparent flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-[#9C8870]/30 dark:text-[#5C5652]/30" />
              </div>
            )}

            {/* Content Area */}
            <div className="flex flex-col flex-1 justify-center min-w-0">
              
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#C8973F] font-bold">
                  {entry.type}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#E8E0D5] dark:bg-[#242424]"></span>
                <span className="text-[11px] font-serif italic text-[#9C8870] dark:text-[#5C5652]">
                  {entry.category}
                </span>
              </div>
              
              <h3 className="text-[20px] font-semibold tracking-tight text-[#1A1008] dark:text-[#F0EBE4] mb-2 truncate group-hover:text-[#C8973F] transition-colors">
                {entry.name}
              </h3>
              
              <p className="text-[13.5px] leading-relaxed text-[#9C8870] dark:text-[#5C5652] line-clamp-2">
                {entry.snippet}
              </p>
            </div>

          </div>
        ))}

        {filteredEntries.length === 0 && (
          <div className="py-12 text-center flex flex-col items-center">
            <span className="text-[13px] text-[#9C8870] dark:text-[#5C5652]">No entries found in this category.</span>
          </div>
        )}
      </div>

    </div>
  );
}