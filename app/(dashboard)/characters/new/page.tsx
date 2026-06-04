"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Image as ImageIcon, Sparkles, Save, Eye, Brain, BookOpen } from "lucide-react";

export default function NewCharacterPage() {
  const router = useRouter();
  
  // Basic Info
  const [name, setName] = useState("");
  const [role, setRole] = useState("supporting");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  // 🟢 NEW: Structured Lore State
  const [appearance, setAppearance] = useState("");
  const [personality, setPersonality] = useState("");
  const [history, setHistory] = useState("");

  const handleSave = () => {
    console.log("Saving character...", { name, role, avatarUrl, appearance, personality, history });
    // TODO: Connect to backend API here
    router.push("/characters");
  };

  return (
    <div className="h-screen w-full overflow-y-auto bg-background px-4 md:px-8 py-8 pb-32 no-scrollbar animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto flex flex-col w-full h-full gap-8">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between shrink-0 mb-2">
          <Link 
            href="/characters"
            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors w-fit group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Roster
          </Link>
        </div>

        {/* Full-Page Form Container */}
        <div className="bg-card/20 border border-border/50 rounded-[2rem] p-6 md:p-10 flex flex-col gap-10 shadow-sm">
          
          {/* Form Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-3">
              Draft New Character
              <Sparkles className="w-7 h-7 text-primary" />
            </h1>
            <p className="text-base text-muted-foreground">
              Establish the core identity and specific traits.
            </p>
          </div>

          {/* Section 1: Identity */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            
            {/* Portrait Upload */}
            <div className="md:col-span-4 flex flex-col gap-3">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <ImageIcon className="w-3 h-3" /> Portrait URL
              </label>
              
              <div className="w-full max-w-[240px] aspect-[3/4] rounded-2xl bg-secondary/40 border-2 border-dashed border-border/60 flex items-center justify-center overflow-hidden relative group">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground/50 p-4 text-center">
                    <User className="w-10 h-10 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                  </div>
                )}
              </div>

              <input 
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Paste URL..."
                className="w-full max-w-[240px] bg-secondary/30 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Name & Role */}
            <div className="md:col-span-8 flex flex-col gap-8 w-full">
              
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Designation <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Character Name"
                    className="w-full bg-secondary/30 border border-border/50 rounded-xl pl-12 pr-4 py-4 text-lg text-foreground font-bold focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Primary Role
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: "protagonist", label: "Protagonist" },
                    { id: "antagonist", label: "Antagonist" },
                    { id: "supporting", label: "Supporting" },
                    { id: "minor", label: "Minor" }
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`px-5 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all border flex-1 min-w-[130px] ${
                        role === r.id 
                          ? "bg-primary/20 border-primary/50 text-primary shadow-sm" 
                          : "bg-secondary/30 border-border/50 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-border/50 my-2"></div>

          {/* 🟢 NEW: Section 2 - Structured Lore */}
          <div className="flex flex-col gap-8">
            
            {/* Field 1: Physical Appearance */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" /> Physical Appearance & Body
              </label>
              <textarea 
                value={appearance}
                onChange={(e) => setAppearance(e.target.value)}
                placeholder="Detail their exact body type, facial features, scars, clothing style, and physical quirks..."
                className="w-full min-h-[160px] bg-secondary/30 border border-border/50 rounded-2xl p-5 text-base text-foreground leading-relaxed focus:outline-none focus:border-primary/50 transition-colors resize-y"
              />
            </div>

            {/* Field 2: Personality & Flaws */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Brain className="w-4 h-4 text-emerald-500" /> Personality & Flaws
              </label>
              <textarea 
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                placeholder="Describe their fears, desires, how they speak, and their moral alignment..."
                className="w-full min-h-[160px] bg-secondary/30 border border-border/50 rounded-2xl p-5 text-base text-foreground leading-relaxed focus:outline-none focus:border-emerald-500/50 transition-colors resize-y"
              />
            </div>

            {/* Field 3: Backstory */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" /> Backstory & History
              </label>
              <textarea 
                value={history}
                onChange={(e) => setHistory(e.target.value)}
                placeholder="Where did they come from? What past events shaped who they are today?"
                className="w-full min-h-[160px] bg-secondary/30 border border-border/50 rounded-2xl p-5 text-base text-foreground leading-relaxed focus:outline-none focus:border-amber-500/50 transition-colors resize-y"
              />
            </div>

          </div>

          {/* Form Footer */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border/50 mt-4">
            <Link 
              href="/characters"
              className="px-6 py-3.5 rounded-full text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </Link>
            <button 
              onClick={handleSave}
              disabled={!name}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>Save Character</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}