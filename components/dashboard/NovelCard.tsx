'use client';

import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { NovelData } from '@/lib/api-client';

interface NovelCardProps {
  novel: NovelData;
  onDelete: (novel: NovelData) => void;
}

export function NovelCard({ novel, onDelete }: NovelCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/novel/${novel._id}`)}
      className="group relative cursor-pointer border-2 border-black bg-white p-6 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_black] dark:border-neutral-700 dark:bg-neutral-900 dark:hover:shadow-[4px_4px_0px_rgba(255,255,255,0.1)]"
    >
      <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-neutral-400">
        {novel.status}
      </div>
      <h3 className="mb-2 text-lg font-extrabold uppercase leading-tight dark:text-white">
        {novel.title}
      </h3>
      {novel.description && (
        <p className="mb-3 line-clamp-2 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
          {novel.description}
        </p>
      )}
      <div className="flex gap-4 font-mono text-[10px] text-neutral-400">
        <span>{novel.stats?.currentWordCount?.toLocaleString() ?? 0} words</span>
        <span>{novel.characters?.length ?? 0} characters</span>
        <span>{formatDate(novel.updatedAt)}</span>
      </div>

      <button
        title="Delete novel"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(novel);
        }}
        className="absolute right-4 top-4 cursor-pointer border-none bg-transparent p-1 text-neutral-300 opacity-0 transition-all group-hover:opacity-100 hover:text-danger dark:text-neutral-600 dark:hover:text-danger"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
