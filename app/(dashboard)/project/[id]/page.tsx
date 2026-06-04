"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  PenTool,
  Plus,
  Settings,
  MoreVertical,
  Bell,
  Send,
  ImageIcon,
  BookOpen,
  Clock,
} from "lucide-react";

export default function ProjectLobby() {
  const params = useParams();
  const projectId = params.id;

  // --- MOCK DATA ---
  const project = {
    title: "Untitled Novel",
    description: "No description yet — click to add one.",
    status: "Drafting",
    stats: { chapters: 12, words: 24500, views: 0, followers: 0 },
    recentChapters: [
      {
        id: 1,
        title: "Chapter 1: The Awakening",
        words: 2100,
        status: "Published",
        date: "Jun 2",
      },
      {
        id: 2,
        title: "Chapter 2: City of Glass",
        words: 1850,
        status: "Draft",
        date: "Jun 3",
      },
      {
        id: 3,
        title: "Chapter 3: Shadows",
        words: 500,
        status: "Writing",
        date: "Today",
      },
    ],
    announcements: [
      {
        id: 1,
        text: "Hey everyone! Chapter 3 is delayed by a day because I'm sick. Thanks for the patience!",
        date: "1 day ago",
      },
    ],
  };

  return (
    // 🟢 Fix: Added min-h-screen and massive pb-40 to fix the missing bottom space
    <div className="min-h-screen w-full animate-in fade-in duration-500 pb-40 px-4 md:px-8 pt-6 md:pt-10 no-scrollbar">
      <div className="max-w-6xl mx-auto flex flex-col h-full w-full">
        {/* 1. Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/project"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </Link>

          <div className="flex items-center gap-3">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <Link
              href={`/project/${projectId}/write`}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-semibold shadow-md active:scale-95"
            >
              <PenTool className="w-4 h-4" />
              <span>Open Editor</span>
            </Link>
          </div>
        </div>

        {/* 2. Hero Section: Book Profile & Inline Stats */}
        {/* 🟢 Fix: Removed ugly box icons, condensed info to feel like a Web Novel profile page */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-12 items-start">
          {/* Cover Placeholder */}
          <div className="w-32 h-48 md:w-40 md:h-56 shrink-0 rounded-lg border border-border/50 bg-secondary/30 flex flex-col items-center justify-center text-muted-foreground shadow-sm">
            <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-[10px] uppercase tracking-widest font-semibold opacity-50">
              No Cover
            </span>
          </div>

          <div className="flex flex-col flex-1 pt-2">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                {project.status}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
              {project.title}
            </h1>

            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mb-6 cursor-pointer hover:text-foreground transition-colors">
              {project.description}
            </p>

            {/* Minimalist Stat Row */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 border-t border-border/40">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">
                  {project.stats.chapters}
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Chapters
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">
                  {project.stats.words.toLocaleString()}
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Words
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">
                  {project.stats.views}
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Views
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">
                  {project.stats.followers}
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Followers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Main Split Content */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Dense Chapter List */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
                Manuscript
              </h2>
              <button className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                <Plus className="w-4 h-4" />
                New Chapter
              </button>
            </div>

            {/* 🟢 Fix: Dense, borderless list. Perfect for web novels with 100+ chapters */}
            <div className="flex flex-col">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-border/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <div className="col-span-6 md:col-span-7">Title</div>
                <div className="col-span-3 md:col-span-2 text-right">Words</div>
                <div className="col-span-3 text-right">Date</div>
              </div>

              {project.recentChapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border/20 hover:bg-secondary/20 transition-colors group cursor-pointer items-center"
                >
                  <div className="col-span-6 md:col-span-7 flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {chapter.title}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-sm w-fit font-bold uppercase tracking-wider ${
                        chapter.status === "Published"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {chapter.status}
                    </span>
                  </div>
                  <div className="col-span-3 md:col-span-2 text-right text-sm text-muted-foreground font-medium">
                    {chapter.words.toLocaleString()}
                  </div>
                  <div className="col-span-3 text-right flex items-center justify-end gap-2 text-sm text-muted-foreground">
                    <span className="hidden md:block">{chapter.date}</span>
                    <button className="p-1 rounded-md hover:bg-secondary hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Public Announcements Feed */}
          <div className="w-full lg:w-[350px] flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-xl font-bold text-foreground">
                Public Announcements
              </h2>
            </div>

            {/* 🟢 Fix: Turned into a "Universal Post" system for readers */}
            <div className="flex flex-col gap-4">
              {/* Input Box */}
              <div className="p-4 rounded-xl border border-border bg-card/30 flex flex-col gap-3 focus-within:border-primary/50 focus-within:bg-card transition-all">
                <textarea
                  className="w-full h-20 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none"
                  placeholder="Share an update, delay, or milestone with your readers..."
                />
                <div className="flex justify-between items-center border-t border-border/50 pt-3">
                  <span className="text-xs text-muted-foreground">
                    Visible on your novel page
                  </span>
                  <button className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all font-semibold text-sm">
                    <Send className="w-3.5 h-3.5" />
                    Post
                  </button>
                </div>
              </div>

              {/* Feed of past announcements */}
              <div className="flex flex-col gap-3">
                {project.announcements.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-xl bg-secondary/30 border border-border/30 flex flex-col gap-2"
                  >
                    <p className="text-sm text-foreground/90">{post.text}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      <Clock className="w-3 h-3" />
                      {post.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
