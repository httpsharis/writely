"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Search, FileText, Settings, Users, BookOpen, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGlobalSearchQuery } from "@/redux/features/search/searchApi";

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const router = useRouter();

    // 1. Debounce the search input
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // 2. ERROR 1 FIXED: Pass as an object { q: debouncedSearch }
    const { data, isLoading } = useGlobalSearchQuery(
        { q: debouncedSearch }, 
        { skip: debouncedSearch.length < 2 }
    );

    // 3. ERROR 2 FIXED: Safely extract the results array from the data object
    const searchResults = data?.results || [];

    // Listen for the Cmd+K shortcut AND our custom click event
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        const openMenu = () => setOpen(true);

        document.addEventListener("keydown", down);
        window.addEventListener("open-command-palette", openMenu);

        return () => {
            document.removeEventListener("keydown", down);
            window.removeEventListener("open-command-palette", openMenu);
        };
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    if (!open) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-[100] bg-zinc-950/60 dark:bg-black/60 transition-opacity duration-200 animate-in fade-in"
                onClick={() => setOpen(false)}
            />

            <div className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-2xl px-4 animate-in fade-in zoom-in-95 duration-200 transform-gpu">
                <Command
                    className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-background border border-border shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]"
                    loop
                >
                    <div className="flex items-center border-b border-border px-4 py-4">
                        <Search className="mr-3 h-5 w-5 text-foreground/40" />
                        <Command.Input
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                            placeholder="Search documents, characters, or jump to..."
                            className="flex h-6 w-full bg-transparent text-foreground placeholder:text-foreground/40 focus:outline-none text-base font-medium"
                        />
                        <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-sans font-semibold bg-foreground/5 border border-border rounded-md text-foreground/50">
                            ESC
                        </kbd>
                    </div>

                    <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
                        <Command.Empty className="py-12 text-center text-sm font-medium text-foreground/50">
                            {isLoading ? "Searching..." : "No results found for your search."}
                        </Command.Empty>

                        {/* Group: Search Results */}
                        {debouncedSearch.length >= 2 && searchResults.length > 0 && (
                            <Command.Group heading={<div className="px-2 pt-4 pb-2 text-xs font-bold uppercase tracking-wider text-foreground/40">Search Results</div>}>
                                {searchResults.map((result) => (
                                    <Command.Item
                                        key={result._id}
                                        onSelect={() => runCommand(() => router.push(result.type === "novel" ? `/project/${result._id}` : `/project/${result._id}/write`))}
                                        className="group flex cursor-pointer items-center rounded-xl px-3 py-3 text-sm font-medium text-foreground hover:bg-foreground/5 aria-selected:bg-foreground/5 transition-colors"
                                    >
                                        {result.type === "novel" ? (
                                            <BookOpen className="mr-3 h-4 w-4 text-foreground/40 group-hover:text-foreground" />
                                        ) : (
                                            <FileText className="mr-3 h-4 w-4 text-foreground/40 group-hover:text-foreground" />
                                        )}
                                        {result.title}
                                        <span className="ml-auto text-xs text-foreground/40 capitalize">{result.type}</span>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                        {!debouncedSearch && (
                            <>
                                <Command.Group heading={<div className="px-2 py-2 text-xs font-bold uppercase tracking-wider text-foreground/40">Quick Actions</div>}>
                                    <Command.Item
                                        onSelect={() => runCommand(() => router.push('/'))}
                                        className="group flex cursor-pointer items-center rounded-xl px-3 py-3 text-sm font-medium text-foreground hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 aria-selected:bg-indigo-500/10 aria-selected:text-indigo-600 dark:aria-selected:text-indigo-400 transition-colors"
                                    >
                                        <Plus className="mr-3 h-4 w-4" />
                                        Dashboard
                                    </Command.Item>
                                </Command.Group>

                                <Command.Group heading={<div className="px-2 pt-4 pb-2 text-xs font-bold uppercase tracking-wider text-foreground/40">Navigation</div>}>
                                    <Command.Item
                                        onSelect={() => runCommand(() => router.push('/characters'))}
                                        className="group flex cursor-pointer items-center rounded-xl px-3 py-3 text-sm font-medium text-foreground hover:bg-foreground/5 aria-selected:bg-foreground/5 transition-colors"
                                    >
                                        <Users className="mr-3 h-4 w-4 text-foreground/40 group-hover:text-foreground" />
                                        Go to Characters
                                    </Command.Item>
                                    <Command.Item
                                        onSelect={() => runCommand(() => router.push('/settings'))}
                                        className="group flex cursor-pointer items-center rounded-xl px-3 py-3 text-sm font-medium text-foreground hover:bg-foreground/5 aria-selected:bg-foreground/5 transition-colors"
                                    >
                                        <Settings className="mr-3 h-4 w-4 text-foreground/40 group-hover:text-foreground" />
                                        Go to Settings
                                    </Command.Item>
                                </Command.Group>
                            </>
                        )}
                    </Command.List>
                </Command>
            </div>
        </>
    );
}