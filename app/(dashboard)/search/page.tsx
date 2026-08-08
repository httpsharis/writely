"use client";

import { useState, useEffect } from "react";
import { Search, Book, FileText, User, File, Loader2 } from "lucide-react";
import { useGlobalSearchQuery, SearchableEntityType } from "@/redux/features/search/searchApi";
import { useRouter } from "next/navigation";

function SearchResultIcon({ type }: { type: SearchableEntityType }) {
  switch (type) {
    case "novel":
      return <Book className="w-5 h-5 text-indigo-500" />;
    case "chapter":
      return <FileText className="w-5 h-5 text-sky-500" />;
    case "note":
      return <File className="w-5 h-5 text-amber-500" />;
    case "user":
      return <User className="w-5 h-5 text-emerald-500" />;
    default:
      return <File className="w-5 h-5 text-muted-foreground" />;
  }
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce the search input to avoid spamming the API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Execute the search query
  const { data, isLoading, isFetching } = useGlobalSearchQuery(
    { q: debouncedQuery, limit: 20 },
    { skip: debouncedQuery.trim().length === 0 }
  );

  const results = data?.results || [];

  const handleResultClick = (result: any) => {
    if (result.type === "novel" || result.type === "chapter") {
      router.push(`/project/${result._id}/write`);
    } else if (result.type === "user") {
      if (result.slug) {
        router.push(`/author/${result.slug}`);
      }
    } else {
      // Notes or generic
      router.push(`/project/${result._id}/write`); // fallback
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col pt-8 md:pt-12 px-4 md:px-8 pb-32 animate-in fade-in duration-700">
      <header className="mb-8 shrink-0">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-tight mb-6">
          Global Search
        </h1>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across your novels, chapters, characters, and notes..."
            className="w-full bg-secondary/30 border border-border/50 rounded-2xl py-4 pl-12 pr-12 text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-sm text-lg transition-all"
            autoFocus
          />
          {(isLoading || isFetching) && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {debouncedQuery.trim().length === 0 ? (
          <div className="h-40 flex items-center justify-center text-muted-foreground flex-col gap-3">
            <Search className="w-8 h-8 opacity-20" />
            <p className="text-sm font-medium">Type something to start searching...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {results.map((result) => (
              <div
                key={result._id}
                onClick={() => handleResultClick(result)}
                className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-card border border-border/50 hover:bg-secondary/50 hover:border-border transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/50 shrink-0">
                  <SearchResultIcon type={result.type} />
                </div>
                <div className="flex flex-col justify-center min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      {result.type}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {new Date(result.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {result.title}
                  </h3>
                  {result.excerpt && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {result.excerpt}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !isLoading &&
          !isFetching && (
            <div className="h-40 flex items-center justify-center text-muted-foreground flex-col gap-3 animate-in zoom-in-95 duration-300">
              <p className="text-sm font-medium">No results found for "{debouncedQuery}"</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
