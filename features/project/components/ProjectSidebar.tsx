"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Image as ImageIcon, Target, Link2, Check, UploadCloud } from "lucide-react";
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
      onUpdate("coverImage", coverInput.trim());
      setShowCoverInput(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Responsive Cover Art Container */}
      <div className="group relative mb-6 mx-auto lg:mx-0 w-48 sm:w-56 lg:w-full flex aspect-[2/3] flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-secondary/20 shadow-sm">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt="Cover"
            fill
            sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 280px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <ImageIcon className="h-8 w-8 opacity-40 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-2 font-medium">No cover art</span>
          </>
        )}

        {!isReadOnly && !showCoverInput && (
          <div
            onClick={() => setShowCoverInput(true)}
            className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-2 bg-black/60 text-xs font-bold uppercase tracking-wider text-white opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-[2px]"
          >
            <UploadCloud className="w-5 h-5 text-brand" />
            <span>Update Cover</span>
          </div>
        )}

        {showCoverInput && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-card/95 p-4 backdrop-blur-md">
            <input
              autoFocus
              value={coverInput}
              onChange={(e) => setCoverInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLinkSave()}
              placeholder="Paste image URL https://..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-brand"
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
              className="w-full rounded-lg bg-secondary py-2 text-xs font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              {isUploading ? "Uploading..." : "Upload from Device"}
            </button>
            <div className="mt-1 flex w-full gap-2">
              <button
                onClick={() => setShowCoverInput(false)}
                className="flex-1 text-xs text-muted-foreground hover:text-foreground py-1"
              >
                Cancel
              </button>
              <button
                onClick={handleLinkSave}
                className="flex-1 rounded-lg bg-foreground py-1.5 text-xs font-bold text-background hover:bg-foreground/90 transition-all"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status & Target Words */}
      <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
        {isReadOnly ? (
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand">
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
            className="cursor-pointer bg-transparent text-[10px] font-bold uppercase tracking-widest text-brand outline-none hover:opacity-80"
          >
            <option value="draft" className="bg-card text-foreground">
              Drafting
            </option>
            <option value="published" className="bg-card text-foreground">
              Published
            </option>
            <option value="archived" className="bg-card text-foreground">
              Archived
            </option>
          </select>
        )}

        <div className="group flex items-center gap-2">
          <Target className="h-3.5 w-3.5 text-muted-foreground" />
          <InlineEdit
            isReadOnly={isReadOnly}
            type="number"
            value={String(project.targetWords ?? 5000)}
            onSave={(val) => onUpdate("targetWords", parseInt(val, 10) || 0)}
            className="font-mono text-xs text-muted-foreground group-hover:text-foreground"
          />
        </div>
      </div>

      {/* Public Share URL */}
      <div className="mb-6 rounded-xl border border-border bg-secondary/15 p-3.5">
        <label className="mb-2 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
          <span>Public Link ({project.type === "novel" ? "Novel" : "Chapter"})</span>
          {project.status !== "published" && (
            <span className="text-amber-500 font-bold">Draft</span>
          )}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 rounded-lg border border-border bg-background/80 px-2.5 py-1.5 font-mono text-[11px] text-foreground outline-none select-all"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button
            onClick={handleCopy}
            title="Copy Public Link"
            className="flex items-center justify-center rounded-lg bg-secondary p-2 text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Link2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Synopsis Section */}
      <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Synopsis
      </h4>
      <InlineEdit
        isReadOnly={isReadOnly}
        multiline
        placeholder={isReadOnly ? "No synopsis provided." : "Write a brief synopsis..."}
        value={project.synopsis || ""}
        onSave={(val) => onUpdate("synopsis", val)}
        className="-ml-2 m-0 p-2 font-serif text-[14.5px] italic leading-[1.7] text-muted-foreground hover:text-foreground"
      />
    </div>
  );
}