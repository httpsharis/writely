"use client";

import { useState } from "react";
import { Book, Users, StickyNote, Plus, Folder, Eye, EyeOff } from "lucide-react";
import type { Document } from "@/redux/features/documents/documentApi";

interface EditorSidebarProps {
  isOpen: boolean;
  chapters: Document[];
  activeChapterId: string | null;
  onSelectChapter: (id: string) => void;
  onCreateChapter: () => void;
  onTogglePublish: (id: string, currentStatus: string) => void;
}

export default function EditorSidebar({ 
  isOpen, 
  chapters, 
  activeChapterId, 
  onSelectChapter, 
  onCreateChapter,
  onTogglePublish
}: EditorSidebarProps) {
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
                <button 
                  onClick={onCreateChapter}
                  className="p-1 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1 px-1">
                  <Folder className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">All Chapters</span>
                </div>
                
                {/* 🟢 DYNAMIC CHAPTER LIST */}
                {chapters.map((chapter) => {
                  const isActive = chapter._id === activeChapterId;
                  const isPublished = chapter.status === "published";

                  return (
                    <div 
                      key={chapter._id}
                      onClick={() => onSelectChapter(chapter._id)}
                      className={`p-3 rounded-xl cursor-pointer transition-all border flex items-center justify-between group ${
                        isActive 
                          ? "bg-primary/10 border-primary/20 shadow-sm" 
                          : "hover:bg-secondary/60 border-transparent"
                      }`}
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className={`text-sm font-medium truncate ${isActive ? "text-primary font-bold" : "text-foreground/80"}`}>
                          {chapter.title || "Untitled Chapter"}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[10px] font-semibold transition-colors ${isActive ? "text-primary/60" : "text-muted-foreground/50 group-hover:text-foreground/70"}`}>
                          {chapter.wordCount?.toLocaleString() || 0}
                        </span>
                        
                        {/* 🟢 INDIVIDUAL CHAPTER PUBLISH TOGGLE */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent selecting the chapter when clicking publish
                            onTogglePublish(chapter._id, chapter.status);
                          }}
                          title={isPublished ? "Unpublish Chapter" : "Publish to Readers"}
                          className={`p-1.5 rounded-md transition-colors ${
                            isPublished 
                              ? "text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20" 
                              : "text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          {isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ... (Keep your Characters and Notes tab UIs here, just map over their respective arrays later) ... */}
        </div>
      </div>
    </div>
  );
}

// Keep SidebarTab component exactly the same
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