"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { updateNovel } from "@/lib/api-client";
import type { NovelData } from "@/lib/api-client";

interface NovelIdentityProps {
  novel: NovelData;
  setNovel: (n: NovelData) => void;
}

export default function NovelIdentity({ novel, setNovel }: NovelIdentityProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [editingDesc, setEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState("");

  async function handleUpdateTitle() {
    if (!titleValue.trim() || titleValue.trim() === novel.title)
      return setEditingTitle(false);
    setNovel(await updateNovel(novel._id, { title: titleValue.trim() }));
    setEditingTitle(false);
  }

  async function handleUpdateDesc() {
    setNovel(await updateNovel(novel._id, { description: descValue.trim() }));
    setEditingDesc(false);
  }

  return (
    <div className="mb-8">
      <div className="mb-4">
        {editingTitle ? (
          <input
            autoFocus
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleUpdateTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUpdateTitle();
              if (e.key === "Escape") setEditingTitle(false);
            }}
            className="w-full border-b-[3px] border-black bg-transparent text-3xl font-extrabold uppercase outline-none md:text-4xl"
          />
        ) : (
          <button
            onClick={() => {
              setTitleValue(novel.title);
              setEditingTitle(true);
            }}
            className="group flex cursor-pointer items-center gap-2 text-left"
          >
            <h1 className="text-3xl font-extrabold uppercase md:text-4xl">
              {novel.title}
            </h1>
            <Pencil
              size={16}
              className="shrink-0 text-gray-300 transition-colors group-hover:text-black"
            />
          </button>
        )}
      </div>

      <div>
        <label className="mb-1 block font-mono text-[9px] font-bold uppercase tracking-[2px] text-gray-400">
          Description
        </label>
        {editingDesc ? (
          <div className="space-y-2">
            <textarea
              autoFocus
              value={descValue}
              onChange={(e) => setDescValue(e.target.value)}
              rows={3}
              className="w-full resize-none border-2 border-black bg-white p-3 text-sm leading-relaxed outline-none"
              onKeyDown={(e) => {
                if (e.key === "Escape") setEditingDesc(false);
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdateDesc}
                className="cursor-pointer border-2 border-black bg-black px-3 py-1 font-mono text-[10px] font-bold text-white transition-colors hover:bg-white hover:text-black"
              >
                SAVE
              </button>
              <button
                onClick={() => setEditingDesc(false)}
                className="cursor-pointer border-2 border-black bg-white px-3 py-1 font-mono text-[10px] font-bold transition-colors hover:bg-gray-100"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              setDescValue(novel.description ?? "");
              setEditingDesc(true);
            }}
            className="group flex w-full cursor-pointer items-start gap-2 text-left"
          >
            <p className="text-sm leading-relaxed text-gray-500">
              {novel.description || "No description yet — click to add one."}
            </p>
            <Pencil
              size={12}
              className="mt-0.5 shrink-0 text-gray-300 transition-colors group-hover:text-black"
            />
          </button>
        )}
      </div>
    </div>
  );
}
