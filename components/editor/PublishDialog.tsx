"use client";

import { useState } from "react";
import { Globe, Link2, X, Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NovelData } from "@/lib/api-client";

interface Props {
  novel: NovelData;
  publishedChapterCount: number;
  onTogglePublish: () => Promise<void>;
  onClose: () => void;
}

export default function PublishDialog({
  novel,
  publishedChapterCount,
  onTogglePublish,
  onClose,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const isPublished = novel.isPublished;
  // WINDOW: JS tool means screen of the computer and its functions
  // TYPEOF: JS tool define the typeof
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/read/${novel._id}`
      : "";

  async function handleToggle() {
    setBusy(true);
    try {
      await onTogglePublish();
    } finally {
      setBusy(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Look how easy this is to read now!
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md border-[3px] border-black bg-white shadow-[6px_6px_0px_black]">
        <DialogHeader onClose={onClose} />

        <div className="p-5">
          <StatusBadge isPublished={isPublished} />
          <ChapterWarning
            count={publishedChapterCount}
            isPublished={isPublished}
          />
          <ToggleButton
            isPublished={isPublished}
            busy={busy}
            onClick={handleToggle}
          />

          {isPublished && (
            <ShareLink url={shareUrl} copied={copied} onCopy={handleCopy} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 2. SUB-COMPONENTS (Hidden away at the bottom) ──────────────────

function DialogHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between border-b-[3px] border-black bg-primary px-4 py-3">
      <h2 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[2px]">
        <Globe size={14} /> PUBLISH & SHARE
      </h2>
      <button
        onClick={onClose}
        className="cursor-pointer transition-transform hover:scale-110"
      >
        <X size={16} />
      </button>
    </div>
  );
}

function StatusBadge({ isPublished }: { isPublished: boolean }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center border-2 border-black",
          isPublished ? "bg-success text-black" : "bg-gray-200 text-gray-500",
        )}
      >
        <Globe size={18} />
      </div>
      <div>
        <div className="font-mono text-[11px] font-bold uppercase tracking-wider">
          {isPublished ? "PUBLISHED" : "UNPUBLISHED"}
        </div>
        <div className="text-xs text-gray-500">
          {isPublished
            ? "Readers can see your published chapters"
            : "Only you can access this novel"}
        </div>
      </div>
    </div>
  );
}

function ChapterWarning({
  count,
  isPublished,
}: {
  count: number;
  isPublished: boolean;
}) {
  return (
    <div className="mb-4 border-2 border-gray-200 bg-gray-50 px-3 py-2.5 font-mono text-[10px]">
      <span className="font-bold">{count}</span> chapter{count !== 1 ? "s" : ""}{" "}
      marked as published
      {count === 0 && !isPublished && (
        <div className="mt-1 flex items-center gap-1 text-secondary">
          <AlertTriangle size={10} /> Mark chapters as &quot;published&quot; in
          the sidebar first
        </div>
      )}
    </div>
  );
}

function ToggleButton({
  isPublished,
  busy,
  onClick,
}: {
  isPublished: boolean;
  busy: boolean;
  onClick: () => void;
}) {
  const buttonText = busy
    ? "Processing..."
    : isPublished
      ? "Unpublish Novel"
      : "Publish Novel";

  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={cn(
        "mb-4 w-full cursor-pointer border-2 border-black py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all",
        "hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_black]",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0",
        isPublished ? "bg-gray-200 text-black" : "bg-success text-black",
      )}
    >
      {buttonText}
    </button>
  );
}

function ShareLink({
  url,
  copied,
  onCopy,
}: {
  url: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-gray-500">
        Share Link
      </label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={url}
          className="flex-1 border-2 border-black bg-gray-50 px-2.5 py-2 font-mono text-[11px] outline-none"
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
        <button
          onClick={onCopy}
          className={cn(
            "flex cursor-pointer items-center gap-1 border-2 border-black px-3 py-2 font-mono text-[10px] font-bold uppercase transition-all",
            "hover:-translate-x-px hover:-translate-y-px hover:shadow-[2px_2px_0px_black]",
            copied ? "bg-success" : "bg-primary",
          )}
        >
          {copied ? <Check size={12} /> : <Link2 size={12} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
