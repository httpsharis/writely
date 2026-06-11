"use client";

import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useGetDocumentsQuery } from "@/redux/features/documents/documentApi";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { LibraryControls } from "@/components/library/LibraryControls";
import { LibraryGrid } from "../../../components/library/LibraryGird";

// Strict typing for your document data
export interface NovelDocument {
  _id: string;
  title: string;
  type: string;
  status: string;
  wordCount?: number;
  updatedAt: string;
  coverImage?: string | null;
}

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch real data from your backend
  const { data, isLoading, error } = useGetDocumentsQuery({ type: "novel" });

  // Client-side filtering logic
  const novels = useMemo(() => {
    return data?.documents || [];
  }, [data]); // Only recalculate when the RTK Query 'data' changes

  const filteredNovels = useMemo(() => {
    return novels.filter((novel) => {
      const matchesTab =
        activeTab === "All" ||
        novel.status.toLowerCase() === activeTab.toLowerCase();
      const matchesSearch = novel.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [novels, activeTab, searchQuery]); // 'novels' is now a stable dependency

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <p className="font-serif text-lg text-muted-foreground">
          Failed to load manuscripts.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:px-12 md:py-20 animate-in fade-in duration-700">
      <LibraryHeader totalCount={novels.length} />
      <LibraryControls
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <LibraryGrid projects={filteredNovels} />
    </div>
  );
}
