"use client";

import { useEffect, useState } from "react";
import { 
  Search, 
  Book, 
  FileText, 
  MoreVertical, 
  Plus, 
  Filter,
  FolderOpen
} from "lucide-react";

export default function LibraryPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  // Placeholder Data
  const projects = [
    { id: 1, title: "The Silent City", type: "Novel", wordCount: "45k words", lastEdited: "2 hrs ago", color: "from-[#535CE8]/20 to-transparent", border: "border-[#535CE8]/30" },
    { id: 2, title: "Echoes of Eternity", type: "Short Story", wordCount: "8k words", lastEdited: "4 days ago", color: "from-[#10B981]/20 to-transparent", border: "border-[#10B981]/30" },
    { id: 3, title: "Untitled Sci-Fi", type: "Draft", wordCount: "0 words", lastEdited: "1 week ago", color: "from-[#828A9F]/20 to-transparent", border: "border-white/10" },
  ];

  const recentLooseFiles = [
    { id: 1, title: "Prologue Idea", type: "Draft", time: "Yesterday" },
    { id: 2, title: "Character Names", type: "Notes", time: "3 days ago" },
    { id: 3, title: "Chapter 1 (Old version)", type: "Archive", time: "Last month" },
  ];

  return (
    // Responsive wrapper with mobile bottom bar clearance
    <div className="max-w-6xl mx-auto flex flex-col h-auto md:h-full w-full animate-in fade-in duration-700 pb-32 md:pb-4 px-4 md:px-8">
      
      {/* HEADER & SEARCH */}
      <header className="shrink-0 mb-8 pt-8 md:pt-12 flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-white mb-2 leading-tight">
              Library
            </h1>
            <p className="text-[#828A9F] text-[15px] md:text-[17px] font-medium">
              All your projects and manuscripts.
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 px-5 py-3 rounded-full bg-[#535CE8] text-white hover:bg-[#6069F0] transition-colors font-semibold text-[14px] shadow-lg shadow-[#535CE8]/20">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            New Project
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#828A9F]" />
            <input 
              type="text" 
              placeholder="Search by title, tag, or content..." 
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
        
        {/* PROJECTS GRID */}
        <section>
          <div className="flex items-center justify-between mb-4 ml-1">
            <h2 className="text-[12px] font-bold tracking-[0.25em] text-[#828A9F] uppercase">
              Active Projects
            </h2>
            <span className="text-[13px] text-[#828A9F] font-medium">{projects.length} files</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {projects.map((project) => (
              <button 
                key={project.id}
                className="group relative flex flex-col justify-between p-5 h-[220px] md:h-[240px] rounded-[24px] bg-[#171926] border border-white/5 hover:border-white/20 transition-all duration-300 text-left overflow-hidden"
              >
                {/* Book Cover Gradient Illusion */}
                <div className={`absolute inset-0 bg-gradient-to-b ${project.color} opacity-50`} />
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-[#171926] border-r ${project.border} z-10`} />

                <div className="relative z-20 flex justify-between w-full">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#292D41]/80 backdrop-blur-sm text-white">
                    <Book className="h-5 w-5 stroke-[1.5]" />
                  </div>
                  <MoreVertical className="h-5 w-5 text-[#828A9F] opacity-0 group-hover:opacity-100 transition-opacity hover:text-white" />
                </div>
                
                <div className="relative z-20 mt-auto">
                  <h4 className="text-[16px] md:text-[18px] font-semibold text-white mb-1.5 leading-tight">
                    {project.title}
                  </h4>
                  <div className="flex flex-col gap-1 text-[13px] text-[#828A9F] font-medium">
                    <span>{project.type} • {project.wordCount}</span>
                    <span>Edited {project.lastEdited}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* LOOSE FILES LIST */}
        <section>
          <div className="flex items-center justify-between mb-4 ml-1">
            <h2 className="text-[12px] font-bold tracking-[0.25em] text-[#828A9F] uppercase">
              Loose Files & Notes
            </h2>
          </div>
          
          <div className="flex flex-col gap-3">
            {recentLooseFiles.map((file) => (
              <button 
                key={file.id}
                className="group flex items-center justify-between p-4 md:p-5 rounded-[20px] bg-[#171926] border border-white/5 hover:bg-[#1F2333] hover:border-white/10 transition-all duration-300 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#292D41] text-[#828A9F] group-hover:text-white transition-colors">
                    <FileText className="h-5 w-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-semibold text-white mb-0.5 group-hover:text-[#535CE8] transition-colors">
                      {file.title}
                    </h4>
                    <span className="text-[13px] text-[#828A9F] font-medium">
                      {file.type}
                    </span>
                  </div>
                </div>
                <span className="text-[13px] text-[#828A9F] font-medium">
                  {file.time}
                </span>
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}   