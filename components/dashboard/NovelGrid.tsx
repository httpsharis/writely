'use client';

import { BookOpen } from 'lucide-react';
import { NovelCard } from './NovelCard';
import { Spinner } from '@/components/ui/Spinner';
import type { NovelData } from '@/lib/api-client';

interface NovelGridProps {
  novels: NovelData[];
  loading: boolean;
  onDelete: (novel: NovelData) => void;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-16 text-center opacity-50">
      <BookOpen size={36} strokeWidth={1.5} className="dark:text-neutral-400" />
      <p className="mt-3 font-mono text-xs dark:text-neutral-400">
        No novels yet. Create your first one!
      </p>
    </div>
  );
}

export function NovelGrid({ novels, loading, onDelete }: NovelGridProps) {
  if (loading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (novels.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
      {novels.map((novel) => (
        <NovelCard key={novel._id} novel={novel} onDelete={onDelete} />
      ))}
    </div>
  );
}
