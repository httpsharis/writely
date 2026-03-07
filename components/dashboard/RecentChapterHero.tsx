'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Clock, FileText } from 'lucide-react';
import type { RecentChapterData } from '@/types/dashboard';
import { formatDate } from '@/lib/utils';

interface RecentChapterHeroProps {
  chapter: RecentChapterData | null;
  loading: boolean;
}

function HeroSkeleton() {
  return (
    <div className="animate-pulse border-2 border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900 lg:p-10">
      <div className="mb-4 h-3 w-32 rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="mb-3 h-8 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="mb-2 h-4 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
      <div className="mb-2 h-4 w-5/6 rounded bg-neutral-100 dark:bg-neutral-800" />
      <div className="h-4 w-2/3 rounded bg-neutral-100 dark:bg-neutral-800" />
    </div>
  );
}

function HeroEmpty() {
  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 bg-white px-8 py-16 text-center dark:border-neutral-700 dark:bg-neutral-900">
      <FileText size={36} className="mb-4 text-neutral-300 dark:text-neutral-600" />
      <p className="mb-1 font-mono text-sm font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        No chapters yet
      </p>
      <p className="text-xs text-neutral-400 dark:text-neutral-600">
        Create a novel and start writing to see your latest work here.
      </p>
    </div>
  );
}

export function RecentChapterHero({ chapter, loading }: RecentChapterHeroProps) {
  const router = useRouter();

  if (loading) return <HeroSkeleton />;
  if (!chapter) return <HeroEmpty />;

  function handleContinue() {
    if (!chapter) return;
    router.push(`/editor/${chapter.novelId}`);
  }

  return (
    <div className="group border-2 border-black bg-white p-8 transition-all hover:shadow-[6px_6px_0px_black] dark:border-neutral-700 dark:bg-neutral-900 dark:hover:shadow-[6px_6px_0px_rgba(255,255,255,0.1)] lg:p-10">
      {/* Novel name badge */}
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-block border-2 border-black bg-primary text-black px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[2px]">
          {chapter.novelTitle}
        </span>
        <span className="flex items-center gap-1 font-mono text-[10px] text-neutral-400">
          <Clock size={10} />
          {formatDate(chapter.updatedAt)}
        </span>
      </div>

      {/* Chapter title */}
      <h2 className="mb-5 text-2xl font-extrabold leading-tight tracking-tight dark:text-white lg:text-3xl">
        {chapter.chapterTitle}
      </h2>

      {/* Content preview — monospace for that "manuscript" feel */}
      <p className="mb-8 line-clamp-3 max-w-2xl font-mono text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
        &ldquo;{chapter.contentPreview}&rdquo;
      </p>

      {/* Meta + CTA */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={handleContinue}
          className="inline-flex cursor-pointer items-center gap-2 border-2 border-black bg-primary text-black px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0px_black]"
        >
          Continue Writing
          <ArrowRight size={14} />
        </button>
        <span className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
          {chapter.wordCount.toLocaleString()} words
        </span>
      </div>
    </div>
  );
}
