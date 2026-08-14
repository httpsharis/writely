"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Book, FileText, User, File, Loader2, ArrowRight } from "lucide-react";
import { useGlobalSearchQuery, type SearchableEntityType, type GlobalSearchResult } from "@/redux/features/search/searchApi";

type SearchResponseWrapper = {
  results?: GlobalSearchResult[];
  data?: GlobalSearchResult[];
  documents?: GlobalSearchResult[];
  characters?: GlobalSearchResult[];
  notes?: GlobalSearchResult[];
};

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading, isFetching } = useGlobalSearchQuery(
    { q: debouncedQuery, limit: 20 },
    { skip: debouncedQuery.trim().length === 0 }
  );

  // 🟢 LINT FIX: Strictly typed defensive unwrapping
  const results: GlobalSearchResult[] = useMemo(() => {
    if (!data) return [];

    // Using a safe type assertion instead of 'any'
    const raw = data as SearchResponseWrapper | GlobalSearchResult[];

    if (Array.isArray(raw)) return raw;

    const categorized = raw as SearchResponseWrapper;
    if (categorized.results && Array.isArray(categorized.results)) return categorized.results;
    if (categorized.data && Array.isArray(categorized.data)) return categorized.data;

    return [
      ...(categorized.documents || []),
      ...(categorized.characters || []),
      ...(categorized.notes || [])
    ];
  }, [data]);

  const handleResultClick = (result: GlobalSearchResult) => {
    if (result.type === "user" && result.slug) return router.push(`/author/${result.slug}`);
    router.push(`/project/${result._id}${result.type === "chapter" ? "/write" : ""}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto h-full flex flex-col pt-8 md:pt-16 px-6 pb-32 animate-in fade-in duration-700">
      <header className="mb-10 shrink-0">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-tight mb-8">
          Global Search
        </h1>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-brand transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search novels, chapters, lore, characters..."
            className="w-full bg-secondary/20 border border-border/50 rounded-2xl py-4 pl-14 pr-12 text-foreground focus:outline-none focus:border-brand/50 focus:bg-secondary/40 transition-all font-medium text-lg placeholder:text-muted-foreground/50"
            autoFocus
          />
          {(isLoading || isFetching) && (
            <div className="absolute inset-y-0 right-0 pr-5 flex items-center">
              <Loader2 className="w-5 h-5 animate-spin text-brand" />
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {debouncedQuery.trim().length === 0 ? (
          <EmptyState icon={<Search className="w-8 h-8 opacity-20" />} text="Type something to search your workspace." />
        ) : results.length > 0 ? (
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {results.map((result) => (
              <ResultCard key={result._id} result={result} onClick={() => handleResultClick(result)} />
            ))}
          </div>
        ) : (!isLoading && !isFetching) ? (
          <EmptyState text={`No results found for "${debouncedQuery}"`} />
        ) : null}
      </div>
    </div>
  );
}

/* --- MICRO-COMPONENTS --- */

function ResultCard({ result, onClick }: { result: GlobalSearchResult; onClick: () => void }) {
  const { icon, color } = getResultTheme(result.type);

  return (
    <div
      onClick={onClick}
      className="group flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-transparent border border-transparent hover:bg-secondary/20 hover:border-border/50 transition-all cursor-pointer items-start sm:items-center"
    >
      <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/30 shrink-0 border-l-2 transition-colors ${color}`}>
        {icon}
      </div>

      <div className="flex flex-col justify-center min-w-0 flex-1">
        <h3 className="text-base font-bold text-foreground group-hover:text-brand transition-colors truncate">
          {result.title || "Untitled"}
        </h3>
        {result.excerpt && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
            {result.excerpt}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4 sm:ml-auto w-full sm:w-auto justify-between sm:justify-end shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-md">
            {result.type}
          </span>
          <span className="text-xs font-['JetBrains_Mono'] text-muted-foreground hidden sm:block">
            {new Date(result.updatedAt).toLocaleDateString()}
          </span>
        </div>
        <ArrowRight className="w-4 h-4 text-brand opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </div>
    </div>
  );
}

function EmptyState({ icon, text }: { icon?: React.ReactNode; text: string }) {
  return (
    <div className="h-40 flex items-center justify-center text-muted-foreground flex-col gap-4">
      {icon}
      <p className="text-sm font-medium font-serif italic">{text}</p>
    </div>
  );
}

function getResultTheme(type: SearchableEntityType) {
  switch (type) {
    case "novel": return { icon: <Book className="w-5 h-5" />, color: "border-indigo-500 text-indigo-400" };
    case "chapter": return { icon: <FileText className="w-5 h-5" />, color: "border-sky-500 text-sky-400" };
    case "note": return { icon: <File className="w-5 h-5" />, color: "border-amber-500 text-amber-400" };
    case "user": return { icon: <User className="w-5 h-5" />, color: "border-emerald-500 text-emerald-400" };
    default: return { icon: <File className="w-5 h-5" />, color: "border-muted-foreground text-muted-foreground" };
  }
}