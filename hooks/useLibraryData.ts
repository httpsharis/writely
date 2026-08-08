import { useState, useMemo } from "react";
import { useGetDocumentsQuery } from "../redux/features/documents/documentApi";

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

export function useLibraryData() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch only novels using the RTK Query parameters
  const { data, isLoading, error } = useGetDocumentsQuery({ type: "novel" });

  // Safely extract the raw array
  const rawNovels: NovelDocument[] = useMemo(() => {
    return data?.documents || [];
  }, [data]);

  // Handle the client-side search and tab filtering
  const filteredNovels = useMemo(() => {
    return rawNovels.filter((novel) => {
      const matchesTab =
        activeTab === "All" ||
        novel.status?.toLowerCase() === activeTab.toLowerCase();

      const matchesSearch = (novel.title || "Untitled")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [rawNovels, activeTab, searchQuery]);

  return {
    novels: filteredNovels,
    totalCount: rawNovels.length, // Total count before filters are applied
    isLoading,
    error,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
  };
}
