'use client';

import { Trash2, Pencil } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { NoteData } from '@/lib/api-client';

// ─── Helpers ────────────────────────────────────────────────────────

/** Extract plain-text preview from Tiptap JSON content. */
function extractPreview(content: Record<string, unknown>): string {
  if (!content || typeof content !== 'object') return '';
  const nodes = content.content as Array<{ type: string; content?: Array<{ text?: string }> }> | undefined;
  if (!Array.isArray(nodes)) return '';
  return nodes
    .flatMap((node) => node.content?.map((c) => c.text ?? '') ?? [])
    .join(' ')
    .slice(0, 300);
}

// ─── Props ──────────────────────────────────────────────────────────

interface NoteCardProps {
  note: NoteData;
  onEdit: (note: NoteData) => void;
  onDelete: (note: NoteData) => void;
}

// ─── Component ──────────────────────────────────────────────────────

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const preview = extractPreview(note.content);

  return (
    <div
      onClick={() => onEdit(note)}
      className="group relative cursor-pointer break-inside-avoid border-2 border-black bg-white p-5 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000000] dark:border-white/20 dark:bg-[#121212] dark:hover:shadow-[4px_4px_0px_#333333]"
    >
      {/* Novel tag pill */}
      <span className="mb-3 inline-block border-2 border-black bg-[#FFDF00] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-black dark:border-white/30">
        {note.novelTitle ?? 'Untagged Idea'}
      </span>

      {/* Title */}
      <h3 className="mb-2 text-base font-extrabold uppercase leading-tight dark:text-white">
        {note.title}
      </h3>

      {/* Content preview (3-line clamp) */}
      {preview && (
        <p className="mb-3 line-clamp-3 font-serif text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          {preview}
        </p>
      )}

      {/* Metadata */}
      <div className="font-mono text-[10px] text-neutral-400">
        {formatDate(note.createdAt)}
      </div>

      {/* Action buttons — appear on hover */}
      <div className="absolute right-3 top-3 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          title="Edit note"
          onClick={(e) => { e.stopPropagation(); onEdit(note); }}
          className="cursor-pointer border-none bg-transparent p-1 text-neutral-300 transition-colors hover:text-black dark:text-neutral-600 dark:hover:text-white"
        >
          <Pencil size={13} />
        </button>
        <button
          title="Delete note"
          onClick={(e) => { e.stopPropagation(); onDelete(note); }}
          className="cursor-pointer border-none bg-transparent p-1 text-neutral-300 transition-colors hover:text-danger dark:text-neutral-600 dark:hover:text-danger"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
