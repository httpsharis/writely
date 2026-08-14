"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Image as ImageIcon, Target, Link2, Check } from "lucide-react";
import InlineEdit from "@/components/ui/InlineEdit";
import type { ExtendedProject } from "../hooks/useProjectHub";

interface ProjectSidebarProps {
  project: ExtendedProject;
  isReadOnly: boolean;
  isUploading: boolean;
  onUpdate: <K extends keyof ExtendedProject>(
    field: K,
    value: ExtendedProject[K],
  ) => Promise<void>;
  onFileUpload: (file: File) => Promise<boolean | undefined>;
}

export function ProjectSidebar({
  project,
  isReadOnly,
  isUploading,
  onUpdate,
  onFileUpload,
}: ProjectSidebarProps) {
  const [coverInput, setCoverInput] = useState("");
  const [showCoverInput, setShowCoverInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const slug = project?.slug;
  const id = project?._id;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        setShareUrl(`${window.location.origin}/novel/${slug || id}`);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [slug, id]);

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (await onFileUpload(file))) setShowCoverInput(false);
  };

  const handleLinkSave = () => {
    if (coverInput.trim()) {
      onUpdate("coverImage", coverInput);
      setShowCoverInput(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* 🟢 MOBILE FIX: Constrained width on mobile so it doesn't take up the whole screen */}
      <div className="group relative mb-6 mx-auto lg:mx-0 w-48 sm:w-56 lg:w-full flex aspect-[2/3] flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#1b1a21]">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt="Cover"
            fill
            sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 264px"
            className="object-cover"
          />
        ) : (
          <>
            <ImageIcon className="h-8 w-8 opacity-50 text-[#5c5868]" />
            <span className="text-[13px] text-[#5c5868] mt-2">No cover</span>
          </>
        )}

        {!isReadOnly && !showCoverInput && (
          <div
            onClick={() => setShowCoverInput(true)}
            className="absolute inset-0 flex cursor-pointer items-center justify-center bg-[#131217]/80 text-xs font-medium text-[#c9975a] opacity-0 transition-opacity group-hover:opacity-100"
          >
            Upload Cover
          </div>
        )}

        {showCoverInput && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#131217]/95 p-4">
            <input
              autoFocus
              value={coverInput}
              onChange={(e) => setCoverInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLinkSave()}
              placeholder="https://..."
              className="w-full rounded border border-white/10 bg-[#1b1a21] px-2 py-1.5 text-[11px] outline-none"
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full rounded bg-[#29272f] py-1.5 text-[10px] transition-colors hover:bg-[#c9975a] hover:text-[#131217]"
            >
              {isUploading ? "Uploading..." : "Upload from Computer"}
            </button>
            <div className="mt-1 flex w-full gap-2">
              <button
                onClick={() => setShowCoverInput(false)}
                className="flex-1 text-[10px] text-[#948fa0]"
              >
                Cancel
              </button>
              <button
                onClick={handleLinkSave}
                className="flex-1 rounded bg-[#c9975a] py-1 text-[10px] font-bold text-[#131217]"
              >
                Save Link
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
        {isReadOnly ? (
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#c9975a]">
            {project.status}
          </span>
        ) : (
          <select
            value={project.status || "draft"}
            onChange={(e) =>
              onUpdate(
                "status",
                e.target.value as "draft" | "published" | "archived",
              )
            }
            className="cursor-pointer bg-transparent text-[10px] font-bold uppercase tracking-widest text-[#c9975a] outline-none"
          >
            <option value="draft" className="bg-[#131217]">
              Drafting
            </option>
            <option value="published" className="bg-[#131217]">
              Published
            </option>
            <option value="archived" className="bg-[#131217]">
              Archived
            </option>
          </select>
        )}

        <div className="group flex items-center gap-2">
          <Target className="h-3.5 w-3.5 text-editor-text-tertiary" />
          <InlineEdit
            isReadOnly={isReadOnly}
            type="number"
            value={String(project.targetWords ?? 5000)}
            onSave={(val) => onUpdate("targetWords", parseInt(val, 10) || 0)}
            className="font-['JetBrains_Mono'] text-[11px] text-editor-text-tertiary group-hover:text-editor-text-primary"
          />
        </div>
      </div>

      <div className="mb-4 rounded-lg border border-white/5 bg-white/5 p-3">
        <label className="mb-2 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-[#5c5868]">
          <span>
            Public Link ({project.type === "novel" ? "Novel" : "Chapter"}) -{" "}
            {project.title}
          </span>
          {project.status !== "published" && (
            <span className="text-rose-400/80">Draft</span>
          )}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 rounded border border-white/10 bg-black/20 px-2 py-1.5 text-[10px] text-[#ede9e2] outline-none"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button
            onClick={handleCopy}
            className="flex items-center justify-center rounded bg-white/10 p-1.5 text-[#ede9e2] transition-colors hover:bg-[#ede9e2] hover:text-black"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Link2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      <h4 className="mb-2 mt-2 text-[10px] font-bold uppercase tracking-widest text-editor-text-tertiary">
        Synopsis
      </h4>
      <InlineEdit
        isReadOnly={isReadOnly}
        multiline
        placeholder={isReadOnly ? "" : "Write a synopsis..."}
        value={project.synopsis || ""}
        onSave={(val) => onUpdate("synopsis", val)}
        className="-ml-2 m-0 p-2 font-serif text-[14.5px] italic leading-[1.7] text-editor-text-secondary"
      />
    </div>
  );
}