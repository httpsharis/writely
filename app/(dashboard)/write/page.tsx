"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
    ChevronLeft, Plus, BookOpen, Columns, BarChart3, Trash2
} from "lucide-react";
import { TailwindEditor } from "@/components/editor/TailwindEditor";
import { useEditorData } from "@/hooks/editor/useEditorData";
import { useChapterActions } from "@/hooks/editor/useChapterActions";
import { useNovelActions } from "@/hooks/editor/useNovelActions";

function WorkspaceContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const projectId = searchParams.get("projectId");
    const initialChapterId = searchParams.get("chapterId");

    // Redirect to library if no projectId is supplied
    useEffect(() => {
        if (!projectId) {
            router.push("/library");
        }
    }, [projectId, router]);

    const { state, setState, refs } = useEditorData(projectId || "");
    const { loadChapter, autoSave, addChapter, removeChapter } = useChapterActions(state, setState, refs);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [localTitle, setLocalTitle] = useState("");

    // Load initial chapter if specified and chapters list is loaded
    useEffect(() => {
        if (initialChapterId && state.chapters.length > 0) {
            loadChapter(initialChapterId);
        }
    }, [initialChapterId, state.chapters.length, loadChapter]);

    // Keep title in sync with active chapter changes
    useEffect(() => {
        setLocalTitle(state.activeChapter?.title || "");
    }, [state.activeChapter?._id, state.activeChapter?.title]);

    if (!projectId) {
        return null;
    }

    if (state.isLoading) {
        return (
            <div className="fixed inset-0 top-16 flex bg-background items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <span className="w-8 h-8 border-4 border-foreground/20 border-t-indigo-500 rounded-full animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/45">Loading Workspace...</span>
                </div>
            </div>
        );
    }

    if (state.error) {
        return (
            <div className="fixed inset-0 top-16 flex bg-background flex-col items-center justify-center p-6 text-center">
                <h3 className="text-lg font-bold text-red-500 mb-2">Error Loading Workspace</h3>
                <p className="text-foreground/50 text-sm mb-4">{state.error}</p>
                <Link href="/library" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all">
                    Return to Library
                </Link>
            </div>
        );
    }

    const activeChapter = state.activeChapter;

    return (
        <div className="fixed inset-0 top-16 bg-background flex animate-in fade-in duration-500 overflow-hidden">
            {/* 1. UNIFIED CONTROL SIDEBAR */}
            <aside className={`h-full border-r border-border/40 bg-foreground/[0.01] flex flex-col transition-all duration-300 shrink-0 ${isSidebarOpen ? "w-64" : "w-0 -translate-x-64"}`}>
                <div className="p-4 border-b border-border/40 flex items-center justify-between min-w-[250px]">
                    <Link href={`/project/${projectId}`} className="flex items-center gap-2 text-xs font-bold text-foreground/40 hover:text-foreground transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        Lobby
                    </Link>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md truncate max-w-[130px]" title={state.novel?.title}>
                        {state.novel?.title || "Project"}
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4 min-w-[250px]">
                    <div className="space-y-1">
                        <button
                            onClick={() => router.push(`/project/${projectId}`)}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all text-left text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                        >
                            <BarChart3 className="w-4 h-4" /> Project Details
                        </button>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center justify-between px-2 pb-1 pt-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/30">Manuscript Chapters</span>
                            <button 
                                onClick={addChapter}
                                className="p-1 rounded-md text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {state.chapters.map((item) => {
                            const isSelected = state.activeChapterId === item._id;
                            return (
                                <div
                                    key={item._id}
                                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all text-left group ${isSelected ? "bg-foreground text-background shadow-md shadow-foreground/5" : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"}`}
                                >
                                    <button
                                        onClick={() => loadChapter(item._id)}
                                        className="flex items-center gap-2 truncate flex-1 text-left"
                                    >
                                        <BookOpen className="w-3.5 h-3.5 opacity-70 shrink-0" />
                                        <span className="truncate">{item.title}</span>
                                    </button>
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            if (confirm(`Delete "${item.title}"?`)) {
                                                await removeChapter(item._id);
                                            }
                                        }}
                                        className={`p-1 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1 ${isSelected ? "text-background/40 hover:text-red-300" : "text-foreground/30"}`}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </aside>

            {/* 2. DYNAMIC CENTER WORKSPACE CANVAS */}
            <main className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
                {/* Dynamic Top Header Bar */}
                <header className="h-14 border-b border-border/40 px-6 flex items-center justify-between shrink-0 bg-background/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 rounded-lg text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors">
                            <Columns className="w-4 h-4" />
                        </button>
                        <div className="h-4 w-px bg-border/60" />
                        <h2 className="text-sm font-bold text-foreground tracking-tight">
                            {activeChapter ? activeChapter.title : "No Chapter Selected"}
                        </h2>
                    </div>
                </header>

                {/* INNER CONTAINER */}
                <div className="flex-1 overflow-y-auto px-6 py-12 md:py-16 scrollbar-hide flex justify-center">
                    <div className="w-full max-w-3xl flex flex-col h-full">
                        {activeChapter ? (
                            <div className="flex flex-col h-full animate-in fade-in duration-300">
                                <input
                                    type="text"
                                    value={localTitle}
                                    onChange={(e) => {
                                        const newTitle = e.target.value;
                                        setLocalTitle(newTitle);
                                        autoSave({ title: newTitle });
                                    }}
                                    className="text-4xl sm:text-5xl font-serif font-black tracking-tight text-foreground mb-12 focus:outline-none bg-transparent placeholder:text-foreground/20"
                                    placeholder="Chapter Title..."
                                />

                                <div className="flex-1 w-full">
                                    <TailwindEditor
                                        key={activeChapter._id} /* FORCES MOUNT-REMOUNT ON TAB SWITCH */
                                        initialContent={activeChapter.content}
                                        onChange={(newContent) => {
                                            autoSave({ content: newContent });
                                        }}
                                        saveStatus={state.saveStatus}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-96 text-center">
                                <BookOpen className="w-12 h-12 text-foreground/20 mb-4" />
                                <h3 className="text-base font-bold text-foreground/75 mb-1">No chapters found</h3>
                                <p className="text-sm text-foreground/40 mb-6 max-w-xs">Create your first chapter to start writing.</p>
                                <button
                                    onClick={addChapter}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-all shadow-md shadow-indigo-500/20"
                                >
                                    Add Chapter
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function UnifiedWorkspacePage() {
    return (
        <Suspense fallback={
            <div className="fixed inset-0 top-16 flex bg-background items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <span className="w-8 h-8 border-4 border-foreground/20 border-t-indigo-500 rounded-full animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/45">Loading Workspace...</span>
                </div>
            </div>
        }>
            <WorkspaceContent />
        </Suspense>
    );
}