"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    ChevronLeft, BookOpen, Sparkles, FileText,
    Settings, PenLine, Globe, ArrowRight, MoreVertical,
    BarChart2, Plus, Clock, Download, Share2, CheckCircle2, Trash2
} from "lucide-react";
import {
    fetchProject,
    fetchChapters,
    createChapter,
    updateProject,
    addAuthorNote,
    removeAuthorNote,
    addCharacter,
    removeCharacter,
    type NovelData,
    type ChapterSummary
} from "@/lib/api-client";
import { Skeleton } from "@/components/shared/Skeleton";

// Helper to map DB status keys to UI display strings
const STATUS_MAP: Record<string, string> = {
  planning: "Planning",
  drafting: "Drafting",
  editing: "Editing",
  completed: "Completed",
};

export default function ProjectLobbyPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();

    const [project, setProject] = useState<NovelData | null>(null);
    const [chapters, setChapters] = useState<ChapterSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    // Menu States
    const [activeMenuChapterId, setActiveMenuChapterId] = useState<string | null>(null);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [projData, chapData] = await Promise.all([
                fetchProject(id),
                fetchChapters(id)
            ]);
            setProject(projData);
            setChapters(chapData);
            setError(null);
        } catch (err) {
            console.error("Failed to load project details:", err);
            setError(err instanceof Error ? err.message : "Failed to load project details.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);

    const handleShareLink = () => {
        if (!project) return;
        const shareableLink = `${window.location.origin}/read/${project._id}`;
        navigator.clipboard.writeText(shareableLink);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleAddChapter = async () => {
        const title = prompt("Enter chapter title:", "New Chapter");
        if (title === null) return; // cancelled
        const finalTitle = title.trim() || "New Chapter";
        try {
            const newChap = await createChapter(id, finalTitle);
            // Refresh chapters
            const updatedChaps = await fetchChapters(id);
            setChapters(updatedChaps);
            // Optional: redirect to editor for the new chapter
            router.push(`/write?projectId=${id}&chapterId=${newChap._id}`);
        } catch (err) {
            console.error("Failed to create chapter:", err);
            alert("Failed to create chapter: " + (err instanceof Error ? err.message : String(err)));
        }
    };

    const handleAddCharacter = async () => {
        const name = prompt("Enter character name:");
        if (!name) return;
        
        const role = prompt("Enter character role ('Protagonist', 'Antagonist', 'Support', 'Minor'):", "Support");
        if (role === null) return;

        const description = prompt("Enter character description (optional):") || "";

        const validRoles = ["Protagonist", "Antagonist", "Support", "Minor"];
        const finalRole = validRoles.includes(role) ? role : "Support";

        try {
            const updated = await addCharacter(id, { name, role: finalRole as any, description });
            setProject(updated);
        } catch (err) {
            console.error("Failed to add character:", err);
            alert("Failed to add character: " + (err instanceof Error ? err.message : String(err)));
        }
    };

    const handleRemoveCharacter = async (charId: string) => {
        if (!confirm("Remove this character profile?")) return;
        try {
            const updated = await removeCharacter(id, charId);
            setProject(updated);
        } catch (err) {
            console.error("Failed to remove character:", err);
            alert("Failed to remove character: " + (err instanceof Error ? err.message : String(err)));
        }
    };

    const handleAddNote = async () => {
        const text = prompt("Enter plot outline or note:");
        if (!text) return;
        try {
            const updated = await addAuthorNote(id, text);
            setProject(updated);
        } catch (err) {
            console.error("Failed to add author note:", err);
            alert("Failed to add note: " + (err instanceof Error ? err.message : String(err)));
        }
    };

    const handleRemoveNote = async (noteId: string) => {
        if (!confirm("Delete this note?")) return;
        try {
            const updated = await removeAuthorNote(id, noteId);
            setProject(updated);
        } catch (err) {
            console.error("Failed to remove note:", err);
            alert("Failed to delete note: " + (err instanceof Error ? err.message : String(err)));
        }
    };

    const handleRenameProject = async () => {
        if (!project) return;
        const newTitle = prompt("Rename Project Title:", project.title);
        if (!newTitle || newTitle.trim() === project.title) return;

        try {
            const updated = await updateProject(id, { title: newTitle.trim() });
            setProject(updated);
        } catch (err) {
            console.error("Failed to rename project:", err);
            alert("Failed to rename project: " + (err instanceof Error ? err.message : String(err)));
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col pb-20 gap-6">
                <header className="py-6 mb-2 flex justify-between">
                    <Skeleton className="w-32 h-5 rounded" />
                    <Skeleton className="w-20 h-8 rounded" />
                </header>
                <div className="flex flex-col md:flex-row gap-8 p-8 rounded-[32px] border border-border/40 bg-background/50">
                    <Skeleton className="w-32 h-44 rounded-2xl" />
                    <div className="flex-1 space-y-4">
                        <Skeleton className="w-24 h-6 rounded" />
                        <Skeleton className="w-1/2 h-10 rounded" />
                        <Skeleton className="w-3/4 h-16 rounded" />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 space-y-4">
                        <Skeleton className="w-1/3 h-6 rounded" />
                        <Skeleton className="w-full h-16 rounded-xl" />
                        <Skeleton className="w-full h-16 rounded-xl" />
                    </div>
                    <div className="lg:col-span-5 space-y-4">
                        <Skeleton className="w-full h-36 rounded-xl" />
                        <Skeleton className="w-full h-36 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center justify-center text-center">
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Project</h2>
                <p className="text-foreground/60 mb-6">{error || "Project not found."}</p>
                <Link href="/library" className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition-colors">
                    Back to Library
                </Link>
            </div>
        );
    }

    // Determine the cover visual class
    const coverGradient = project.coverStyle || "from-indigo-600/20 to-purple-600/20 border-indigo-500/10 text-indigo-500";

    // Link for first chapter or general write route
    const firstChapterId = chapters[0]?._id;
    const writeUrl = firstChapterId
        ? `/write?projectId=${project._id}&chapterId=${firstChapterId}`
        : `/write?projectId=${project._id}`;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col pb-20 animate-in fade-in duration-700">

            {/* 1. TOP BREADCRUMB HEADER */}
            <header className="flex items-center justify-between py-6 mb-2">
                <Link href="/library" className="flex items-center gap-2 text-sm font-bold text-foreground/50 hover:text-foreground transition-colors group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Library
                </Link>
                <button 
                    onClick={handleRenameProject}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all"
                >
                    <Settings className="w-4 h-4" /> Rename Title
                </button>
            </header>

            {/* 2. THE HERO SECTION (Project Overview) */}
            <div className="flex flex-col md:flex-row gap-8 mb-8 p-6 md:p-8 rounded-[32px] border border-border/40 bg-background shadow-sm relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${coverGradient} opacity-20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none`} />

                <div className={`w-32 h-44 shrink-0 rounded-2xl bg-gradient-to-br ${coverGradient} border flex items-center justify-center p-4 text-center shadow-inner`}>
                    <span className="font-serif italic font-bold text-lg text-zinc-900 dark:text-white drop-shadow-md line-clamp-4">
                        {project.title}
                    </span>
                </div>

                <div className="flex flex-col justify-between flex-1 z-10">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md ring-1 ring-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {STATUS_MAP[project.status] || "Planning"}
                            </span>
                            <span className="text-xs font-bold text-foreground/40 flex items-center gap-1.5">
                                <BarChart2 className="w-3.5 h-3.5" /> {(project.totalWords ?? project.stats?.currentWordCount ?? 0).toLocaleString()} Words
                            </span>
                        </div>

                        <div>
                            <h1 
                                onClick={handleRenameProject}
                                className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground flex items-center gap-3 group cursor-pointer"
                            >
                                {project.title}
                                <PenLine className="w-4 h-4 opacity-0 group-hover:opacity-100 text-foreground/30 transition-opacity" />
                            </h1>
                            <p className="text-sm font-medium text-foreground/50 mt-2 max-w-2xl leading-relaxed">
                                {project.description || "No description provided yet. Click Rename Title to change title or details."}
                            </p>
                        </div>
                    </div>

                    {/* === THE HERO ACTIONS === */}
                    <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border/40">
                        <Link href={writeUrl} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-500/20 hover:bg-indigo-500 active:scale-95 transition-all shrink-0">
                            <BookOpen className="w-4 h-4" />
                            Continue Writing
                        </Link>

                        <button
                            onClick={handleShareLink}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold active:scale-95 transition-all border shrink-0 ${isCopied
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                                    : "bg-background border-border/50 text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                                }`}
                        >
                            {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Share2 className="w-4 h-4 opacity-70" />}
                            {isCopied ? "Link Copied!" : "Share Novel"}
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. THE LOBBY BENTO GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* COLUMN A: Chapters (Manuscript) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground/50 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> Manuscript Chapters ({chapters.length})
                        </h2>
                        <button 
                            onClick={handleAddChapter}
                            className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1 transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add Chapter
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        {chapters.length === 0 ? (
                            <div className="p-8 border border-dashed border-border rounded-2xl text-center bg-foreground/[0.01]">
                                <p className="text-sm font-medium text-foreground/40 mb-3">No chapters created yet.</p>
                                <button 
                                    onClick={handleAddChapter}
                                    className="px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 border border-border text-xs font-bold rounded-lg transition-colors"
                                >
                                    Create Chapter 1
                                </button>
                            </div>
                        ) : (
                            chapters.map((ch, idx) => (
                                <div 
                                    key={ch._id}
                                    onClick={() => router.push(`/write?projectId=${project._id}&chapterId=${ch._id}`)}
                                    className="group flex items-center justify-between p-4 rounded-2xl border border-border/40 bg-background hover:border-indigo-500/30 hover:shadow-md transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono text-xs font-bold text-foreground/20 w-5">{String(idx + 1).padStart(2, '0')}</span>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-foreground group-hover:text-indigo-500 transition-colors">
                                                {ch.title}
                                            </span>
                                            <div className="flex items-center gap-3 text-xs font-medium text-foreground/40 mt-0.5">
                                                <span>{(ch.wordCount ?? 0).toLocaleString()} words</span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-foreground/10" />
                                                <span className="capitalize">{ch.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMenuChapterId(activeMenuChapterId === ch._id ? null : ch._id);
                                            }}
                                            className="p-2 rounded-lg text-foreground/30 hover:text-foreground hover:bg-foreground/5 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                        {activeMenuChapterId === ch._id && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setActiveMenuChapterId(null)} />
                                                <div className="absolute right-0 top-full mt-1 w-36 bg-background border border-border rounded-xl shadow-xl z-50 flex flex-col p-1">
                                                    <button 
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            setActiveMenuChapterId(null);
                                                            router.push(`/write?projectId=${project._id}&chapterId=${ch._id}`);
                                                        }}
                                                        className="px-3 py-2 text-xs font-semibold hover:bg-foreground/5 rounded-lg text-left"
                                                    >
                                                        Edit Content
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* COLUMN B: Characters & Plot Outlines */}
                <div className="lg:col-span-5 flex flex-col gap-6">

                    {/* Characters */}
                    <div className="rounded-[24px] border border-border/40 bg-background p-5 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground/50 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> Cast & Characters
                            </h2>
                            <button 
                                onClick={handleAddCharacter}
                                className="p-1 rounded-md text-foreground/40 hover:text-foreground hover:bg-foreground/5"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {project.characters.length === 0 ? (
                                <p className="text-xs font-medium text-foreground/40 italic p-3 text-center">No characters added yet.</p>
                            ) : (
                                project.characters.map(char => (
                                    <div 
                                        key={char._id} 
                                        className="p-3 rounded-xl border border-border/30 bg-foreground/[0.01] hover:bg-foreground/[0.03] transition-colors flex justify-between items-start group/char"
                                    >
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-bold text-foreground truncate">{char.name}</h3>
                                                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 shrink-0">
                                                    {char.role}
                                                </span>
                                            </div>
                                            {char.description && (
                                                <p className="text-xs font-medium text-foreground/50 mt-1 line-clamp-2 leading-relaxed">
                                                    {char.description}
                                                </p>
                                            )}
                                        </div>
                                        <button 
                                            onClick={() => handleRemoveCharacter(char._id!)}
                                            className="p-1 text-foreground/20 hover:text-red-500 opacity-0 group-hover/char:opacity-100 transition-all rounded"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Author Notes / Plot Outlines */}
                    <div className="rounded-[24px] border border-border/40 bg-background p-5 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground/50 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Author Notes & Outlines
                            </h2>
                            <button 
                                onClick={handleAddNote}
                                className="p-1 rounded-md text-foreground/40 hover:text-foreground hover:bg-foreground/5"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {project.authorNotes.length === 0 ? (
                                <p className="text-xs font-medium text-foreground/40 italic p-3 text-center">No notes added yet.</p>
                            ) : (
                                project.authorNotes.map(note => (
                                    <div 
                                        key={note._id} 
                                        className="p-3 rounded-xl border border-border/30 bg-foreground/[0.01] hover:bg-foreground/[0.03] transition-colors flex justify-between items-start group/note"
                                    >
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-foreground whitespace-pre-wrap leading-relaxed">
                                                {note.text}
                                            </p>
                                            <span className="text-[10px] text-foreground/30 font-medium block mt-1">
                                                {new Date(note.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => handleRemoveNote(note._id!)}
                                            className="p-1 text-foreground/20 hover:text-red-500 opacity-0 group-hover/note:opacity-100 transition-all rounded ml-2"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}