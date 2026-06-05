"use client";

import Link from "next/link";
import { ArrowLeft, Edit3, Book, HeartHandshake, Sparkles, Tag, Eye, Brain, BookOpen } from "lucide-react";

// MOCK DATA
const CHARACTER = {
  id: "1",
  name: "Aria Vance",
  role: "Protagonist",
  archetype: "The Reluctant Hero",
  status: "alive",
  appearance: "Aria stands at 5'4\", possessing a lithe, athletic build born from years of surviving the lower rings. Her eyes are a striking, unnatural violet. She favors practical, dark clothing that allows her to blend into the alleys, often wearing a worn leather duster.",
  personality: "Quick-tempered and fiercely independent. Aria hides a deep vulnerability behind a wall of sarcasm and defiance. She is claustrophobic and despises being told what to do. Her moral compass is gray, leaning toward chaotic good.",
  history: "Born in the slums of the Glass Citadel, Aria was orphaned at age six. She was forced to learn shadow weaving from street syndicates to survive. She recently discovered a map tied to the Old Gods hidden in her late mother's belongings.",
  traits: ["Brave", "Reckless", "Cunning", "Claustrophobic"],
  aliases: ["The Shadow Walker", "Market Rat", "Vance"],
  imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&h=1200&q=80",
  appearsIn: ["The Glass Citadel", "Shadows of the Past"],
  relationships: [
    { targetName: "Kaelen", type: "Nemesis", status: "alive" },
    { targetName: "Elara", type: "Mentor", status: "alive" },
    { targetName: "Jax", type: "Ally", status: "unknown" }
  ]
};

export default function CharacterDetailsPage() {
  return (
    <div className="h-screen w-full overflow-y-auto bg-background px-4 md:px-8 py-8 pb-32 no-scrollbar animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto flex flex-col w-full h-full gap-8">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between shrink-0">
          <Link 
            href="/characters"
            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors w-fit group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Roster
          </Link>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/50 text-foreground hover:bg-secondary transition-all font-bold shadow-sm active:scale-95 border border-border/20">
            <Edit3 className="w-4 h-4" />
            <span>Edit Character</span>
          </button>
        </div>

        {/* 🟢 NEW: Sticky Codex Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: Sticky Massive Portrait */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-8">
            <div className="w-full aspect-[2/3] rounded-[2rem] bg-secondary/20 border border-border/20 overflow-hidden relative shadow-2xl">
              <img 
                src={CHARACTER.imageUrl} 
                alt={CHARACTER.name} 
                className="w-full h-full object-cover object-top" 
              />
              
              {/* Subtle Status Badge */}
              <div className="absolute top-5 right-5">
                <span className="px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase backdrop-blur-md bg-black/40 border border-white/10 text-white shadow-lg">
                  {CHARACTER.status}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Scrolling Details */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            
            {/* Header: Name & Role */}
            <div className="flex flex-col gap-4 border-b border-border/20 pb-8">
              <h1 className="text-6xl font-black text-foreground tracking-tight drop-shadow-sm">
                {CHARACTER.name}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-sm font-bold text-primary uppercase tracking-widest">
                  {CHARACTER.role}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-border/60"></span>
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  {CHARACTER.archetype}
                </span>
              </div>
            </div>

            {/* Quick Meta: Tags & Aliases */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col gap-3 flex-1">
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest flex items-center gap-2">
                  <Tag className="w-3 h-3" /> Known Aliases
                </span>
                <div className="flex flex-wrap gap-2">
                  {CHARACTER.aliases.map((alias) => (
                    <span key={alias} className="text-xs font-semibold text-foreground/90">
                      "{alias}"
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> Core Traits
                </span>
                <div className="flex flex-wrap gap-2">
                  {CHARACTER.traits.map((trait) => (
                    <span key={trait} className="px-2.5 py-1 rounded-md bg-secondary/30 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border border-border/20">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Deep Lore Sections */}
            <div className="flex flex-col gap-8 mt-4">
              
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest flex items-center gap-2">
                  <Eye className="w-3 h-3" /> Physical Appearance
                </span>
                <p className="text-base text-foreground/80 leading-relaxed">
                  {CHARACTER.appearance}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest flex items-center gap-2">
                  <Brain className="w-3 h-3" /> Personality & Flaws
                </span>
                <p className="text-base text-foreground/80 leading-relaxed">
                  {CHARACTER.personality}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest flex items-center gap-2">
                  <BookOpen className="w-3 h-3" /> Backstory & History
                </span>
                <p className="text-base text-foreground/80 leading-relaxed">
                  {CHARACTER.history}
                </p>
              </div>

            </div>

            {/* Novels & Relationships */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border/20 mt-4">
              
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest flex items-center gap-2">
                  <Book className="w-3 h-3" /> Appears In
                </span>
                <div className="flex flex-col gap-2">
                  {CHARACTER.appearsIn.map((novel) => (
                    <div key={novel} className="px-4 py-3 rounded-xl bg-secondary/20 border border-border/20 text-sm font-semibold text-foreground">
                      {novel}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest flex items-center gap-2">
                  <HeartHandshake className="w-3 h-3" /> Relationships
                </span>
                <div className="flex flex-col gap-2">
                  {CHARACTER.relationships.map((rel, idx) => (
                    <div key={idx} className="flex items-center justify-between px-4 py-3 rounded-xl bg-secondary/20 border border-border/20 hover:border-primary/30 transition-colors cursor-pointer group">
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {rel.targetName}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {rel.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}