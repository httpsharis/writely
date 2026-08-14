"use client";

import { useState, useEffect } from "react";
import { Globe, Link2, X, Check, AlertTriangle } from "lucide-react";
import { useEditorContext } from "@/features/editor/context/EditorContext";

export default function PublishDialog() {
  const {
    novel,
    publishedCount,
    handleToggleNovelPublish,
    setIsPublishModalOpen,
  } = useEditorContext();

  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined" && novel) {
        setShareUrl(
          `${window.location.origin}/novel/${novel.slug || novel._id}`,
        );
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [novel]);

  const handleToggle = async () => {
    setBusy(true);
    try {
      await handleToggleNovelPublish();
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPublished = novel?.status === "published";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4">
      <div className="animate-in fade-in zoom-in-95 relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#1b1a21] shadow-2xl duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4 sm:px-6">
          <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#5c5868]">
            <Globe className="h-3.5 w-3.5" />
            Publish & Share
          </h2>
          <button
            onClick={() => setIsPublishModalOpen(false)}
            className="text-[#5c5868] transition-colors hover:text-[#ede9e2]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 md:p-8">
          {/* Status Badge */}
          <div className="mb-6 flex items-start gap-4 sm:mb-8">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                isPublished
                  ? "bg-[#7cbf8e]/10 text-[#7cbf8e]"
                  : "bg-white/5 text-[#5c5868]"
              }`}
            >
              <Globe className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-1">
              <div
                className={`text-xs font-bold uppercase tracking-widest ${
                  isPublished ? "text-[#7cbf8e]" : "text-[#ede9e2]"
                }`}
              >
                {isPublished ? "Published Live" : "Private Draft"}
              </div>
              <div className="text-sm leading-relaxed text-[#948fa0]">
                {isPublished
                  ? "Your novel is public. Readers can see any chapter you mark as 'Published'."
                  : "This novel is completely private. Only you can access the workspace."}
              </div>
            </div>
          </div>

          {/* Chapter Warning */}
          <div className="mb-6 rounded-xl border border-white/5 bg-white/5 p-4 text-sm text-[#948fa0] sm:mb-8">
            <span className="font-bold text-[#ede9e2]">
              {publishedCount || 0}
            </span>{" "}
            chapter{(publishedCount || 0) !== 1 ? "s" : ""} marked as public.
            {(publishedCount || 0) === 0 && isPublished && (
              <div className="mt-2 flex items-start gap-2 text-[11px] text-[#c9975a]">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Your novel is live, but you have no public chapters! Mark
                  chapters as &quot;published&quot; in the header.
                </p>
              </div>
            )}
          </div>

          {/* Share Link */}
          {isPublished && (
            <div className="mb-6 sm:mb-8">
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#5c5868]">
                Reader Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-xs text-[#ede9e2] outline-none transition-colors focus:border-white/30 sm:px-4"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  onClick={handleCopy}
                  className={`flex shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold uppercase tracking-widest transition-all sm:px-4 ${
                    copied
                      ? "bg-[#7cbf8e] text-black"
                      : "bg-white/10 text-[#ede9e2] hover:bg-[#ede9e2] hover:text-black"
                  }`}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Link2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleToggle}
            disabled={busy}
            className={`flex w-full items-center justify-center rounded-full py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
              isPublished
                ? "bg-white/10 text-[#ede9e2] hover:bg-rose-500/20 hover:text-rose-400"
                : "bg-[#ede9e2] text-[#131217] hover:bg-white"
            }`}
          >
            {busy
              ? "Processing..."
              : isPublished
                ? "Unpublish Novel"
                : "Publish Novel"}
          </button>
        </div>
      </div>
    </div>
  );
}
