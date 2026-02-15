'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, BookOpen, Globe, MessageSquare, Pencil } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { NovelData } from '@/lib/api-client';
import type { SaveStatus } from '@/hooks/useEditor';

interface Props {
  novel: NovelData | null;
  wordCount: number;
  saveStatus: SaveStatus;
  commentCount: number;
  onToggleLeft?: () => void;
  onToggleRight?: () => void;
  onOpenPublish?: () => void;
  onRenameNovel?: (title: string) => void;
}

const STATUS_STYLES: Record<SaveStatus, { label: string; cls: string }> = {
  idle:   { label: 'READY',     cls: 'bg-gray-100 border-gray-300' },
  saving: { label: 'SAVING...', cls: 'bg-secondary text-white border-secondary' },
  saved:  { label: 'SAVED',     cls: 'bg-success text-black border-success' },
  error:  { label: 'ERROR',     cls: 'bg-danger text-white border-danger' },
};

export default function MetaStrip({
  novel,
  wordCount,
  saveStatus,
  commentCount,
  onToggleLeft,
  onToggleRight,
  onOpenPublish,
  onRenameNovel,
}: Props) {
  const { label, cls } = STATUS_STYLES[saveStatus];

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function startEdit() {
    setEditValue(novel?.title ?? '');
    setEditing(true);
  }

  function commitEdit() {
    setEditing(false);
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== novel?.title) {
      onRenameNovel?.(trimmed);
    }
  }

  return (
    <div className="flex h-11 shrink-0 items-center gap-2 border-b-[3px] border-black bg-white px-2 font-mono text-[10px] sm:gap-3 sm:px-3 md:gap-5 md:px-4">
      {/* Mobile: chapters toggle */}
      <button
        onClick={onToggleLeft}
        title="Chapters"
        aria-label="Toggle chapters"
        className="inline-flex cursor-pointer items-center justify-center rounded border-2 border-transparent p-1 transition-all hover:border-black hover:bg-gray-100 lg:hidden"
      >
        <BookOpen size={15} />
      </button>

      <Link
        href="/"
        title="Back to novels"
        className="inline-flex items-center justify-center rounded border-2 border-transparent p-1 text-black transition-all hover:border-black hover:bg-gray-100"
      >
        <ArrowLeft size={15} />
      </Link>

      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitEdit();
            if (e.key === 'Escape') setEditing(false);
          }}
          spellCheck={false}
          className="max-w-35 border-b-2 border-secondary bg-transparent font-bold uppercase outline-none sm:max-w-50 md:max-w-65"
        />
      ) : (
        <button
          onClick={startEdit}
          title="Click to rename novel"
          className="group flex max-w-30 cursor-pointer items-center gap-1 truncate border-none bg-transparent font-bold uppercase sm:max-w-45 md:max-w-62.5"
        >
          <span className="truncate">{novel?.title || '...'}</span>
          <Pencil size={9} className="shrink-0 opacity-0 transition-opacity group-hover:opacity-60" />
        </button>
      )}

      <span className="hidden border border-gray-300 bg-gray-100 px-1.5 py-px text-[9px] uppercase tracking-[0.5px] md:inline">
        {novel?.status?.toUpperCase() || 'DRAFT'}
      </span>

      {/* Publish button */}
      <button
        onClick={onOpenPublish}
        title={novel?.isPublished ? 'Published — click to manage' : 'Publish novel'}
        className={cn(
          'hidden cursor-pointer items-center gap-1 border-2 border-black px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider transition-all sm:inline-flex',
          'hover:-translate-x-px hover:-translate-y-px hover:shadow-[2px_2px_0px_black]',
          novel?.isPublished ? 'bg-success' : 'bg-gray-100',
        )}
      >
        <Globe size={10} />
        {novel?.isPublished ? 'LIVE' : 'PUBLISH'}
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      <span className="hidden sm:inline">
        <b>{wordCount.toLocaleString()}</b> words
      </span>

      <span className={cn('border px-1.5 py-px text-[9px] uppercase tracking-[0.5px]', cls)}>
        {label}
      </span>

      {/* Mobile: tools toggle with comment badge */}
      <button
        onClick={onToggleRight}
        title="Tools"
        aria-label="Toggle tools"
        className="relative inline-flex cursor-pointer items-center justify-center rounded border-2 border-transparent p-1 transition-all hover:border-black hover:bg-gray-100 lg:hidden"
      >
        <MessageSquare size={15} />
        {commentCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[8px] font-bold text-white">
            {commentCount > 9 ? '9+' : commentCount}
          </span>
        )}
      </button>
    </div>
  );
}
