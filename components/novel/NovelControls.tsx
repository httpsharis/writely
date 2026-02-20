"use client";

import { useState } from "react";
import { Globe, Check, Copy, Pencil } from "lucide-react";
import { updateNovel } from "@/lib/api-client";
import type { NovelControlsProps } from "@/types/novelDashboard";
import type { ProjectStatus } from "@/types/project";

const STATUS_OPTIONS: ProjectStatus[] = [
  "planning",
  "drafting",
  "editing",
  "completed",
];

const STATUS_COLORS: Record<ProjectStatus, string> = {
  planning: "bg-blue-100 text-blue-700 border-blue-300",
  drafting: "bg-yellow-100 text-yellow-700 border-yellow-300",
  editing: "bg-purple-100 text-purple-700 border-purple-300",
  completed: "bg-green-100 text-green-700 border-green-300",
};

export default function NovelControls({ novel, setNovel, goalWords }: NovelControlsProps) {
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalValue, setGoalValue] = useState("");
  const [copied, setCopied] = useState(false);

  return (
    <div className="mb-8 flex flex-wrap items-start gap-6">
      <div>
        <label className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-[2px] text-gray-400">
          Status
        </label>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={async () =>
                setNovel(await updateNovel(novel._id, { status: s }))
              }
              className={`cursor-pointer border-2 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider transition-all ${
                novel.status === s
                  ? STATUS_COLORS[s] + " border-current"
                  : "border-gray-200 bg-white text-gray-400 hover:border-gray-400 hover:text-gray-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-[2px] text-gray-400">
          Publish
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={async () =>
              setNovel(
                await updateNovel(novel._id, {
                  isPublished: !novel.isPublished,
                })
              )
            }
            className={`cursor-pointer border-2 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-all ${
              novel.isPublished
                ? "border-success bg-success/10 text-success"
                : "border-gray-300 bg-white text-gray-400 hover:border-black"
            }`}
          >
            <Globe size={12} className="mr-1.5 inline" />{" "}
            {novel.isPublished ? "Published" : "Unpublished"}
          </button>
          {novel.isPublished && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/read/${novel._id}`
                );
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="inline-flex cursor-pointer items-center gap-1 border-2 border-gray-300 bg-white px-2.5 py-1.5 font-mono text-[10px] font-bold transition-all hover:border-black"
            >
              {copied ? (
                <Check size={12} className="text-success" />
              ) : (
                <Copy size={12} />
              )}{" "}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          )}
        </div>
      </div>
      <div>
        <label className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-[2px] text-gray-400">
          Word Goal
        </label>
        {editingGoal ? (
          <input
            autoFocus
            type="number"
            value={goalValue}
            onChange={(e) => setGoalValue(e.target.value)}
            onBlur={async () => {
              setNovel(
                await updateNovel(novel._id, {
                  stats: { goalWordCount: parseInt(goalValue) || 0 },
                })
              );
              setEditingGoal(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
              if (e.key === "Escape") setEditingGoal(false);
            }}
            className="w-28 border-2 border-black bg-white px-2 py-1 font-mono text-[12px] outline-none"
            min={0}
          />
        ) : (
          <button
            onClick={() => {
              setGoalValue(String(goalWords));
              setEditingGoal(true);
            }}
            className="group flex cursor-pointer items-center gap-1.5"
          >
            <span className="font-mono text-sm font-bold">
              {goalWords > 0 ? goalWords.toLocaleString() : "—"}
            </span>
            <Pencil
              size={10}
              className="text-gray-300 transition-colors group-hover:text-black"
            />
          </button>
        )}
      </div>
    </div>
  );
}