"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Search, FileText, Settings, Users, BookOpen, Sparkles, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    // Listen for the Cmd+K / Ctrl+K shortcut globally
    // Listen for the Cmd+K shortcut AND our custom click event
    useEffect(() => {
        // 1. Keyboard Shortcut Listener
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        // 2. Custom Click Listener (For the Navbar button)
        const openMenu = () => setOpen(true);

        document.addEventListener("keydown", down);
        window.addEventListener("open-command-palette", openMenu); // Add this

        return () => {
            document.removeEventListener("keydown", down);
            window.removeEventListener("open-command-palette", openMenu); // Add this
        };
    }, []);

    // Helper to handle navigation and closing the palette
    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    if (!open) return null;

    return (
        <>
            {/* 1. Darken the background */}
            <div
                className="fixed inset-0 z-[100] bg-zinc-950/60 dark:bg-black/60 transition-opacity duration-200 will-change-opacity animate-in fade-in"
                onClick={() => setOpen(false)}
            />

            {/* 2. The Command Palette Window */}
            <div className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-2xl px-4 animate-in fade-in zoom-in-95 duration-200 transform-gpu will-change-transform">
                <Command
                    className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-background border border-border shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]"
                    loop
                >
                    {/* Search Input Area */}
                    <div className="flex items-center border-b border-border px-4 py-4">
                        <Search className="mr-3 h-5 w-5 text-foreground/40" />
                        <Command.Input
                            placeholder="Search documents, characters, or jump to..."
                            className="flex h-6 w-full bg-transparent text-foreground placeholder:text-foreground/40 focus:outline-none text-base font-medium"
                        />
                        {/* ESC Badge */}
                        <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-sans font-semibold bg-foreground/5 border border-border rounded-md text-foreground/50">
                            ESC
                        </kbd>
                    </div>

                    {/* Results Area */}
                    <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
                        <Command.Empty className="py-12 text-center text-sm font-medium text-foreground/50">
                            No results found for your search.
                        </Command.Empty>

                        {/* Group: Quick Actions */}
                        <Command.Group heading={<div className="px-2 py-2 text-xs font-bold uppercase tracking-wider text-foreground/40">Quick Actions</div>}>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push('/write'))}
                                className="group flex cursor-pointer items-center rounded-xl px-3 py-3 text-sm font-medium text-foreground hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 aria-selected:bg-indigo-500/10 aria-selected:text-indigo-600 dark:aria-selected:text-indigo-400 transition-colors"
                            >
                                <Plus className="mr-3 h-4 w-4" />
                                Create New Project
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push('/brainstorm'))}
                                className="group flex cursor-pointer items-center rounded-xl px-3 py-3 text-sm font-medium text-foreground hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 aria-selected:bg-purple-500/10 aria-selected:text-purple-600 dark:aria-selected:text-purple-400 transition-colors"
                            >
                                <Sparkles className="mr-3 h-4 w-4" />
                                Ask AI Brainstorm
                            </Command.Item>
                        </Command.Group>

                        {/* Group: Recent Projects */}
                        <Command.Group heading={<div className="px-2 pt-4 pb-2 text-xs font-bold uppercase tracking-wider text-foreground/40">Recent Projects</div>}>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push('/write'))}
                                className="group flex cursor-pointer items-center rounded-xl px-3 py-3 text-sm font-medium text-foreground hover:bg-foreground/5 aria-selected:bg-foreground/5 transition-colors"
                            >
                                <BookOpen className="mr-3 h-4 w-4 text-foreground/40 group-hover:text-foreground" />
                                The Obsidian Crown
                                <span className="ml-auto text-xs text-foreground/40">Project</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push('/write'))}
                                className="group flex cursor-pointer items-center rounded-xl px-3 py-3 text-sm font-medium text-foreground hover:bg-foreground/5 aria-selected:bg-foreground/5 transition-colors"
                            >
                                <FileText className="mr-3 h-4 w-4 text-foreground/40 group-hover:text-foreground" />
                                Chapter 4: The Silent City
                                <span className="ml-auto text-xs text-foreground/40">Document</span>
                            </Command.Item>
                        </Command.Group>

                        {/* Group: Navigation */}
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

                    </Command.List>
                </Command>
            </div>
        </>
    );
}