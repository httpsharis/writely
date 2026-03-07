'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  fetchNovels,
  fetchChapters,
  fetchChapter,
  createNovel,
  deleteNovel,
  invalidateNovelsCache,
} from '@/lib/api-client';
import type { NovelData } from '@/lib/api-client';
import { ContentUtils } from '@/lib/contentUtils';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileNav } from '@/components/dashboard/MobileNav';
import { RecentChapterHero } from '@/components/dashboard/RecentChapterHero';
import { WordCountWidget } from '@/components/dashboard/WordCountWidget';
import { QuickCaptureWidget } from '@/components/dashboard/QuickCaptureWidget';
import { NovelGrid } from '@/components/dashboard/NovelGrid';
import { toast } from 'sonner';
import type { RecentChapterData, DailyWordCountData, QuickNote } from '@/types/dashboard';

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

// ─── Greeting helpers ────────────────────────────────────────────────

const WRITING_QUOTES = [
  'The first draft is just you telling yourself the story. — Terry Pratchett',
  'Start writing, no matter what. The water does not flow until the faucet is turned on. — Louis L\'Amour',
  'You can always edit a bad page. You can\'t edit a blank page. — Jodi Picoult',
  'Write what should not be forgotten. — Isabel Allende',
  'There is no greater agony than bearing an untold story inside you. — Maya Angelou',
  'A word after a word after a word is power. — Margaret Atwood',
  'The scariest moment is always just before you start. — Stephen King',
  'Fill your paper with the breathings of your heart. — William Wordsworth',
] as const;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

function getDailyQuote(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return WRITING_QUOTES[dayOfYear % WRITING_QUOTES.length];
}

function getFirstName(name?: string | null, email?: string | null): string {
  if (name) return name.split(' ')[0];
  if (email) return email.split('@')[0];
  return 'Writer';
}

// ─── Props ──────────────────────────────────────────────────────────

interface DashboardProps {
  session: { user?: { name?: string | null; email?: string | null; image?: string | null } };
}

// ─── Component ──────────────────────────────────────────────────────

export function Dashboard({ session }: DashboardProps) {
  const router = useRouter();

  // ── Core state ──
  const [novels, setNovels] = useState<NovelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<NovelData | null>(null);

  // ── Hero state ──
  const [recentChapter, setRecentChapter] = useState<RecentChapterData | null>(null);
  const [heroLoading, setHeroLoading] = useState(true);

  // ── Widgets ──
  const [wordCount] = useState<DailyWordCountData>({ current: 0, goal: 1000 });
  const [quickNotes, setQuickNotes] = useState<QuickNote[]>([]);

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

  // ── Load quick notes from localStorage ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem('writely-notes');
      if (raw) setQuickNotes(JSON.parse(raw));
    } catch { /* ignore corrupted data */ }
  }, []);

  const addQuickNote = useCallback((text: string) => {
    const note: QuickNote = { id: crypto.randomUUID(), text, createdAt: new Date().toISOString() };
    setQuickNotes((prev) => {
      const next = [note, ...prev].slice(0, 20);
      localStorage.setItem('writely-notes', JSON.stringify(next));
      return next;
    });
  }, []);

  // ── Data loading ──
  const loadNovels = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchNovels();
      setNovels(data);
      return data;
    } catch {
      toast.error('Failed to load novels');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRecentChapter = useCallback(async (novelList: NovelData[]) => {
    if (novelList.length === 0) {
      setHeroLoading(false);
      return;
    }

    try {
      setHeroLoading(true);
      const sorted = [...novelList].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      const recentNovel = sorted[0];

      const chapters = await fetchChapters(recentNovel._id);
      if (chapters.length === 0) {
        setRecentChapter(null);
        return;
      }

      const sortedChapters = [...chapters].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      const latestSummary = sortedChapters[0];

      const full = await fetchChapter(recentNovel._id, latestSummary._id);
      const preview = ContentUtils.extractTextFromTiptap(
        full.content as Parameters<typeof ContentUtils.extractTextFromTiptap>[0],
      ).slice(0, 220);

      setRecentChapter({
        chapterId: full._id,
        chapterTitle: full.title,
        novelId: recentNovel._id,
        novelTitle: recentNovel.title,
        contentPreview: preview || 'Start writing to see a preview here...',
        wordCount: full.wordCount,
        updatedAt: full.updatedAt,
      });
    } catch {
      setRecentChapter(null);
    } finally {
      setHeroLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNovels().then(loadRecentChapter);
  }, [loadNovels, loadRecentChapter]);

  // Compute daily word count from all novels
  const totalWords = novels.reduce((sum, n) => sum + (n.stats?.currentWordCount ?? 0), 0);
  const dailyData: DailyWordCountData = { ...wordCount, current: totalWords };

  // ── Actions ──
  async function handleCreate() {
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

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteNovel(deleteTarget._id);
      invalidateNovelsCache();
      setNovels((prev) => prev.filter((n) => n._id !== deleteTarget._id));
      toast.success('Novel deleted');
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="min-h-dvh bg-neutral-50 dark:bg-neutral-950">
      {/* Desktop sidebar */}
      <Sidebar
        userEmail={session?.user?.email ?? ''}
        userImage={session?.user?.image}
        activeRoute="/"
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onSignOut={() => signOut()}
        onCreateNovel={handleCreate}
        creating={creating}
      />

      {/* Mobile bottom nav */}
      <MobileNav activeRoute="/" onCreateNovel={handleCreate} creating={creating} />

      {/* Main content — offset for sidebar on desktop, bottom nav on mobile */}
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
            {darkMode ? '☀️' : '🌙'}
          </button>
        </header>

        <div className="mx-auto max-w-5xl space-y-6 p-6 lg:p-8">
          {/* Greeting */}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight dark:text-white lg:text-3xl">
              {getGreeting()}, {getFirstName(session?.user?.name, session?.user?.email)}
            </h1>
            <p className="mt-1.5 max-w-lg font-serif text-sm italic leading-relaxed text-neutral-400">
              &ldquo;{getDailyQuote()}&rdquo;
            </p>
          </div>

          {/* Hero — Recent Chapter (focal point) */}
          <RecentChapterHero chapter={recentChapter} loading={heroLoading} />

          {/* Widgets row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <WordCountWidget data={dailyData} />
            <QuickCaptureWidget notes={quickNotes} onAddNote={addQuickNote} />
          </div>

          {/* Novels section */}
          <section>
            <h2 className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[2px] dark:text-neutral-300">
              Your Novels
            </h2>
            <NovelGrid novels={novels} loading={loading} onDelete={setDeleteTarget} />
          </section>
        </div>
      </main>

      <ConfirmDialog
        open={!!deleteTarget}
        message={<>Delete <b>{deleteTarget?.title}</b>? This cannot be undone.</>}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
