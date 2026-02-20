"use client";

import { FileText, BarChart3, Users, Globe } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import type { NovelStatsProps } from "@/types/novelDashboard";

export default function NovelStats({
  novel,
  chapters,
  totalWords,
  goalWords,
  progressPct,
  publishedCount,
  draftCount,
}: NovelStatsProps) {
  return (
    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard
        icon={<FileText size={16} />}
        label="Chapters"
        value={chapters.length}
        sub={`${publishedCount} published · ${draftCount} draft`}
      />
      <StatCard
        icon={<BarChart3 size={16} />}
        label="Words"
        value={totalWords.toLocaleString()}
        sub={
          goalWords > 0
            ? `${progressPct}% of ${goalWords.toLocaleString()} goal`
            : "No goal set"
        }
      />
      <StatCard
        icon={<Users size={16} />}
        label="Characters"
        value={novel.characters?.length ?? 0}
      />
      <StatCard
        icon={<Globe size={16} />}
        label="Published"
        value={novel.isPublished ? "Yes" : "No"}
        sub={novel.isPublished ? `${publishedCount} live` : undefined}
      />
    </div>
  );
}