'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { Plus, Filter, X, Sun, Moon } from 'lucide-react';
import {
  fetchNovels,
  createNovel,
  invalidateNovelsCache,
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
} from '@/lib/api-client';
import type { NovelData, NoteData } from '@/lib/api-client';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Spinner } from '@/components/ui/Spinner';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileNav } from '@/components/dashboard/MobileNav';
import { NoteCard } from '@/components/dashboard/NoteCard';
import { TiptapNoteEditor } from '@/components/dashboard/TiptapNoteEditor';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// ─── Dark-mode helpers ──────────────────────────────────────────────

function getInitialDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('writely-dark');
  if (stored !== null) return stored === '1';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyDarkClass(dark: boolean): void {
  document.documentElement.classList.toggle('dark', dark);
}

// ─── Page ───────────────────────────────────────────────────────────

export default function NotesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ── Core state ──
  const [novels, setNovels] = useState<NovelData[]>([]);
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // ── Filter state ──
  const [filterNovelId, setFilterNovelId] = useState<string | null>(null);

  // ── Editor modal state ──
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteData | null>(null);
  const [editorTitle, setEditorTitle] = useState('');
  const [selectedNovelId, setSelectedNovelId] = useState('');
  const [selectedNovelTitle, setSelectedNovelTitle] = useState('');
  const [saving, setSaving] = useState(false);

  // ── Delete state ──
  const [deleteTarget, setDeleteTarget] = useState<NoteData | null>(null);

  // ── Dark mode ──
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const initial = getInitialDarkMode();
    setDarkMode(initial);
    applyDarkClass(initial);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('writely-dark', next ? '1' : '0');
      applyDarkClass(next);
      return next;
    });
  }, []);

  // ── Data loading ──
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [novelsData, notesData] = await Promise.all([fetchNovels(), fetchNotes()]);
      setNovels(novelsData);
      setNotes(notesData);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') loadData();
    else if (status === 'unauthenticated') signIn('google');
  }, [status, loadData]);

  // ── Filtered notes ──
  const filteredNotes = filterNovelId
    ? notes.filter((n) =>
        filterNovelId === '__untagged' ? !n.novelId : n.novelId === filterNovelId,
      )
    : notes;

  // ── Novel create (for sidebar) ──
  async function handleCreateNovel() {
    try {
      setCreating(true);
      const novel = await createNovel();
      invalidateNovelsCache();
      router.push(`/editor/${novel._id}`);
    } catch {
      toast.error('Failed to create novel');
      setCreating(false);
    }
  }

  // ── Note editor handlers ──
  const handleCreateNote = useCallback(() => {
    setEditingNote(null);
    setEditorTitle('');
    setSelectedNovelId('');
    setSelectedNovelTitle('');
    setEditorOpen(true);
  }, []);

  const handleEdit = useCallback((note: NoteData) => {
    setEditingNote(note);
    setEditorTitle(note.title);
    setSelectedNovelId(note.novelId ?? '');
    setSelectedNovelTitle(note.novelTitle ?? '');
    setEditorOpen(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setEditorOpen(false);
    setEditingNote(null);
  }, []);

  const handleNovelChange = useCallback((novelId: string, novelTitle: string) => {
    setSelectedNovelId(novelId);
    setSelectedNovelTitle(novelTitle);
  }, []);

  const handleSave = useCallback(
    async (content: Record<string, unknown>) => {
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
    },
    [editingNote, editorTitle, selectedNovelId, selectedNovelTitle, handleCloseEditor],
  );

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

  // ── Auth guard ──
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex h-dvh items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <Spinner />
      </div>
    );
  }

  // ── Unique novel tags for filter ──
  const novelTags = Array.from(
    new Map(
      notes
        .filter((n) => n.novelId && n.novelTitle)
        .map((n) => [n.novelId!, { id: n.novelId!, title: n.novelTitle! }]),
    ).values(),
  );
  const hasUntagged = notes.some((n) => !n.novelId);

  return (
    <div className="min-h-dvh bg-neutral-50 dark:bg-neutral-900">
      <Sidebar
        userEmail={session?.user?.email ?? ''}
        userImage={session?.user?.image}
        activeRoute="/notes"
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onSignOut={() => signOut()}
        onCreateNovel={handleCreateNovel}
        creating={creating}
      />

      <MobileNav activeRoute="/notes" onCreateNovel={handleCreateNovel} creating={creating} />

      <main className="pb-20 md:pl-56 md:pb-0">
        {/* Mobile header */}
        <header className="flex h-14 items-center justify-between border-b-2 border-black px-4 dark:border-neutral-700 md:hidden">
          <span className="font-mono text-sm font-extrabold tracking-[3px] dark:text-white">
            WRITELY_
          </span>
          <button
            onClick={toggleDarkMode}
            className="cursor-pointer p-1.5 text-neutral-500 dark:text-neutral-400"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        <div className="mx-auto max-w-5xl p-6 lg:p-8">
          {/* Page header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold uppercase tracking-tight dark:text-white lg:text-3xl">
                Global Notes
              </h1>
              <p className="mt-1 font-mono text-xs text-neutral-400">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'} across all novels
              </p>
            </div>
            <button
              onClick={handleCreateNote}
              className="flex items-center gap-2 border-2 border-black bg-[#FFDF00] px-4 py-2.5 font-mono text-[11px] font-extrabold uppercase tracking-wider text-black transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_black]"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Note</span>
            </button>
          </div>

          {/* Filter bar */}
          {(novelTags.length > 0 || hasUntagged) && (
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2">
                <Filter size={12} className="text-neutral-400" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-[2px] text-neutral-400">
                  Filter by Novel
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* All */}
                <button
                  onClick={() => setFilterNovelId(null)}
                  className={`cursor-pointer border-2 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider transition-all ${
                    filterNovelId === null
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                      : 'border-neutral-300 text-neutral-500 hover:border-black hover:text-black dark:border-neutral-600 dark:text-neutral-400 dark:hover:border-white dark:hover:text-white'
                  }`}
                >
                  All
                </button>

                {/* Novel tags */}
                {novelTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setFilterNovelId(filterNovelId === tag.id ? null : tag.id)}
                    className={`cursor-pointer border-2 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider transition-all ${
                      filterNovelId === tag.id
                        ? 'border-[#FFDF00] bg-[#FFDF00] text-black'
                        : 'border-neutral-300 text-neutral-500 hover:border-[#FFDF00] hover:text-black dark:border-neutral-600 dark:text-neutral-400 dark:hover:border-[#FFDF00] dark:hover:text-white'
                    }`}
                  >
                    {tag.title}
                  </button>
                ))}

                {/* Untagged */}
                {hasUntagged && (
                  <button
                    onClick={() =>
                      setFilterNovelId(filterNovelId === '__untagged' ? null : '__untagged')
                    }
                    className={`cursor-pointer border-2 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider transition-all ${
                      filterNovelId === '__untagged'
                        ? 'border-neutral-500 bg-neutral-500 text-white'
                        : 'border-neutral-300 text-neutral-500 hover:border-neutral-500 hover:text-black dark:border-neutral-600 dark:text-neutral-400 dark:hover:border-neutral-400 dark:hover:text-white'
                    }`}
                  >
                    Untagged
                  </button>
                )}

                {/* Clear filter */}
                {filterNovelId && (
                  <button
                    onClick={() => setFilterNovelId(null)}
                    className="cursor-pointer p-1 text-neutral-400 transition-colors hover:text-black dark:hover:text-white"
                    title="Clear filter"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Notes grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner />
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="border-2 border-dashed border-neutral-300 px-6 py-16 text-center dark:border-neutral-700">
              <p className="mb-1 font-mono text-xs text-neutral-400">
                {filterNovelId ? 'No notes match this filter.' : 'No notes yet.'}
              </p>
              <p className="font-mono text-[10px] text-neutral-300 dark:text-neutral-600">
                {filterNovelId
                  ? 'Try a different filter or create a new note.'
                  : 'Capture your first idea — tag it to a novel or leave it free.'}
              </p>
            </div>
          ) : (
            <div className="columns-1 gap-4 space-y-4 md:columns-2 lg:columns-3">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onEdit={handleEdit}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          )}
        </div>
      </main>

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
        message={
          <>
            Delete <b>{deleteTarget?.title}</b>? This cannot be undone.
          </>
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
