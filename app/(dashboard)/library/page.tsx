"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, MoreVertical, Clock, Edit2, Trash2, ChevronDown, CheckCircle2 } from "lucide-react";
import { NewProjectModal } from "@/components/dashboard/NewProjectModal";
import { fetchProjects, deleteProject, updateProject, type NovelData } from "@/lib/api-client";
import { Skeleton } from "@/components/shared/Skeleton";

// Helper to map DB status keys to UI display strings
const STATUS_MAP: Record<string, string> = {
  planning: "Planning",
  drafting: "Draft",
  editing: "In Progress",
  completed: "Completed",
};

const STATUS_REVERSE_MAP: Record<string, string> = {
  "Planning": "planning",
  "Draft": "drafting",
  "In Progress": "editing",
  "Completed": "completed",
};

interface ProjectCardProps {
  project: NovelData;
  onDelete: (id: string) => Promise<void>;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
}

function ProjectCard({ project, onDelete, onUpdateStatus }: ProjectCardProps) {
  const router = useRouter();
  const [status, setStatus] = useState(STATUS_MAP[project.status] || "Planning");
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getStatusStyles = (currentStatus: string) => {
    switch (currentStatus) {
      case 'In Progress': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20';
      case 'Draft': return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-indigo-500/20';
      case 'Planning': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20';
      case 'Completed': return 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 ring-emerald-600/20';
      default: return 'bg-foreground/5 text-foreground/70 ring-border';
    }
  };

  const STATUS_OPTIONS = ['Planning', 'Draft', 'In Progress', 'Completed'];

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this project?")) {
      await onDelete(project._id);
    }
  };

  const handleStatusChange = async (newStatusUI: string) => {
    setStatus(newStatusUI);
    setIsStatusMenuOpen(false);
    const dbStatus = STATUS_REVERSE_MAP[newStatusUI];
    if (dbStatus) {
      await onUpdateStatus(project._id, dbStatus);
    }
  };

  const formattedDate = () => {
    try {
      const date = new Date(project.updatedAt);
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="group flex flex-col bg-background border border-border/40 rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 transform-gpu will-change-transform hover:-translate-y-1 hover:border-border/80 relative overflow-hidden">
      {/* TOP HALF: The Visual Cover */}
      <div 
        onClick={() => router.push(`/project/${project._id}`)}
        className={`relative aspect-[4/3] bg-gradient-to-br ${project.coverStyle || 'from-indigo-600/20 to-purple-600/20 border-indigo-500/10'} border-b rounded-t-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer overflow-hidden`}
      >
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors duration-300 z-0" />
        <h2 className="relative z-10 font-serif italic font-bold text-2xl tracking-tight text-zinc-900 dark:text-white drop-shadow-none dark:drop-shadow-md opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 line-clamp-3 px-2">
          {project.title}
        </h2>
      </div>

      {/* BOTTOM HALF: Metadata & Controls */}
      <div className="p-4 flex flex-col gap-3 bg-background rounded-b-2xl relative z-20">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0 flex-1">
            <span 
              onClick={() => router.push(`/project/${project._id}`)}
              className="font-bold text-foreground text-[15px] truncate tracking-tight cursor-pointer hover:text-indigo-500 transition-colors"
            >
              {project.title}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/50 mt-1">
              <Clock className="w-3.5 h-3.5 opacity-70" />
              Edited {formattedDate()}
            </div>
          </div>

          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-1.5 rounded-lg text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-background border border-border rounded-xl shadow-xl z-50 flex flex-col p-1 transform origin-top-right scale-100 animate-in fade-in duration-100">
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push(`/project/${project._id}`);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors w-full text-left"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> View / Edit Details
                  </button>
                  <div className="w-full h-px bg-border/50 my-1" />
                  <button 
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Project
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Status and Stats */}
        <div className="flex items-center justify-between pt-3 mt-1 border-t border-border/40">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsStatusMenuOpen(!isStatusMenuOpen);
              }}
              className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ring-1 inset-ring hover:opacity-80 transition-opacity cursor-pointer ${getStatusStyles(status)}`}
            >
              {status === 'In Progress' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_2s_ease-in-out_infinite]" />}
              {status === 'Draft' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
              {status === 'Planning' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
              {status === 'Completed' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
              {status}
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
            </button>

            {isStatusMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsStatusMenuOpen(false)} />
                <div className="absolute left-0 bottom-full mb-2 w-40 bg-background border border-border rounded-xl shadow-xl z-50 flex flex-col p-1 animate-in slide-in-from-bottom-2 duration-200">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(s);
                      }}
                      className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors w-full text-left"
                    >
                      {s}
                      {status === s && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <span className="text-xs font-bold text-foreground/40">
            {(project.totalWords ?? project.stats?.currentWordCount ?? 0).toLocaleString()} words
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LibraryPage() {
  const [projects, setProjects] = useState<NovelData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await fetchProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setError(err instanceof Error ? err.message : "Failed to load projects.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      // Update local state
      setProjects(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error("Failed to delete project:", err);
      alert("Failed to delete project: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const updated = await updateProject(id, { status: status as any });
      setProjects(prev => prev.map(p => p._id === id ? updated : p));
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update project status: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col animate-in fade-in duration-700">
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={(newProject) => {
          setIsModalOpen(false);
          if (newProject) {
            loadProjects(); // Reload list on successful creation
          }
        }}
      />

      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6 pl-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Library
          </h1>
          <p className="text-sm font-medium text-foreground/50">
            {isLoading ? "Loading projects..." : `${filteredProjects.length} projects in your library.`}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative group flex-1 sm:flex-none">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-foreground/[0.02] border border-border/50 rounded-xl text-sm font-medium text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex cursor-pointer items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-semibold active:scale-95 transition-all shadow-md shadow-indigo-500/20 shrink-0"
          >
            <Plus className="w-4 h-4 border-2 border-white/20 rounded-full p-[1px]" />
            <span className="hidden sm:inline-block">New Project</span>
          </button>
        </div>
      </header>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col border border-border/40 rounded-2xl bg-foreground/[0.01] p-4 gap-4 h-[280px] justify-between">
              <Skeleton className="w-full h-36 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="w-3/4 h-5 rounded" />
                <Skeleton className="w-1/2 h-4 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-2xl text-center bg-foreground/[0.01]">
          <h3 className="text-base font-bold text-foreground/75 mb-1">No projects found</h3>
          <p className="text-sm text-foreground/40 mb-4 max-w-sm">Create a new writing project to get started with your novel.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-all"
          >
            Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              onDelete={handleDeleteProject}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}