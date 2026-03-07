'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  fetchNovels,
  createNovel,
  deleteNovel,
  invalidateNovelsCache,
} from '@/lib/api-client';
import type { NovelData } from '@/lib/api-client';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Spinner } from '@/components/ui/Spinner';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileNav } from '@/components/dashboard/MobileNav';
import { NovelGrid } from '@/components/dashboard/NovelGrid';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

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

export default function NovelsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [novels, setNovels] = useState<NovelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<NovelData | null>(null);
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

  const loadNovels = useCallback(async () => {
    try {
      setLoading(true);
      setNovels(await fetchNovels());
    } catch {
      toast.error('Failed to load novels');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') loadNovels();
    else if (status === 'unauthenticated') signIn('google');
  }, [status, loadNovels]);

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

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex h-dvh items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-neutral-50 dark:bg-neutral-950">
      <Sidebar
        userEmail={session?.user?.email ?? ''}
        userImage={session?.user?.image}
        activeRoute="/novels"
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onSignOut={() => signOut()}
        onCreateNovel={handleCreate}
        creating={creating}
      />

      <MobileNav activeRoute="/novels" onCreateNovel={handleCreate} creating={creating} />

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

        <div className="mx-auto max-w-5xl p-6 lg:p-8">
          {/* Page header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight dark:text-white lg:text-3xl">
                Your Novels
              </h1>
              <p className="mt-1 font-mono text-xs text-neutral-400">
                {novels.length} {novels.length === 1 ? 'project' : 'projects'}
              </p>
            </div>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="hidden items-center gap-2 border-2 border-black bg-primary text-black px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_black] disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex"
            >
              <Plus size={14} />
              {creating ? 'Creating...' : 'New Novel'}
            </button>
          </div>

          <NovelGrid novels={novels} loading={loading} onDelete={setDeleteTarget} />
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
