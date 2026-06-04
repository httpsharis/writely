"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MoreVertical,
  User,
  Sparkles,
  Book,
} from "lucide-react";

// 🟢 FIXED: Removed banner styles, updated image URLs to request tall portraits
const MOCK_CHARACTERS = [
  {
    id: 1,
    name: "Aria Vance",
    role: "Protagonist",
    archetype: "The Reluctant Hero",
    bio: "Uses shadow magic. Has a secret past with the old gods.",
    tags: ["Magic User", "Orphan"],
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=800&q=80",
    appearsIn: ["The Glass Citadel", "Shadows of the Past"],
  },
  {
    id: 2,
    name: "Kaelen",
    role: "Antagonist",
    archetype: "The Fallen King",
    bio: "Leader of the Glass Citadel. Wants to steal Aria's magic to save his dying son.",
    tags: ["Royalty", "Corrupted"],
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&h=800&q=80",
    appearsIn: ["The Glass Citadel"],
  },
  {
    id: 3,
    name: "Elara",
    role: "Supporting",
    archetype: "The Mentor",
    bio: "An ancient archivist who knows the true history of the Citadel.",
    tags: ["Scholar", "Neutral"],
    imageUrl:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&h=800&q=80",
    appearsIn: ["The Glass Citadel", "The Old Gods"],
  },
  {
    id: 4,
    name: "Jax",
    role: "Supporting",
    archetype: "The Comic Relief",
    bio: "A street-smart thief who accidentally gets tied to Aria's quest. Loyal to a fault.",
    tags: ["Thief", "Loyal"],
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=800&q=80",
    appearsIn: ["Shadows of the Past"],
  },
];

export default function GlobalCharactersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="h-screen w-full overflow-y-auto bg-background px-4 md:px-8 py-8 pb-32 animate-in fade-in duration-500 no-scrollbar">
      <div className="max-w-7xl mx-auto flex flex-col w-full h-full">
        {/* Top Navigation & Header */}
        <div className="flex flex-col gap-4 mb-8 shrink-0">
          <Link
            href="/project"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-3">
                Character Studio
                <Sparkles className="w-6 h-6 text-primary" />
              </h1>
              <p className="text-base text-muted-foreground mt-2 max-w-xl">
                Manage your global cast and assign them across your different
                novels.
              </p>
            </div>
            <Link
              href="/characters/new"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-bold shadow-md shadow-primary/20 active:scale-95 shrink-0"
            >
              <Plus className="w-5 h-5" />
              <span>New Character</span>
            </Link>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-10 shrink-0">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search characters by name, role, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card/50 backdrop-blur-sm border border-border/60 rounded-xl pl-12 pr-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm text-foreground hover:bg-secondary/80 transition-colors text-sm font-bold w-full md:w-auto shadow-sm">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* 🟢 NEW: Codex / Trading Card Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {MOCK_CHARACTERS.map((char) => (
            <div
              key={char.id}
              className="group flex flex-col h-full bg-secondary/20 border border-border/50 rounded-3xl overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative cursor-pointer"
            >
              {/* 🟢 Massive Portrait Header */}
              <div className="relative w-full h-80 shrink-0 bg-background overflow-hidden">
                {char.imageUrl ? (
                  <img
                    src={char.imageUrl}
                    alt={char.name}
                    // object-top ensures we see their face/head even if the image is very tall
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}

                {/* Gradient overlay to seamlessly blend the image into the card background */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0f1115] to-transparent opacity-80" />

                {/* Options Button */}
                <button className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white/90 hover:bg-black/80 hover:text-white transition-colors backdrop-blur-md">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Content Area */}
              <div className="px-6 pt-5 pb-6 relative flex-1 flex flex-col bg-[#0f1115]">
                {/* Name & Role */}
                <div className="mb-4 shrink-0">
                  <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight truncate">
                    {char.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest truncate">
                      {char.role}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border/80 shrink-0"></span>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest truncate">
                      {char.archetype}
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                  {char.bio}
                </p>

                {/* Bottom Anchored Content */}
                <div className="mt-auto flex flex-col">
                  {/* "Appears In" Section */}
                  <div className="flex flex-col gap-2 pt-5 border-t border-border/50 mb-4">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      <Book className="w-3 h-3" /> Appears In
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {char.appearsIn.map((novel, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-semibold text-foreground/80 bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/40 truncate hover:border-primary/30 transition-colors"
                        >
                          {novel}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tags Footer */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {char.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-md text-[9px] font-bold text-muted-foreground bg-background uppercase tracking-widest border border-border/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
