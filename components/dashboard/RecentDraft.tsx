"use client";

import Link from "next/link";
import { PenTool, User, Globe } from "lucide-react";

const DRAFTS = [
  { title: "Chapter 12: The Fall", type: "Chapter", time: "2 hours ago", icon: PenTool },
  { title: "Protagonist Arc", type: "Character", time: "Yesterday", icon: User },
  { title: "Magic System Rules", type: "World", time: "Oct 24", icon: Globe },
];

type DraftProps = {
  id: string;
  title: string;
  type: string;
  time: string;
  icon?: any; // Lucide icon
};

export function RecentDrafts({ drafts }: { drafts?: DraftProps[] }) {
  const displayDrafts = drafts?.length ? drafts : DRAFTS;

  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-bold tracking-tight text-black dark:text-white">Recent Notes</h3>
        <Link href="/universe" className="text-xs font-medium text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors">
          View all
        </Link>
      </div>
      
      <div className="space-y-2">
        {displayDrafts.map((draft, i) => {
          const Icon = draft.icon || PenTool;
          return (
            <Link 
              key={i}
              href={`/editor/${i}`}
              className="flex items-center justify-between p-4 bg-white dark:bg-[#111] border border-black/[0.04] dark:border-white/[0.04] rounded-2xl hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/50 dark:text-white/50 group-hover:bg-indigo-500/10 group-hover:text-indigo-500 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-black dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {draft.title}
                  </h4>
                  <p className="text-[11px] text-black/40 dark:text-white/40 font-medium mt-0.5">
                    Edited {draft.time}
                  </p>
                </div>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-black/30 dark:text-white/30 px-2 py-1 bg-black/5 dark:bg-white/5 rounded-md">
                {draft.type}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}