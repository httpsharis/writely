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
  Loader2,
} from "lucide-react";
import { useGetDocumentsQuery } from "@/redux/features/documents/documentApi";
import type { Document } from "@/redux/features/documents/documentApi";

// Map backend status to display labels and tab filter values
const STATUS_LABEL: Record<string, string> = {
  draft: "Drafting",
  published: "Published",
  archived: "Archived",
};

const TABS = ["All", "Drafting", "Published", "Archived"];

// Convert ISO date to a relative string ("2h ago", "3d ago")
function relativeTime(dateString: string): string {
  const now = Date.now();
  const diff = now - new Date(dateString).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useGetDocumentsQuery();

  const documents: Document[] = data?.documents ?? [];

  // Filter by search and active tab
  const filtered = documents.filter((doc) => {
    if (!doc.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeTab === "All") return true;
    const label = STATUS_LABEL[doc.status] ?? doc.status;
    return label === activeTab;
  });

  if (error) {
    return (
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Failed to load projects.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full w-full animate-in fade-in duration-700 pb-32 md:pb-12 px-4 md:px-8 pt-6 md:pt-10 no-scrollbar">
      <ProjectsHeader />
      <ProjectsControls
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        search={search}
        setSearch={setSearch}
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ProjectsGrid documents={filtered} />
      )}
    </div>
  );
}

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
  search,
  setSearch,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  search: string;
  setSearch: (val: string) => void;
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3 w-full lg:max-w-sm">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-full text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
          />
        </div>

        <button className="lg:hidden flex shrink-0 items-center justify-center h-[42px] w-[42px] rounded-full bg-card border border-border text-foreground shadow-sm active:scale-95 transition-transform">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      <div className="flex w-full lg:w-auto overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:pb-0">
        <div className="flex bg-card/50 border border-border p-1 rounded-full shadow-sm w-max">
          {TABS.map((tab) => (
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

function ProjectsGrid({ documents }: { documents: Document[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
      {documents.map((project) => {
        const label = STATUS_LABEL[project.status] ?? project.status;
        return (
          <Link
            href={`/project/${project._id}`}
            key={project._id}
            className="group flex gap-4 p-4 md:p-5 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-300 shadow-sm cursor-pointer"
          >
            <div className="relative w-20 h-28 md:w-24 md:h-36 shrink-0 rounded-xl overflow-hidden bg-secondary border border-border/50 flex flex-col items-center justify-center group-hover:shadow-md transition-all">
              {project.coverImage ? (
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground opacity-50">
                  <ImageIcon className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">
                    No Cover
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col flex-1 justify-between min-w-0">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold text-foreground truncate pr-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="p-1.5 -mr-2 -mt-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
                  >
                    <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Novel
                </p>
              </div>

              <div className="mt-2">
                <span className="px-2.5 py-1 rounded-md bg-secondary text-foreground text-[10px] font-bold uppercase tracking-wider">
                  {label}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <FileText className="w-3.5 h-3.5" />
                  {(project.wordCount ?? 0).toLocaleString()} words
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground ml-auto">
                  <Clock className="w-3.5 h-3.5" />
                  {project.updatedAt ? relativeTime(project.updatedAt) : "—"}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
