"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, Target, AlignLeft, Tag } from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();
  
  // Form State
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState(""); // Replaced 'type' with 'tags'
  const [synopsis, setSynopsis] = useState("");
  const [targetWords, setTargetWords] = useState("50000");

const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Creating project:", { title, tags, synopsis, targetWords });
    
    // Simulate MongoDB generating a unique ID for your new book
    const mockDatabaseId = "12345";
    
    // Redirect directly to the new project's Lobby!
    router.push(`/project/${mockDatabaseId}`);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full w-full animate-in fade-in duration-500 pb-32 md:pb-12 px-4 md:px-8 pt-6 md:pt-10 no-scrollbar">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/project"
          className="p-2 -ml-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Create New Project</h1>
          <p className="text-sm text-muted-foreground mt-1">Start your next great story.</p>
        </div>
      </div>

      <form onSubmit={handleCreate} className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-10">
          
          {/* Left Column: Cover Image Upload */}
          <div className="flex flex-col gap-3 md:w-1/3 shrink-0">
            <label className="text-sm font-semibold text-foreground">Cover Image (Optional)</label>
            <button 
              type="button"
              className="w-full aspect-[2/3] rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-secondary/50 transition-all flex flex-col items-center justify-center gap-3 text-muted-foreground group"
            >
              <div className="p-4 rounded-full bg-secondary group-hover:bg-background transition-colors">
                <ImagePlus className="w-6 h-6 group-hover:text-primary transition-colors" />
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-foreground block">Upload Cover</span>
                <span className="text-xs mt-1 block">JPEG, PNG up to 5MB</span>
              </div>
            </button>
          </div>

          {/* Right Column: Project Details */}
          <div className="flex flex-col gap-6 w-full">
            
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-sm font-semibold text-foreground">Project Title</label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Silent City"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-lg font-medium"
              />
            </div>

            {/* Tags (Replaced Project Type) */}
            <div className="flex flex-col gap-2">
              <label htmlFor="tags" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                Tags & Genres
              </label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. Fantasy, Short Story, LitRPG"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <p className="text-xs text-muted-foreground">Separate tags with a comma.</p>
            </div>

            {/* Target Word Count */}
            <div className="flex flex-col gap-2">
              <label htmlFor="targetWords" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                Target Word Count
              </label>
              <input
                id="targetWords"
                type="number"
                value={targetWords}
                onChange={(e) => setTargetWords(e.target.value)}
                placeholder="50000"
                className="w-full md:w-1/2 px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <p className="text-xs text-muted-foreground">Used to track your progress and goals.</p>
            </div>

            {/* Synopsis */}
            <div className="flex flex-col gap-2">
              <label htmlFor="synopsis" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-muted-foreground" />
                Synopsis / Logline
              </label>
              <textarea
                id="synopsis"
                rows={4}
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                placeholder="A brief summary of your story..."
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              />
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 mt-10 pt-6 border-t border-border/50">
          <Link
            href="/project"
            className="px-6 py-2.5 rounded-full text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!title.trim()}
            className="px-8 py-2.5 rounded-full text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
          >
            Create Project
          </button>
        </div>

      </form>
    </div>
  );
}