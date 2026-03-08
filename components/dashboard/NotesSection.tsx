'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
} from '@/lib/api-client';
import type { NoteData, NovelData } from '@/lib/api-client';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { NoteCard } from '@/components/dashboard/NoteCard';
import { TiptapNoteEditor } from '@/components/dashboard/TiptapNoteEditor';

// ─── Props ──────────────────────────────────────────────────────────

interface NotesSectionProps {
  novels: NovelData[];
}

// ─── Component ──────────────────────────────────────────────────────

export function NotesSection({ novels }: NotesSectionProps) {
  // ── Data ──
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Editor modal state ──
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteData | null>(null);
  const [editorTitle, setEditorTitle] = useState('');
  const [selectedNovelId, setSelectedNovelId] = useState('');
  const [selectedNovelTitle, setSelectedNovelTitle] = useState('');
  const [saving, setSaving] = useState(false);

  // ── Delete state ──
  const [deleteTarget, setDeleteTarget] = useState<NoteData | null>(null);

  // ── Load notes ──
  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchNotes();
      setNotes(data);
    } catch {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // ── Open editor for new note ──
  const handleCreateNew = useCallback(() => {
    setEditingNote(null);
    setEditorTitle('');
    setSelectedNovelId('');
    setSelectedNovelTitle('');
    setEditorOpen(true);
  }, []);

  // ── Open editor for existing note ──
  const handleEdit = useCallback((note: NoteData) => {
    setEditingNote(note);
    setEditorTitle(note.title);
    setSelectedNovelId(note.novelId ?? '');
    setSelectedNovelTitle(note.novelTitle ?? '');
    setEditorOpen(true);
  }, []);

  // ── Close editor ──
  const handleCloseEditor = useCallback(() => {
    setEditorOpen(false);
    setEditingNote(null);
  }, []);

  // ── Novel selector change ──
  const handleNovelChange = useCallback((novelId: string, novelTitle: string) => {
    setSelectedNovelId(novelId);
    setSelectedNovelTitle(novelTitle);
  }, []);

  // ── Save (create or update) ──
  const handleSave = useCallback(async (content: Record<string, unknown>) => {
    try {
      setSaving(true);
      if (editingNote) {
        const updated = await updateNote(editingNote._id, {
          title: editorTitle || 'Untitled Note',
          novelId: selectedNovelId || null,
          novelTitle: selectedNovelTitle || null,
          content,
        });
        setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));
        toast.success('Note updated');
      } else {
        const created = await createNote({
          title: editorTitle || 'Untitled Note',
          novelId: selectedNovelId || undefined,
          novelTitle: selectedNovelTitle || undefined,
          content,
        });
        setNotes((prev) => [created, ...prev]);
        toast.success('Note created');
      }
      handleCloseEditor();
    } catch {
      toast.error('Failed to save note');
    } finally {
      setSaving(false);
    }
  }, [editingNote, editorTitle, selectedNovelId, selectedNovelTitle, handleCloseEditor]);

  // ── Delete ──
  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteNote(deleteTarget._id);
      setNotes((prev) => prev.filter((n) => n._id !== deleteTarget._id));
      toast.success('Note deleted');
    } catch {
      toast.error('Failed to delete note');
    } finally {
      setDeleteTarget(null);
    }
  }, [deleteTarget]);

  return (
    <section>
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono text-[11px] font-bold uppercase tracking-[2px] dark:text-neutral-300">
          Global Notes
        </h2>
        <button
          type="button"
          onClick={handleCreateNew}
          className="flex cursor-pointer items-center gap-1.5 border-2 border-black bg-[#FFDF00] px-3 py-1.5 font-mono text-[10px] font-extrabold uppercase tracking-wider text-black transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_black]"
        >
          <Plus size={12} />
          Create Note
        </button>
      </div>

      {/* Notes grid (masonry-like with CSS columns) */}
      {loading ? (
        <div className="py-8 text-center font-mono text-xs text-neutral-400">Loading notes…</div>
      ) : notes.length === 0 ? (
        <div className="border-2 border-dashed border-neutral-300 px-6 py-10 text-center dark:border-neutral-700">
          <p className="font-mono text-xs text-neutral-400">
            No notes yet. Capture your first idea.
          </p>
        </div>
      ) : (
        <div className="columns-1 gap-4 space-y-4 md:columns-2 lg:columns-3">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} onEdit={handleEdit} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      {/* Editor modal */}
      <TiptapNoteEditor
        open={editorOpen}
        novels={novels}
        editingNote={editingNote}
        title={editorTitle}
        selectedNovelId={selectedNovelId}
        onTitleChange={setEditorTitle}
        onNovelChange={handleNovelChange}
        onSave={handleSave}
        onClose={handleCloseEditor}
        saving={saving}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        message={<>Delete <b>{deleteTarget?.title}</b>? This cannot be undone.</>}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  );
}
