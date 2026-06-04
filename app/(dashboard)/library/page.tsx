"use client";

import { useState } from "react";
import { Plus, Search, BookOpen, Clock, FileText, MoreVertical, Filter } from "lucide-react";

// --- MOCK DATA ---
const MOCK_PROJECTS = [
  { id: "1", title: "The Silent City", type: "Web Novel", status: "Drafting", wordCount: 285400, updatedAt: "2 hours ago" },
  { id: "2", title: "Echoes of Eternity", type: "Short Story", status: "Editing", wordCount: 7500, updatedAt: "3 days ago" },
  { id: "3", title: "Neon Gods", type: "Novel", status: "Planning", wordCount: 0, updatedAt: "1 week ago" },
];

// --- MAIN PAGE COMPONENT ---
export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-full w-full animate-in fade-in duration-700 pb-32 md:pb-12 px-4 md:px-8 pt-6 md:pt-10 no-scrollbar">
      <ProjectsHeader />
      <ProjectsControls activeTab={activeTab} setActiveTab={setActiveTab} />
      <ProjectsGrid />
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ProjectsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">My Projects</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your novels, short stories, and drafts.</p>
      </div>
      
      <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-semibold shadow-lg shadow-primary/20 shrink-0">
        <Plus className="w-5 h-5" />
        <span>New Project</span>
      </button>
    </div>
  );
}

function ProjectsControls({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const tabs = ["All", "Planning", "Drafting", "Editing", "Completed"];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      
      {/* Search Bar */}
      <div className="relative w-full md:max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input 
          type="text" 
          placeholder="Search projects..." 
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-full text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
        />
      </div>

      {/* Desktop Tabs & Mobile Filter Button */}
      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto overflow-x-auto no-scrollbar">
        <div className="hidden md:flex bg-card border border-border p-1 rounded-full shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab 
                  ? "bg-secondary text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Mobile only filter icon */}
        <button className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border text-sm font-semibold text-foreground shadow-sm">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>
    </div>
  );
}

function ProjectsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MOCK_PROJECTS.map((project) => (
        <div 
          key={project.id} 
          className="group relative flex flex-col justify-between p-6 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-300 shadow-sm cursor-pointer min-h-[200px]"
        >
          {/* Top Row: Title & Options */}
          <div className="flex justify-between items-start mb-4">
            <div className="pr-8">
              <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                {project.title}
              </h3>
              <p className="text-sm font-medium text-muted-foreground">
                {project.type}
              </p>
            </div>
            
            <button className="absolute top-6 right-6 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="mb-6">
            <span className="px-3 py-1.5 rounded-md bg-secondary text-foreground text-xs font-bold uppercase tracking-wider">
              {project.status}
            </span>
          </div>
          
          {/* Bottom Row: Metrics */}
          <div className="flex items-center gap-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <FileText className="w-4 h-4" />
              {project.wordCount.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground ml-auto">
              <Clock className="w-4 h-4" />
              {project.updatedAt}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}