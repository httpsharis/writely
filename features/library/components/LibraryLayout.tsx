"use client";

import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useGetDocumentsQuery } from "@/redux/features/documents/documentApi";

// 🟢 FIX: We now import these from the same feature folder
import { LibraryHeader } from "./LibraryHeader";
import { LibraryControls } from "./LibraryControls";
import { LibraryGrid } from "./LibraryGrid"; // Fixed 'Gird' typo!

export interface NovelDocument {
  _id: string;
  title: string;
  type: string;
  status: string;
  wordCount?: number;
  updatedAt: string;
  coverImage?: string | null;
  likesCount?: number;
  viewsCount?: number;
}

export function LibraryLayout() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useGetDocumentsQuery({ type: "novel" });

  // Client-side filtering AND sorting logic
  const filteredAndSortedNovels = useMemo(() => {
    const novels = data?.documents || [];

    return novels
      .filter((novel: NovelDocument) => {
        const matchesTab = activeTab === "All" || novel.status.toLowerCase() === activeTab.toLowerCase();
        const matchesSearch = novel.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
      })
      .sort((a: NovelDocument, b: NovelDocument) => {
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
      });
  }, [data?.documents, activeTab, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-brand" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <p className="font-serif text-lg text-muted-foreground">Failed to load manuscripts.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-20 animate-in fade-in duration-700">
      {/* Passing the total count of novels to the header */}
      <LibraryHeader totalCount={filteredAndSortedNovels.length} />
      
      <LibraryControls
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      {/* Passing the perfectly filtered and sorted array to the grid */}
      <LibraryGrid projects={filteredAndSortedNovels} />
    </div>
  );
}