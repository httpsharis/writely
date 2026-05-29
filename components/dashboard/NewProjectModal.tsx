"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Book, FileText, Check, Sparkles } from "lucide-react";
import { createProject } from "@/lib/api-client";

interface NewProjectModalProps {
    isOpen: boolean;
    onClose: (newProject?: any) => void;
}

const TEMPLATES = [
    { id: "chapters", name: "Chapters", icon: Book, description: "Manuscript & Scenes" },
    { id: "plots", name: "Plots & Ideas", icon: Sparkles, description: "Outlines & Story Arcs" },
    { id: "notes", name: "World Notes", icon: FileText, description: "Lore, Characters & Rules" },
];

const COVERS = [
    { id: "indigo", classes: "from-indigo-600/20 to-purple-600/20 border-indigo-500/20", color: "bg-indigo-500" },
    { id: "emerald", classes: "from-emerald-600/20 to-teal-600/20 border-emerald-500/20", color: "bg-emerald-500" },
    { id: "amber", classes: "from-amber-600/20 to-orange-600/20 border-amber-500/20", color: "bg-amber-500" },
    { id: "rose", classes: "from-rose-600/20 to-pink-600/20 border-rose-500/20", color: "bg-rose-500" },
    { id: "slate", classes: "from-slate-600/20 to-zinc-600/20 border-slate-500/20", color: "bg-slate-500" },
];

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
    const router = useRouter();

    // Form State
    const [title, setTitle] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState("novel");
    const [selectedCover, setSelectedCover] = useState(COVERS[0]);
    const [isCreating, setIsCreating] = useState(false);

    if (!isOpen) return null;

    const handleCreate = async () => {
        if (!title.trim()) return;
        setIsCreating(true);
        try {
            const newProject = await createProject(title, selectedCover.classes);
            router.push(`/project/${newProject._id}`);
            onClose(newProject);
        } catch (err) {
            console.error("Failed to create project:", err);
            alert("Failed to create project: " + (err instanceof Error ? err.message : String(err)));
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <>
            {/* 1. Optimized Backdrop (No blur, just solid opacity for 60FPS) */}
            <div
                className="fixed inset-0 z-[100] bg-zinc-950/60 dark:bg-black/60 transition-opacity duration-200 animate-in fade-in"
                onClick={onClose}
            />

            {/* 2. The Modal Window */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-xl animate-in fade-in zoom-in-95 duration-200 transform-gpu will-change-transform px-4">

                <div className="flex flex-col bg-background border border-border/50 rounded-[32px] shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                        <h2 className="text-lg font-bold text-foreground">Create New Project</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="p-6 flex flex-col gap-8">

                        {/* Title Input & Live Cover Preview */}
                        <div className="flex gap-6 items-center">
                            {/* Live Preview Square */}
                            <div className={`w-24 h-32 shrink-0 rounded-xl bg-gradient-to-br ${selectedCover.classes} border border-border flex items-center justify-center p-2 text-center transition-all duration-500`}>
                                <span className="font-serif italic font-bold text-xs text-zinc-900 dark:text-white drop-shadow-none dark:drop-shadow-md line-clamp-3">
                                    {title || "Untitled"}
                                </span>
                            </div>

                            <div className="flex-1 flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-foreground/50">Project Title</label>
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="The Obsidian Crown..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-transparent text-2xl font-bold text-foreground placeholder:text-foreground/20 focus:outline-none transition-colors border-b-2 border-transparent focus:border-indigo-500 pb-1"
                                />
                            </div>
                        </div>

                        {/* Template Selection */}
                        <div className="flex flex-col gap-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-foreground/50">Select Template</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {TEMPLATES.map((t) => {
                                    const Icon = t.icon;
                                    const isSelected = selectedTemplate === t.id;
                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => setSelectedTemplate(t.id)}
                                            className={`flex flex-col gap-2 p-4 rounded-2xl border text-left transition-all duration-200 ${isSelected
                                                ? "bg-indigo-500/5 border-indigo-500 shadow-sm shadow-indigo-500/10"
                                                : "bg-background border-border/50 hover:border-border hover:bg-foreground/[0.02]"
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 ${isSelected ? "text-indigo-500" : "text-foreground/50"}`} />
                                            <div className="flex flex-col">
                                                <span className={`font-bold text-sm ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-foreground"}`}>
                                                    {t.name}
                                                </span>
                                                <span className="text-[11px] font-medium text-foreground/50">{t.description}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Cover Gradient Selection */}
                        <div className="flex items-center gap-4">
                            <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 w-24">Cover Color</label>
                            <div className="flex items-center gap-3">
                                {COVERS.map((cover) => (
                                    <button
                                        key={cover.id}
                                        onClick={() => setSelectedCover(cover)}
                                        className={`w-8 h-8 rounded-full ${cover.color} flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-${cover.color}`}
                                    >
                                        {selectedCover.id === cover.id && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 py-4 bg-foreground/[0.02] border-t border-border/50 flex items-center justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-sm font-semibold text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={!title.trim() || isCreating}
                            className="flex items-center justify-center w-32 h-10 bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-semibold active:scale-95 transition-all shadow-md shadow-indigo-500/20"
                        >
                            {isCreating ? (
                                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Create Project"
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}