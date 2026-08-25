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
    <div className="max-w-[720px] mx-auto px-4 sm:px-8 py-8 sm:py-12 md:py-16 flex flex-col">
      
      {/* Header Area */}
      <div className="flex items-start justify-between mb-8 sm:mb-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-[32px] font-serif font-semibold tracking-tight text-foreground leading-none">
            World Codex
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Encyclopedia of locations, factions, lore, and magic systems.
          </p>
        </div>
        
        {/* Action Button */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-border text-foreground hover:border-brand hover:text-brand transition-colors bg-card shadow-sm shrink-0 cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
          New Entry
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input 
          type="text"
          placeholder="Search the codex..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-secondary/30 border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand transition-colors"
        />
      </div>

      {/* Editorial Tabs */}
      <div className="flex items-center gap-6 sm:gap-8 border-b border-border mb-4 overflow-x-auto no-scrollbar">
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
            className={`pb-3 text-xs uppercase tracking-[0.1em] font-bold transition-colors relative flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === tab.name 
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon && <tab.icon className="w-3.5 h-3.5 mb-0.5" />}
            {tab.name}
            {activeTab === tab.name && (
              <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-brand" />
            )}
          </button>
        ))}
      </div>

      {/* Codex List */}
      <div className="flex flex-col">
        {filteredEntries.map((entry) => (
          <div 
            key={entry.id}
            className="group flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 py-6 border-b border-border hover:bg-secondary/30 transition-colors cursor-pointer -mx-4 sm:-mx-6 px-4 sm:px-6 rounded-2xl"
          >
            
            {/* Thumbnail */}
            {entry.imageUrl ? (
              <div className="relative w-full sm:w-[96px] h-[120px] sm:h-[96px] rounded-xl overflow-hidden border border-border shrink-0 bg-secondary/20">
                <Image 
                  src={entry.imageUrl} 
                  alt={entry.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 96px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="w-full sm:w-[96px] h-[120px] sm:h-[96px] rounded-xl border border-dashed border-border bg-secondary/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-muted-foreground/40" />
              </div>
            )}

            {/* Content Area */}
            <div className="flex flex-col flex-1 justify-center min-w-0">
              
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] uppercase tracking-[0.15em] text-brand font-bold">
                  {entry.type}
                </span>
                <span className="w-1 h-1 rounded-full bg-border"></span>
                <span className="text-[11px] font-serif italic text-muted-foreground">
                  {entry.category}
                </span>
              </div>
              
              <h3 className="text-lg font-serif font-semibold tracking-tight text-foreground mb-1.5 truncate group-hover:text-brand transition-colors">
                {entry.name}
              </h3>
              
              <p className="text-xs sm:text-[13.5px] leading-relaxed text-muted-foreground line-clamp-2">
                {entry.snippet}
              </p>
            </div>

          </div>
        ))}

        {filteredEntries.length === 0 && (
          <div className="py-12 text-center flex flex-col items-center">
            <span className="text-xs text-muted-foreground font-serif italic">No entries found in this category.</span>
          </div>
        )}
      </div>

    </div>
  );
}