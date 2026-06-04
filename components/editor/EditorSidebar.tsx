"use client";

import { useState } from "react";
import { Book, Users, StickyNote, Plus, User, FileText, Folder } from "lucide-react";

export default function EditorSidebar({ isOpen }: { isOpen: boolean }) {
  const [activeTab, setActiveTab] = useState("chapters");

  return (
    <div 
      className={`border-l border-border bg-card/20 h-full shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? "w-80 border-l" : "w-0 border-l-0"
      }`}
    >
      <div className="w-80 h-full flex flex-col">
        
        {/* Tabs */}
        <div className="flex items-center justify-between p-2 border-b border-border/50 bg-card/30">
          <SidebarTab icon={<Book className="w-4 h-4" />} label="Chapters" isActive={activeTab === "chapters"} onClick={() => setActiveTab("chapters")} />
          <SidebarTab icon={<Users className="w-4 h-4" />} label="Cast" isActive={activeTab === "characters"} onClick={() => setActiveTab("characters")} />
          <SidebarTab icon={<StickyNote className="w-4 h-4" />} label="Notes" isActive={activeTab === "notes"} onClick={() => setActiveTab("notes")} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
          
          {activeTab === "chapters" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Manuscript</h3>
                <button className="p-1 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <Folder className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Act 1: The Fall</span>
                </div>
                
                {/* 🟢 NEW: Added flex, justify-between, and the tiny word counts */}
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 cursor-pointer shadow-sm flex items-center justify-between group">
                  <span className="text-sm font-bold text-primary truncate pr-2">Chapter 3: Shadows</span>
                  <span className="text-[10px] font-bold text-primary/60 shrink-0 group-hover:text-primary transition-colors">2,450</span>
                </div>
                
                <div className="p-3 rounded-xl hover:bg-secondary/60 cursor-pointer transition-colors border border-transparent flex items-center justify-between group">
                  <span className="text-sm font-medium text-foreground/80 truncate pr-2">Chapter 2: City of Glass</span>
                  <span className="text-[10px] font-semibold text-muted-foreground/50 shrink-0 group-hover:text-foreground/70 transition-colors">3,120</span>
                </div>
                
                <div className="p-3 rounded-xl hover:bg-secondary/60 cursor-pointer transition-colors border border-transparent flex items-center justify-between group">
                  <span className="text-sm font-medium text-foreground/80 truncate pr-2">Chapter 1: The Awakening</span>
                  <span className="text-[10px] font-semibold text-muted-foreground/50 shrink-0 group-hover:text-foreground/70 transition-colors">4,052</span>
                </div>

              </div>
            </div>
          )}

          {activeTab === "characters" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Cast</h3>
                <button className="p-1 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="p-3 rounded-xl border border-border bg-card/50 cursor-pointer hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-foreground block">Aria Vance</span>
                      <span className="text-[10px] uppercase tracking-wider text-primary font-bold">Protagonist</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">Uses shadow magic. Has a secret past with the old gods.</p>
                </div>

                <div className="p-3 rounded-xl border border-border bg-card/50 cursor-pointer hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-foreground block">Kaelen</span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Antagonist</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">Leader of the Glass Citadel. Wants to steal Aria magic.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">World Notes</h3>
                <button className="p-1 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors"><Plus className="w-4 h-4" /></button>
              </div>

              <div className="flex flex-col gap-3">
                <div className="p-3 rounded-xl border border-border bg-card/50 cursor-pointer hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">The Glass Citadel</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">Main setting. Built by the old gods using crystal magic.</p>
                  <div className="mt-2 flex gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-secondary text-[9px] font-bold uppercase text-muted-foreground">Location</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function SidebarTab({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all ${
        isActive ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}