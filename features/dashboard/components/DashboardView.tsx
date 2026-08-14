"use client";

import dynamic from 'next/dynamic'
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PenLine, Clock, ArrowRight, Sun, Sunset, Moon, Plus, Target, Flame, BookOpen, Users, Globe, Map, Loader2 } from "lucide-react";
import { useDashboardData, type DashboardDoc } from "../hooks/useDashboardData";

export function DashboardView() {
    const { isLoading, stats, activeDraft, recentFiles } = useDashboardData();

    if (isLoading) return <div className="flex h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;

    return (
        <div className="w-full mx-auto px-6 py-12 md:py-16 flex flex-col min-h-screen animate-in fade-in duration-700 max-w-[1200px]">
            <Header userName="Writer" progress={stats.dailyGoalProgress} target={stats.dailyGoalTarget} />
            <DraftWidget draft={activeDraft} />
            <hr className="border-border my-8" />
            <StatsGrid stats={stats} />
            <hr className="border-border my-8" />
            <RecentList files={recentFiles} />
        </div>
    );
}

const GreetingContent = ({ userName }: { userName: string }) => {
    const h = new Date().getHours();
    const { l: label, I: Icon } = h < 12
        ? { l: "Good morning", I: Sun }
        : h < 18
            ? { l: "Good afternoon", I: Sunset }
            : { l: "Good evening", I: Moon };

    return (
        <>
            <Icon className="w-7 h-7 md:w-9 md:h-9 text-brand shrink-0 mt-2 mr-3" strokeWidth={1.5} />
            {label}, {userName}.
        </>
    );
};

const DynamicGreeting = dynamic(() => Promise.resolve(GreetingContent), {
    ssr: false,
    loading: () => <span className="opacity-0">Loading...</span> // Prevents layout shift
});

/* --- MICRO-COMPONENTS --- */
const Header = ({ userName, progress, target }: { userName: string; progress: number; target: number }) => {
    const wordsLeft = target - progress;
    const subtitle = wordsLeft > 0 && progress > 0
        ? `You're ${wordsLeft.toLocaleString()} words from your daily goal.`
        : wordsLeft <= 0
            ? "Daily goal crushed. Your universe is expanding."
            : "Your universe is waiting for you.";

    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10 shrink-0">
            <div className="flex flex-col gap-2">
                <h1 className="flex text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                    {/* Inject the dynamic component here */}
                    <DynamicGreeting userName={userName} />
                </h1>
                <p className="text-muted-foreground text-base font-medium">{subtitle}</p>
            </div>
            <Link href="/project/new" className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-foreground text-background hover:bg-foreground/90 uppercase tracking-widest text-xs font-bold transition-all">
                <Plus className="w-4 h-4" /> Create Novel
            </Link>
        </header>
    );
};

