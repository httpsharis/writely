'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Pencil,
  BookOpen,
  FileText,
  Globe,
  Users,
  BarChart3,
  Check,
  Copy,
  Trash2,
  Plus,
  X,
  MessageSquare,
  Send,
} from 'lucide-react';
import {
  fetchNovel,
  fetchChapters,
  updateNovel,
  deleteNovel,
  createChapter,
  deleteChapter,
  addAuthorNote,
  removeAuthorNote,
} from '@/lib/api-client';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Spinner } from '@/components/ui/Spinner';
import type { NovelData, ChapterSummary } from '@/lib/api-client';
import type { ProjectStatus } from '@/types/project';

const STATUS_OPTIONS: ProjectStatus[] = ['planning', 'drafting', 'editing', 'completed'];

const STATUS_COLORS: Record<ProjectStatus, string> = {
  planning: 'bg-blue-100 text-blue-700 border-blue-300',
  drafting: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  editing: 'bg-purple-100 text-purple-700 border-purple-300',
  completed: 'bg-green-100 text-green-700 border-green-300',
};

export default function NovelDetailsPage() {
  const { status: authStatus } = useSession();
  const router = useRouter();
  const { novelId } = useParams<{ novelId: string }>();

  const [novel, setNovel] = useState<NovelData | null>(null);
  const [chapters, setChapters] = useState<ChapterSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editing states
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [editingDesc, setEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState('');
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalValue, setGoalValue] = useState('');

  // UI states
  const [copied, setCopied] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<'novel' | ChapterSummary | null>(null);
  const [creatingChapter, setCreatingChapter] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [deleteNoteIndex, setDeleteNoteIndex] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [n, c] = await Promise.all([fetchNovel(novelId), fetchChapters(novelId)]);
      setNovel(n);
      setChapters(c);
    } catch {
      setError('Failed to load novel');
    } finally {
      setLoading(false);
    }
  }, [novelId]);

  useEffect(() => {
    if (authStatus === 'authenticated') load();
  }, [authStatus, load]);

  // ─── Actions ────────────────────────────────────────────────────

  async function handleUpdateTitle() {
    if (!novel || !titleValue.trim() || titleValue.trim() === novel.title) {
      setEditingTitle(false);
      return;
    }
    const updated = await updateNovel(novelId, { title: titleValue.trim() });
    setNovel(updated);
    setEditingTitle(false);
  }

  async function handleUpdateDescription() {
    if (!novel) { setEditingDesc(false); return; }
    const updated = await updateNovel(novelId, { description: descValue.trim() });
    setNovel(updated);
    setEditingDesc(false);
  }

  async function handleUpdateGoal() {
    if (!novel) { setEditingGoal(false); return; }
    const goal = parseInt(goalValue, 10);
    if (isNaN(goal) || goal < 0) { setEditingGoal(false); return; }
    const updated = await updateNovel(novelId, { stats: { goalWordCount: goal } });
    setNovel(updated);
    setEditingGoal(false);
  }

  async function handleStatusChange(status: ProjectStatus) {
    if (!novel) return;
    const updated = await updateNovel(novelId, { status });
    setNovel(updated);
  }

  async function handleTogglePublish() {
    if (!novel) return;
    const updated = await updateNovel(novelId, { isPublished: !novel.isPublished });
    setNovel(updated);
  }

  async function handleCopyLink() {
    const url = `${window.location.origin}/read/${novelId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleCreateChapter() {
    try {
      setCreatingChapter(true);
      await createChapter(novelId);
      const c = await fetchChapters(novelId);
      setChapters(c);
    } finally {
      setCreatingChapter(false);
    }
  }

  async function handleDeleteChapter(chapter: ChapterSummary) {
    await deleteChapter(novelId, chapter._id);
    setChapters((prev) => prev.filter((c) => c._id !== chapter._id));
    setDeleteTarget(null);
  }

  async function handleDeleteNovel() {
    await deleteNovel(novelId);
    router.push('/');
  }

  function handleConfirmDelete() {
    if (deleteTarget === 'novel') handleDeleteNovel();
    else if (deleteTarget) handleDeleteChapter(deleteTarget);
  }

  async function handleAddNote() {
    if (!noteText.trim()) return;
    try {
      setAddingNote(true);
      const updated = await addAuthorNote(novelId, noteText.trim());
      setNovel(updated);
      setNoteText('');
    } finally {
      setAddingNote(false);
    }
  }

  async function handleRemoveNote(noteId: string) {
    const updated = await removeAuthorNote(novelId, noteId);
    setNovel(updated);
    setDeleteNoteIndex(null);
  }

  // ─── Guards ─────────────────────────────────────────────────────

  if (authStatus === 'loading' || loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-grid">
        <Spinner />
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    router.push('/');
    return null;
  }

  if (error || !novel) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-grid">
        <p className="font-mono text-sm text-danger">{error || 'Novel not found'}</p>
        <button
          onClick={() => router.push('/')}
          className="cursor-pointer border-2 border-black bg-white px-4 py-2 font-mono text-xs font-bold transition-all hover:bg-gray-100"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // ─── Computed values ────────────────────────────────────────────

  const totalWords = novel.stats?.currentWordCount ?? 0;
  const goalWords = novel.stats?.goalWordCount ?? 0;
  const publishedChapters = chapters.filter((c) => c.status === 'published').length;
  const draftChapters = chapters.filter((c) => c.status === 'draft').length;
  const progressPct = goalWords > 0 ? Math.min(100, Math.round((totalWords / goalWords) * 100)) : 0;

  return (
    <div className="min-h-dvh bg-grid">
      {/* ── Top Bar ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 border-b-[3px] border-black bg-white px-4 py-3 md:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="inline-flex cursor-pointer items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider opacity-60 transition-opacity hover:opacity-100"
          >
            <ArrowLeft size={14} />
            Dashboard
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/editor/${novelId}`)}
              className="inline-flex cursor-pointer items-center gap-1.5 border-2 border-black bg-primary px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_black]"
            >
              <Pencil size={12} />
              Open Editor
            </button>
            <button
              onClick={() => setDeleteTarget('novel')}
              title="Delete novel"
              className="cursor-pointer border-2 border-transparent p-1.5 text-gray-400 transition-all hover:border-danger hover:text-danger"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        {/* ── Title ────────────────────────────────────────────────── */}
        <div className="mb-6">
          {editingTitle ? (
            <input
              autoFocus
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleUpdateTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdateTitle();
                if (e.key === 'Escape') setEditingTitle(false);
              }}
              className="w-full border-b-[3px] border-black bg-transparent text-3xl font-extrabold uppercase outline-none md:text-4xl"
            />
          ) : (
            <button
              onClick={() => { setTitleValue(novel.title); setEditingTitle(true); }}
              className="group flex cursor-pointer items-center gap-2 text-left"
            >
              <h1 className="text-3xl font-extrabold uppercase md:text-4xl">{novel.title}</h1>
              <Pencil size={16} className="shrink-0 text-gray-300 transition-colors group-hover:text-black" />
            </button>
          )}
        </div>

        {/* ── Description ──────────────────────────────────────────── */}
        <div className="mb-8">
          <label className="mb-1 block font-mono text-[9px] font-bold uppercase tracking-[2px] text-gray-400">
            Description
          </label>
          {editingDesc ? (
            <div className="space-y-2">
              <textarea
                autoFocus
                value={descValue}
                onChange={(e) => setDescValue(e.target.value)}
                rows={3}
                className="w-full resize-none border-2 border-black bg-white p-3 text-sm leading-relaxed outline-none placeholder:text-gray-400"
                placeholder="What is your novel about?"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setEditingDesc(false);
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateDescription}
                  className="cursor-pointer border-2 border-black bg-black px-3 py-1 font-mono text-[10px] font-bold text-white transition-colors hover:bg-white hover:text-black"
                >
                  SAVE
                </button>
                <button
                  onClick={() => setEditingDesc(false)}
                  className="cursor-pointer border-2 border-black bg-white px-3 py-1 font-mono text-[10px] font-bold transition-colors hover:bg-gray-100"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { setDescValue(novel.description ?? ''); setEditingDesc(true); }}
              className="group flex w-full cursor-pointer items-start gap-2 text-left"
            >
              <p className="text-sm leading-relaxed text-gray-500">
                {novel.description || 'No description yet — click to add one.'}
              </p>
              <Pencil size={12} className="mt-0.5 shrink-0 text-gray-300 transition-colors group-hover:text-black" />
            </button>
          )}
        </div>

        {/* ── Stats Cards ──────────────────────────────────────────── */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            icon={<FileText size={16} />}
            label="Chapters"
            value={chapters.length}
            sub={`${publishedChapters} published · ${draftChapters} draft`}
          />
          <StatCard
            icon={<BarChart3 size={16} />}
            label="Words"
            value={totalWords.toLocaleString()}
            sub={goalWords > 0 ? `${progressPct}% of ${goalWords.toLocaleString()} goal` : 'No goal set'}
          />
          <StatCard
            icon={<Users size={16} />}
            label="Characters"
            value={novel.characters?.length ?? 0}
          />
          <StatCard
            icon={<Globe size={16} />}
            label="Published"
            value={novel.isPublished ? 'Yes' : 'No'}
            sub={novel.isPublished ? `${publishedChapters} chapter${publishedChapters !== 1 ? 's' : ''} live` : undefined}
          />
        </div>

        {/* ── Status & Publish Row ─────────────────────────────────── */}
        <div className="mb-8 flex flex-wrap items-start gap-6">
          {/* Status selector */}
          <div>
            <label className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-[2px] text-gray-400">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`cursor-pointer border-2 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider transition-all ${
                    novel.status === s
                      ? STATUS_COLORS[s] + ' border-current'
                      : 'border-gray-200 bg-white text-gray-400 hover:border-gray-400 hover:text-gray-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Publish toggle */}
          <div>
            <label className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-[2px] text-gray-400">
              Publish
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePublish}
                className={`cursor-pointer border-2 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-all ${
                  novel.isPublished
                    ? 'border-success bg-success/10 text-success hover:bg-success/20'
                    : 'border-gray-300 bg-white text-gray-400 hover:border-black hover:text-black'
                }`}
              >
                <Globe size={12} className="mr-1.5 inline" />
                {novel.isPublished ? 'Published' : 'Unpublished'}
              </button>
              {novel.isPublished && (
                <button
                  onClick={handleCopyLink}
                  className="inline-flex cursor-pointer items-center gap-1 border-2 border-gray-300 bg-white px-2.5 py-1.5 font-mono text-[10px] font-bold transition-all hover:border-black"
                >
                  {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              )}
            </div>
          </div>

          {/* Word goal */}
          <div>
            <label className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-[2px] text-gray-400">
              Word Goal
            </label>
            {editingGoal ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="number"
                  value={goalValue}
                  onChange={(e) => setGoalValue(e.target.value)}
                  onBlur={handleUpdateGoal}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUpdateGoal();
                    if (e.key === 'Escape') setEditingGoal(false);
                  }}
                  className="w-28 border-2 border-black bg-white px-2 py-1 font-mono text-[12px] outline-none"
                  min={0}
                />
              </div>
            ) : (
              <button
                onClick={() => { setGoalValue(String(goalWords)); setEditingGoal(true); }}
                className="group flex cursor-pointer items-center gap-1.5"
              >
                <span className="font-mono text-sm font-bold">
                  {goalWords > 0 ? goalWords.toLocaleString() : '—'}
                </span>
                <Pencil size={10} className="text-gray-300 transition-colors group-hover:text-black" />
              </button>
            )}
          </div>
        </div>

        {/* ── Word Progress Bar ────────────────────────────────────── */}
        {goalWords > 0 && (
          <div className="mb-8">
            <div className="mb-1 flex justify-between font-mono text-[9px] font-bold uppercase tracking-[2px] text-gray-400">
              <span>Progress</span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-3 w-full border-2 border-black bg-white">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Chapters List ────────────────────────────────────────── */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-[13px] font-bold tracking-[2px]">CHAPTERS</h2>
            <button
              onClick={handleCreateChapter}
              disabled={creatingChapter}
              className="inline-flex cursor-pointer items-center gap-1 border-2 border-black bg-black px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white transition-all hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={12} />
              {creatingChapter ? 'Adding...' : 'Add Chapter'}
            </button>
          </div>

          {chapters.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 py-12 text-center">
              <BookOpen size={32} className="mx-auto mb-3 text-gray-300" />
              <p className="font-mono text-xs text-gray-400">No chapters yet</p>
            </div>
          ) : (
            <div className="divide-y-2 divide-black border-2 border-black">
              {chapters.map((ch, i) => (
                <div
                  key={ch._id}
                  className="group flex items-center justify-between bg-white px-4 py-3 transition-colors hover:bg-gray-50"
                >
                  <button
                    onClick={() => router.push(`/editor/${novelId}?chapter=${ch._id}`)}
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                  >
                    <span className="shrink-0 font-mono text-[10px] font-bold text-gray-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="truncate text-sm font-bold">{ch.title}</span>
                    <span
                      className={`shrink-0 border px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider ${
                        ch.status === 'published'
                          ? 'border-success/40 bg-success/10 text-success'
                          : 'border-gray-200 text-gray-400'
                      }`}
                    >
                      {ch.status}
                    </span>
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-gray-400">
                      {ch.wordCount?.toLocaleString() ?? 0} w
                    </span>
                    <button
                      onClick={() => setDeleteTarget(ch)}
                      title="Delete chapter"
                      className="cursor-pointer text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-danger max-md:opacity-100"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Author's Notes ───────────────────────────────────────── */}
        <div className="mt-10">
          <h2 className="mb-4 font-mono text-[13px] font-bold tracking-[2px]">
            <MessageSquare size={14} className="mr-1.5 inline" />
            AUTHOR&apos;S NOTES
          </h2>

          {/* Add note form */}
          <div className="mb-4 border-[3px] border-black bg-white p-4 shadow-[3px_3px_0px_black]">
            <label className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-[2px] text-gray-400">
              Add a public note for your readers
            </label>
            <div className="flex gap-2">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={2}
                maxLength={2000}
                placeholder="Share an update, announce a new chapter, or leave a note for your readers..."
                className="flex-1 resize-none border-2 border-black bg-white p-3 text-sm leading-relaxed outline-none placeholder:text-gray-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAddNote();
                }}
              />
              <button
                onClick={handleAddNote}
                disabled={!noteText.trim() || addingNote}
                className="inline-flex shrink-0 cursor-pointer items-center gap-1 self-end border-2 border-black bg-black px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-white transition-all hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={12} />
                {addingNote ? 'Posting...' : 'Post'}
              </button>
            </div>
            <div className="mt-1 text-right font-mono text-[9px] text-gray-300">
              {noteText.length}/2000
            </div>
          </div>

          {/* Notes list */}
          {(!novel.authorNotes || novel.authorNotes.length === 0) ? (
            <div className="border-2 border-dashed border-gray-300 py-8 text-center">
              <MessageSquare size={28} className="mx-auto mb-2 text-gray-300" />
              <p className="font-mono text-xs text-gray-400">No notes yet — share something with your readers!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...novel.authorNotes].reverse().map((note, reversedIdx) => {
                return (
                  <div
                    key={note._id ?? reversedIdx}
                    className="group border-[3px] border-black bg-white p-4 transition-all hover:shadow-[3px_3px_0px_black]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{note.text}</p>
                      <button
                        onClick={() => note._id && setDeleteNoteIndex(note._id)}
                        title="Delete note"
                        className="shrink-0 cursor-pointer text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-danger max-md:opacity-100"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div className="mt-2 font-mono text-[9px] text-gray-400">
                      {new Date(note.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Meta info ────────────────────────────────────────────── */}
        <div className="mt-8 border-t-2 border-gray-200 pt-4">
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-[10px] text-gray-400">
            <span>Created: {new Date(novel.createdAt).toLocaleDateString()}</span>
            <span>Updated: {new Date(novel.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </main>

      {/* ── Confirm Delete ─────────────────────────────────────────── */}
      <ConfirmDialog
        open={!!deleteTarget}
        message={
          deleteTarget === 'novel' ? (
            <>Delete <b>{novel.title}</b> and all its chapters? This cannot be undone.</>
          ) : deleteTarget ? (
            <>Delete chapter <b>{deleteTarget.title}</b>? This cannot be undone.</>
          ) : ''
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={deleteNoteIndex !== null}
        message="Delete this author note? This cannot be undone."
        onConfirm={() => deleteNoteIndex !== null && handleRemoveNote(deleteNoteIndex)}
        onCancel={() => setDeleteNoteIndex(null)}
      />
    </div>
  );
}

// ─── Stat Card Component ──────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="border-[3px] border-black bg-white p-4 shadow-[3px_3px_0px_black]">
      <div className="mb-2 flex items-center gap-1.5 text-gray-400">{icon}
        <span className="font-mono text-[9px] font-bold uppercase tracking-[2px]">{label}</span>
      </div>
      <div className="text-2xl font-extrabold">{value}</div>
      {sub && <div className="mt-1 font-mono text-[10px] text-gray-400">{sub}</div>}
    </div>
  );
}
