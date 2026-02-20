"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, BookOpen, Trash2 } from "lucide-react";
import { createChapter, fetchChapters } from "@/lib/api-client";
import type { ChaptersManagerProps } from "@/types/novelDashboard";

export default function ChaptersManager({ novelId, chapters, setChapters, onDeleteClick }: ChaptersManagerProps) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    setCreating(true);
    await createChapter(novelId);
    setChapters(await fetchChapters(novelId));
    setCreating(false);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono text-[13px] font-bold tracking-[2px]">CHAPTERS</h2>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="inline-flex cursor-pointer items-center gap-1 border-2 border-black bg-black px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white transition-all hover:bg-white hover:text-black disabled:opacity-50"
        >
          <Plus size={12} /> {creating ? "Adding..." : "Add Chapter"}
        </button>
      </div>
      {chapters.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 py-12 text-center">
          <BookOpen size={32} className="mx-auto mb-3 text-gray-300" />
          <p className="font-mono text-xs text-gray-400">No chapters yet</p>
        </div>
      ) : (
        <div className="divide-y-2 divide-black border-2 border-black">
          {chapters.map((ch, i) => (
            <div key={ch._id} className="group flex items-center justify-between bg-white px-4 py-3 hover:bg-gray-50">
              <button
                onClick={() => router.push(`/editor/${novelId}?chapter=${ch._id}`)}
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
              >
                <span className="shrink-0 font-mono text-[10px] font-bold text-gray-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="truncate text-sm font-bold">{ch.title}</span>
                <span
                  className={`shrink-0 border px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider ${
                    ch.status === "published" ? "border-success/40 bg-success/10 text-success" : "border-gray-200 text-gray-400"
                  }`}
                >
                  {ch.status}
                </span>
              </button>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-gray-400">{ch.wordCount?.toLocaleString() ?? 0} w</span>
                <button
                  onClick={() => onDeleteClick(ch)}
                  className="cursor-pointer text-gray-300 opacity-0 group-hover:opacity-100 hover:text-danger max-md:opacity-100"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}