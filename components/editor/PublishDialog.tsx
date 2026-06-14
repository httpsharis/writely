"use client";

import { useState } from "react";
import { Globe, Link2, X, Check, AlertTriangle } from "lucide-react";
import { useEditorContext } from "@/app/(editor)/project/[id]/write/EditorContext";

export default function PublishDialog() {
  // 🟢 Pulling directly from the cloud!
  const { novel, publishedCount, handleToggleNovelPublish, setIsPublishModalOpen } = useEditorContext();

  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const isPublished = novel.status === "published";
  
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/read/${novel.slug || novel._id}`
      : "";

  async function handleToggle() {
    setBusy(true);
    try {
      await handleToggleNovelPublish();
    } finally {
      setBusy(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/95">
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
          <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <Globe className="w-3.5 h-3.5" /> 
            Publish & Share
          </h2>
          <button
            onClick={() => setIsPublishModalOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          
          {/* Status Badge */}
          <div className="mb-8 flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                isPublished ? "bg-emerald-500/10 text-emerald-500" : "bg-secondary text-muted-foreground"
              }`}
            >
              <Globe className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1">
              <div className={`text-xs font-bold uppercase tracking-widest ${isPublished ? 'text-emerald-500' : 'text-foreground'}`}>
                {isPublished ? "Published Live" : "Private Draft"}
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                {isPublished
                  ? "Your novel is public. Readers can see any chapter you mark as 'Published'."
                  : "This novel is completely private. Only you can access the workspace."}
              </div>
            </div>
          </div>

          {/* Chapter Warning */}
          <div className="mb-8 p-4 rounded-xl border border-border/50 bg-secondary/20 text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{publishedCount}</span> chapter{publishedCount !== 1 ? "s" : ""} marked as public.
            
            {publishedCount === 0 && isPublished && (
              <div className="mt-2 flex items-start gap-2 text-amber-500/90 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> 
                <p>Your novel is live, but you have no public chapters! Mark chapters as &quot;published&quot; in the sidebar.</p>
              </div>
            )}
          </div>

          {/* Share Link (Only visible if published) */}
          {isPublished && (
            <div className="mb-8">
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Reader Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 border border-border/50 bg-secondary/30 rounded-lg px-4 py-2.5 text-xs text-foreground outline-none focus:border-foreground/30 transition-colors"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  onClick={handleCopy}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                    copied ? "bg-emerald-500 text-white" : "bg-secondary text-foreground hover:bg-foreground hover:text-background"
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleToggle}
            disabled={busy}
            className={`w-full flex items-center justify-center py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              isPublished 
                ? "bg-secondary text-foreground hover:bg-rose-500 hover:text-white" 
                : "bg-foreground text-background hover:bg-foreground/90"
            }`}
          >
            {busy ? "Processing..." : isPublished ? "Unpublish Novel" : "Publish Novel"}
          </button>
          
        </div>
      </div>
    </div>
  );
}