"use client";

import { useState } from "react";
import { X, User, Image as ImageIcon, Sparkles } from "lucide-react";

interface CreateCharacterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCharacterPanel({ isOpen, onClose }: CreateCharacterPanelProps) {
  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("supporting");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#0f1115] border-l border-border/50 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300 sm:rounded-l-3xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/50 bg-secondary/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20 text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-foreground tracking-tight">New Character</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 no-scrollbar">
          
          {/* 1. Image Upload / URL */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Portrait (URL)
            </label>
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl bg-secondary border-2 border-dashed border-border/60 flex items-center justify-center shrink-0 overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover object-top" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
                )}
              </div>
              <input 
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Paste image URL here..."
                className="flex-1 bg-secondary/30 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          {/* 2. Basic Info */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Character Name <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Aria Vance"
                className="w-full bg-secondary/30 border border-border/50 rounded-xl pl-11 pr-4 py-3 text-foreground font-semibold focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          {/* 3. Role Selection */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Story Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "protagonist", label: "Protagonist" },
                { id: "antagonist", label: "Antagonist" },
                { id: "supporting", label: "Supporting" },
                { id: "minor", label: "Minor" }
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all border ${
                    role === r.id 
                      ? "bg-primary/20 border-primary/50 text-primary" 
                      : "bg-secondary/30 border-border/50 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Biography & Physical Description (Massive Text Area) */}
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Physical Description & Bio
              </label>
              <span className="text-[10px] text-muted-foreground font-medium">Supports detail</span>
            </div>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe their physical appearance, body details, personality, and background..."
              className="w-full h-48 sm:flex-1 bg-secondary/30 border border-border/50 rounded-xl p-4 text-sm text-foreground leading-relaxed focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 border-t border-border/50 bg-secondary/10 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          >
            Cancel
          </button>
          <button 
            disabled={!name}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Spawn Character
          </button>
        </div>

      </div>
    </>
  );
}