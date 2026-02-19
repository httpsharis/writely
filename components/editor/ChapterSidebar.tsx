'use client';

import { useState } from 'react';
import { Plus, Trash2, BookOpen, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { ChapterSummary } from '@/lib/api-client';

interface Props {
  chapters: ChapterSummary[];
  activeChapterId: string | null;
  onSelectChapter: (id: string) => void;
  onAddChapter: () => void;
  onDeleteChapter: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onClose?: () => void;
}

const STATUS_TAG: Record<string, { label: string; cls: string }> = {
  draft:     { label: 'DRAFT',     cls: 'bg-draft text-white' },
  published: { label: 'PUBLISHED', cls: 'bg-success text-black' },
};

// ─── 1. MAIN COMPONENT (The Layout Shell) ───────────────────────────

export default function ChapterSidebar({
  chapters, activeChapterId, onSelectChapter, onAddChapter,
  onDeleteChapter, onToggleStatus, onClose,
}: Props) {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  return (
    <aside className="flex h-full flex-col overflow-hidden border-r-[3px] border-black bg-white">
      
      <SidebarHeader onAdd={onAddChapter} onClose={onClose} />

      <div className="custom-scrollbar flex-1 overflow-y-auto p-3">
        {chapters.length === 0 ? (
          <EmptyState />
        ) : (
          chapters.map((ch) => (
            <ChapterCard
              key={ch._id}
              chapter={ch}
              isActive={ch._id === activeChapterId}
              onSelect={() => onSelectChapter(ch._id)}
              onToggleStatus={() => onToggleStatus(ch._id)}
              onDeleteClick={() => setDeleteTarget(ch._id)}
            />
          ))
        )}
      </div>

      {chapters.length > 0 && <MobileAddButton onAdd={onAddChapter} />}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Chapter"
        message="This will permanently delete this chapter and its content. This action cannot be undone."
        onConfirm={() => {
          if (deleteTarget) onDeleteChapter(deleteTarget);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </aside>
  );
}

// ─── 2. SUB-COMPONENTS (The Visual Details) ─────────────────────────

function SidebarHeader({ onAdd, onClose }: { onAdd: () => void; onClose?: () => void }) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-b-[3px] border-black bg-white px-4">
      <h2 className="font-mono text-xs font-bold uppercase tracking-[1.5px]">
        Chapters
      </h2>
      <div className="flex items-center gap-2">
        <button
          onClick={onAdd}
          title="Add new chapter"
          className="inline-flex cursor-pointer items-center gap-1 rounded border-2 border-black bg-black px-2 py-1 font-mono text-[10px] font-bold text-white transition-colors hover:bg-white hover:text-black"
        >
          <Plus size={12} />
          <span className="hidden sm:inline">NEW</span>
        </button>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close chapters"
            className="flex cursor-pointer items-center justify-center rounded border-2 border-transparent p-1 text-gray-500 transition-all hover:border-black hover:text-black lg:hidden"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center opacity-50">
      <BookOpen size={28} />
      <p className="mt-3 font-mono text-[11px] leading-relaxed">
        No chapters yet.<br />Tap NEW to create one.
      </p>
    </div>
  );
}

function ChapterCard({
  chapter, isActive, onSelect, onToggleStatus, onDeleteClick
}: {
  chapter: ChapterSummary; isActive: boolean; onSelect: () => void;
  onToggleStatus: () => void; onDeleteClick: () => void;
}) {
  const st = STATUS_TAG[chapter.status] || STATUS_TAG.draft;

  return (
    <div
      onClick={onSelect}
      className={cn(
        'group relative mb-2 cursor-pointer select-none border-2 border-black bg-white p-3 transition-all',
        'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_black]',
        isActive && '-translate-x-0.5 -translate-y-0.5 bg-primary shadow-[3px_3px_0px_black]',
      )}
    >
      {/* Top row: label + status tag */}
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-[0.5px] opacity-50">
          CH_{String(chapter.order + 1).padStart(2, '0')}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleStatus(); }}
          title={`Click to toggle status (${chapter.status})`}
          className={cn(
            'cursor-pointer rounded-sm px-1.5 py-0.5 font-mono text-[8px] font-bold tracking-wider transition-opacity hover:opacity-80',
            st.cls,
          )}
        >
          {st.label}
        </button>
      </div>

      <div className="pr-5 text-[13px] font-bold leading-snug">{chapter.title}</div>

      <span className="mt-1 block font-mono text-[9px] opacity-40">
        {chapter.wordCount.toLocaleString()} words
      </span>

      {/* Delete */}
      <button
        onClick={(e) => { e.stopPropagation(); onDeleteClick(); }}
        title="Delete chapter"
        className="absolute bottom-2 right-2 cursor-pointer border-none bg-transparent p-0.5 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-danger max-lg:opacity-100"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

function MobileAddButton({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="shrink-0 border-t-2 border-black p-3 lg:hidden">
      <button
        onClick={onAdd}
        className="flex w-full cursor-pointer items-center justify-center gap-1.5 border-2 border-black bg-black py-2.5 font-mono text-[11px] font-bold text-white transition-colors hover:bg-white hover:text-black"
      >
        <Plus size={14} />
        ADD CHAPTER
      </button>
    </div>
  );
}