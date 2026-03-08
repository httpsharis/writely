'use client';

import { useState, useEffect, useCallback } from 'react';
import { StickyNote, Plus, Trash2, Pencil, X, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { fetchNotes, createNote, updateNote, deleteNote } from '@/lib/api-client';
import type { NoteData } from '@/lib/api-client';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

// ─── Props ──────────────────────────────────────────────────────────

interface EditorNotesTabProps {
  novelId: string;
  novelTitle: string;
}

// ─── Component ──────────────────────────────────────────────────────

export function EditorNotesTab({ novelId, novelTitle }: EditorNotesTabProps) {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Inline editor state ──
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [saving, setSaving] = useState(false);

  // ── Load notes for this novel ──
  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      const all = await fetchNotes();
      setNotes(all.filter((n) => n.novelId === novelId));
    } catch {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [novelId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // ── Open form for new note ──
  const handleNew = useCallback(() => {
    setEditingId(null);
    setFormTitle('');
    setFormBody('');
    setShowForm(true);
  }, []);

  // ── Open form for editing ──
  const handleEdit = useCallback((note: NoteData) => {
    setEditingId(note._id);
    setFormTitle(note.title);
    setFormBody(extractText(note.content));
    setShowForm(true);
  }, []);

  // ── Save ──
  const handleSave = useCallback(async () => {
    if (!formTitle.trim() && !formBody.trim()) return;
    try {
      setSaving(true);
      const content = textToTiptapJson(formBody);
      if (editingId) {
        const updated = await updateNote(editingId, { title: formTitle || 'Untitled Note', content });
        setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));
      } else {
        const created = await createNote({
          title: formTitle || 'Untitled Note',
          novelId,
          novelTitle,
          content,
        });
        setNotes((prev) => [created, ...prev]);
      }
      setShowForm(false);
      setEditingId(null);
      setFormTitle('');
      setFormBody('');
    } catch {
      toast.error('Failed to save note');
    } finally {
      setSaving(false);
    }
  }, [formTitle, formBody, editingId, novelId, novelTitle]);

  // ── Delete ──
  const handleDelete = useCallback(async (noteId: string) => {
    try {
      await deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
    } catch {
      toast.error('Failed to delete note');
    }
  }, []);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <span className="font-mono text-[10px] opacity-40">Loading notes…</span>
      </div>
    );
  }

  return (
    <>
      {/* Notes list */}
      {notes.length === 0 && !showForm && (
        <div className="flex h-40 flex-col items-center justify-center text-center opacity-50">
          <StickyNote size={24} />
          <p className="mt-2 font-mono text-[11px] leading-relaxed">
            No notes for this novel.
          </p>
        </div>
      )}

      {notes.map((note) => (
        <div
          key={note._id}
          className="group mb-2 border-2 border-black bg-white p-2.5 shadow-[2px_2px_0px_#eee] dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-none"
        >
          <div className="flex items-start justify-between gap-1">
            <span className="text-[12px] font-extrabold uppercase leading-snug tracking-[0.3px] dark:text-white">
              {note.title}
            </span>
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => handleEdit(note)}
                title="Edit note"
                className="cursor-pointer text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-black dark:text-neutral-600 dark:hover:text-white max-lg:opacity-100"
              >
                <Pencil size={11} />
              </button>
              <button
                onClick={() => handleDelete(note._id)}
                title="Delete note"
                className="cursor-pointer text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-danger dark:text-neutral-600 dark:hover:text-danger max-lg:opacity-100"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
          {extractText(note.content) && (
            <p className="mt-1 line-clamp-3 font-serif text-[11px] leading-relaxed text-gray-500 dark:text-neutral-400">
              {extractText(note.content)}
            </p>
          )}
          <span className="mt-1.5 block font-mono text-[8px] uppercase tracking-wider opacity-40">
            {formatDate(note.updatedAt)}
          </span>
        </div>
      ))}

      {/* Inline form */}
      {showForm ? (
        <div className="mt-2 space-y-2 border-2 border-dashed border-gray-400 p-3 dark:border-neutral-600">
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Note title"
            autoFocus
            className="w-full border-2 border-black px-2 py-1.5 font-mono text-[11px] outline-none placeholder:text-gray-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-600"
          />
          <textarea
            value={formBody}
            onChange={(e) => setFormBody(e.target.value)}
            placeholder="Write your note…"
            rows={4}
            className="w-full resize-none border-2 border-black px-2 py-1.5 font-serif text-[11px] leading-relaxed outline-none placeholder:text-gray-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-600"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving || (!formTitle.trim() && !formBody.trim())}
              className="flex-1 cursor-pointer border-2 border-black bg-[#FFDF00] py-1.5 font-mono text-[10px] font-bold text-black transition-colors hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? 'SAVING…' : editingId ? 'UPDATE' : 'ADD NOTE'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormTitle('');
                setFormBody('');
              }}
              className="cursor-pointer border-2 border-black bg-white px-3 py-1.5 font-mono text-[10px] font-bold transition-colors hover:bg-gray-100 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleNew}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1 border-2 border-black bg-[#FFDF00] px-2 py-2 font-mono text-[10px] font-bold tracking-wider text-black transition-colors hover:bg-yellow-300"
        >
          <Plus size={12} /> ADD NOTE
        </button>
      )}

      {/* Link to full notes page */}
      <Link
        href="/notes"
        className="mt-3 flex items-center justify-center gap-1 font-mono text-[9px] uppercase tracking-wider text-neutral-400 transition-colors hover:text-black dark:hover:text-white"
      >
        <ExternalLink size={10} />
        View all notes
      </Link>
    </>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────

function extractText(content: Record<string, unknown>): string {
  if (!content || typeof content !== 'object') return '';
  const nodes = content.content as Array<{ type: string; content?: Array<{ text?: string }> }> | undefined;
  if (!Array.isArray(nodes)) return '';
  return nodes
    .flatMap((node) => node.content?.map((c) => c.text ?? '') ?? [])
    .join(' ')
    .slice(0, 500);
}

function textToTiptapJson(text: string): Record<string, unknown> {
  if (!text.trim()) return { type: 'doc', content: [] };
  return {
    type: 'doc',
    content: text.split('\n').filter(Boolean).map((line) => ({
      type: 'paragraph',
      content: [{ type: 'text', text: line }],
    })),
  };
}
