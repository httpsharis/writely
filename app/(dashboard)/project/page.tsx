"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Clock,
  FileText,
  MoreVertical,
  Filter,
  Image as ImageIcon,
} from "lucide-react";

// --- MOCK DATA ---
const MOCK_PROJECTS = [
  {
    id: "1",
    title: "The Silent City",
    type: "Web Novel",
    status: "Drafting",
    wordCount: 285400,
    updatedAt: "2h ago",
    // We will use a real image URL later, but here is a placeholder for now
    cover:
      "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Echoes of Eternity",
    type: "Short Story",
    status: "Editing",
    wordCount: 7500,
    updatedAt: "3d ago",
    cover: null, // We will handle missing covers gracefully
  },
  {
    id: "3",
    title: "Neon Gods",
    type: "Novel",
    status: "Planning",
    wordCount: 0,
    updatedAt: "1w ago",
    cover:
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200&auto=format&fit=crop",
  },
];

// --- MAIN PAGE COMPONENT ---
export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full w-full animate-in fade-in duration-700 pb-32 md:pb-12 px-4 md:px-8 pt-6 md:pt-10 no-scrollbar">
      <ProjectsHeader />
      <ProjectsControls activeTab={activeTab} setActiveTab={setActiveTab} />
      <ProjectsGrid />
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ProjectsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          My Projects
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your novels, short stories, and drafts.
        </p>
      </div>

      <Link
        href="/project/new"
        className="flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-semibold shadow-lg shadow-primary/20 shrink-0"
      >
        <Plus className="w-5 h-5" />
        <span>New Project</span>
      </Link>
    </div>
  );
}

function ProjectsControls({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const tabs = ["All", "Planning", "Drafting", "Editing", "Completed"];

  return (
    // 🟢 Fix: This row now splits the Search and Tabs across the entire screen on desktop
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
      {/* Search Bar - Fixed to a reasonable width on desktop */}
      <div className="flex items-center gap-3 w-full lg:max-w-sm">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-full text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
          />
        </div>

        {/* Mobile Filter Button */}
        <button className="lg:hidden flex shrink-0 items-center justify-center h-[42px] w-[42px] rounded-full bg-card border border-border text-foreground shadow-sm active:scale-95 transition-transform">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs - Aligned to the right on desktop */}
      <div className="flex w-full lg:w-auto overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:pb-0">
        <div className="flex bg-card/50 border border-border p-1 rounded-full shadow-sm w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-secondary text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
      {MOCK_PROJECTS.map((project) => (
        // 🟢 Changed from <div> to <Link> and added the dynamic href
        <Link 
          href={`/project/${project.id}`}
          key={project.id} 
          className="group flex gap-4 p-4 md:p-5 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-300 shadow-sm cursor-pointer"
        >
          
          {/* Book Cover Image */}
          <div className="relative w-20 h-28 md:w-24 md:h-36 shrink-0 rounded-xl overflow-hidden bg-secondary border border-border/50 flex flex-col items-center justify-center group-hover:shadow-md transition-all">
            {project.cover ? (
              <Image 
                src={project.cover} 
                alt={project.title} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <ImageIcon className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">No Cover</span>
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex flex-col flex-1 justify-between min-w-0">
            <div>
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-bold text-foreground truncate pr-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                {/* We add e.preventDefault() here so clicking the options button doesn't trigger the Link */}
                <button 
                  onClick={(e) => e.preventDefault()}
                  className="p-1.5 -mr-2 -mt-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
                >
                  <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {project.type}
              </p>
            </div>

            <div className="mt-2">
              <span className="px-2.5 py-1 rounded-md bg-secondary text-foreground text-[10px] font-bold uppercase tracking-wider">
                {project.status}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <FileText className="w-3.5 h-3.5" />
                {project.wordCount.toLocaleString()} words
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground ml-auto">
                <Clock className="w-3.5 h-3.5" />
                {project.updatedAt}
              </div>
            </div>
          </div>

        </Link>
      ))}
    </div>
  );
}