const DraftWidget = ({ draft }: { draft: DashboardDoc | null }) => !draft ? (
    <section className="flex flex-col items-center justify-center gap-3 py-16 group p-6 rounded-2xl border border-transparent hover:border-border/40 hover:bg-secondary/10 transition-all cursor-pointer">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/30 text-muted-foreground group-hover:text-brand"><PenLine className="h-6 w-6" /></div>
        <h3 className="text-3xl font-serif font-bold tracking-tight">The blank page awaits</h3>
        <Link href="/project/new" className="mt-4 px-6 py-2.5 text-xs font-bold uppercase tracking-widest border border-border/50 rounded-full group-hover:bg-foreground group-hover:text-background transition-all">Create New Novel</Link>
    </section>
) : (
    <Link href={`/project/${draft._id}/write`} className="block w-full outline-none">
        <section className="flex flex-col gap-6 mb-8 group cursor-pointer p-6 -mx-6 rounded-2xl border border-transparent hover:border-border/40 hover:bg-secondary/20 transition-all">
            <h2 className="text-sm font-bold tracking-widest uppercase flex items-center gap-4">Pick up where you left off <span className="h-px flex-1 bg-border" /></h2>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-6 min-w-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/50 text-muted-foreground group-hover:text-brand group-hover:bg-secondary transition-colors"><PenLine className="h-6 w-6" /></div>
                    <div className="flex flex-col gap-2 min-w-0">
                        <h3 className="text-4xl font-serif font-bold tracking-tight group-hover:text-brand transition-colors truncate">{draft.title || "Untitled"}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                            <span className="uppercase text-[10px] font-bold text-brand border border-brand/30 bg-brand/5 px-2 py-0.5 rounded-sm">{draft.status || "Draft"}</span>
                            <span className="flex items-center gap-1.5 italic font-serif"><Clock className="w-4 h-4" /> {new Date(draft.updatedAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5 italic font-serif"><span className="font-sans text-[11px] font-bold uppercase opacity-60">Words:</span> {draft.wordCount?.toLocaleString() || "0"}</span>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex items-center rounded-full bg-foreground text-background h-10 group-hover:px-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest w-0 group-hover:w-auto opacity-0 group-hover:opacity-100 transition-all">Continue</span><ArrowRight className="h-4 w-4" />
                </div>
            </div>
        </section>
    </Link>
);

const StatsGrid = ({ stats }: { stats: ReturnType<typeof useDashboardData>["stats"] }) => {
    const p = Math.min((stats.dailyGoalProgress || 0) / (stats.dailyGoalTarget || 2000), 1);
    return (
        <section className="flex flex-col gap-6 w-full">
            <h2 className="text-sm font-bold tracking-widest uppercase flex items-center gap-4">Writing Analytics <span className="h-px flex-1 bg-border" /></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-y border-border">
                <StatCard title="Daily Goal" icon={<Target className="w-5 h-5" />} val={stats.dailyGoalProgress} sub={`/ ${stats.dailyGoalTarget.toLocaleString()}`} renderRing={{ p }} />
                <StatCard title="Current Streak" icon={<Flame className="w-5 h-5 text-brand" />} val={stats.currentStreak} sub="Days" />
                <StatCard title="Total Manuscript" icon={<BookOpen className="w-5 h-5" />} val={stats.totalWords.toLocaleString()} sub="Words" />
            </div>
        </section>
    );
};

const StatCard = ({ title, icon, val, sub, renderRing }: { title: string; icon: React.ReactNode; val: string | number; sub: string; renderRing?: { p: number } }) => (
    <div className="flex flex-col py-10 px-0 md:px-10 first:pl-0 last:pr-0 group text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2.5 mb-8 text-foreground group-hover:text-brand transition-colors">{icon}<span className="text-xs uppercase font-bold tracking-widest">{title}</span></div>
        {renderRing ? (
            <div className="relative flex items-center justify-center w-24 h-24 mt-auto mx-auto md:mx-0">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="transparent" className="stroke-border/50" strokeWidth="3.5" />
                    <circle cx="50" cy="50" r="44" fill="transparent" className="stroke-brand transition-all duration-1000" strokeWidth="3.5" strokeDasharray={276} strokeDashoffset={276 - renderRing.p * 276} strokeLinecap="round" />
                </svg>
                <div className="flex flex-col text-center"><span className="text-xl font-serif font-bold tracking-tight">{val}</span><span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">{sub}</span></div>
            </div>
        ) : (
            <div className="flex flex-col w-full mt-auto"><div className="flex items-baseline justify-center md:justify-start gap-2"><span className="text-6xl font-serif font-bold group-hover:scale-105 origin-left transition-transform">{val}</span><span className="text-sm font-bold text-muted-foreground uppercase">{sub}</span></div></div>
        )}
    </div>
);

const RecentList = ({ files }: { files: DashboardDoc[] }) => {
    const router = useRouter();
    const getStyle = (t: string) => t === "character" ? { I: Users, c: "text-rose-500 border-rose-500" } : t === "lore" ? { I: Globe, c: "text-purple-500 border-purple-500" } : t === "location" ? { I: Map, c: "text-teal-500 border-teal-500" } : { I: BookOpen, c: "text-brand border-brand" };

    return (
        <section className="flex flex-col gap-6 w-full pb-10">
            <h2 className="text-sm font-bold tracking-widest uppercase flex items-center gap-4">Recent Workspace <span className="h-px flex-1 bg-border" /></h2>
            {!files.length ? <div className="py-16 text-center text-muted-foreground font-serif italic">Your library is empty.</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 pt-2">
                    {files.map(f => {
                        const { I, c } = getStyle(f.type);
                        return (
                            <button key={f._id} onClick={() => router.push(`/project/${f.type === 'chapter' ? f.parentId : f._id}`)} className="group flex items-center justify-between p-3 -mx-3 rounded-2xl hover:bg-secondary/30 transition-all text-left">
                                <div className="flex items-center gap-5"><div className={`flex items-center justify-center h-12 w-12 rounded-xl bg-secondary/30 border-l-[3px] shrink-0 ${c}`}><I className="w-5 h-5" /></div>
                                    <div className="flex flex-col min-w-0"><span className="font-bold text-sm truncate group-hover:text-brand transition-colors">{f.title}</span><span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{f.type} • {new Date(f.updatedAt).toLocaleDateString()}</span></div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-brand opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </button>
                        );
                    })}
                </div>
            )}
        </section>
    );
};