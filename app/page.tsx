'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LogOut, Trash2, BookOpen } from 'lucide-react';
import { fetchNovels, createNovel, deleteNovel, invalidateNovelsCache } from '@/lib/api-client';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from 'sonner';
import type { NovelData } from '@/lib/api-client';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [novels, setNovels] = useState<NovelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<NovelData | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setNovels(await fetchNovels());
    } catch { toast.error('Failed to load novels'); } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') load();
    else setLoading(false);
  }, [status, load]);

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
    } finally { setDeleteTarget(null); }
  }

  // Loading
  if (status === 'loading') {
    return (
      <div className="flex h-dvh items-center justify-center bg-grid">
        <Spinner />
      </div>
    );
  }

  // Landing (unauthenticated)
  if (status === 'unauthenticated') {
    return (
      <div className="flex h-dvh items-center justify-center bg-grid px-4">
        <div className="w-full max-w-110 border-[3px] border-black bg-white p-10 text-center shadow-[5px_5px_0px_black] max-[480px]:p-6">
          <div className="mb-6 inline-block border-2 border-black bg-primary px-3 py-1 font-mono text-xs font-bold uppercase tracking-[3px]">
            WRITELY_
          </div>
          <h1 className="mb-4 text-3xl font-extrabold uppercase leading-tight max-[480px]:text-[26px]">
            Your Personal<br />Writing Studio
          </h1>
          <p className="mb-7 text-sm leading-relaxed text-gray-500">
            Craft novels, manage chapters, and track your progress — all in one brutally efficient workspace.
          </p>
          <button
            onClick={() => signIn('google')}
            className="inline-flex cursor-pointer items-center gap-1.5 border-2 border-black bg-primary px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_black]"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // Dashboard (authenticated)
  return (
    <div className="min-h-dvh bg-grid p-4 md:p-6 lg:px-8">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between border-b-[3px] border-black pb-4 max-[480px]:flex-col max-[480px]:gap-2">
        <span className="font-mono text-lg font-extrabold tracking-[3px]">WRITELY_</span>
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[11px] opacity-60 md:inline">
            {session?.user?.email}
          </span>
          <button
            onClick={() => signOut()}
            title="Sign out"
            className="inline-flex cursor-pointer items-center justify-center rounded border-2 border-transparent p-1.5 text-black transition-all hover:border-black hover:bg-gray-100"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-mono text-[13px] font-bold tracking-[2px]">PROJECTS</h2>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="inline-flex cursor-pointer items-center gap-1.5 border-2 border-black bg-primary px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_black] disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
        >
          <Plus size={14} />
          {creating ? 'Creating...' : 'New Novel'}
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex min-h-50 items-center justify-center">
          <Spinner />
        </div>
      ) : novels.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center opacity-50">
          <BookOpen size={40} strokeWidth={1.5} />
          <p className="mt-3 font-mono text-xs">No novels yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
          {novels.map((novel) => (
            <div
              key={novel._id}
              onClick={() => router.push(`/novel/${novel._id}`)}
              className="group relative cursor-pointer border-[3px] border-black bg-white p-6 transition-all hover:-translate-x-0.75 hover:-translate-y-0.75 hover:shadow-[5px_5px_0px_black]"
            >
              <div className="mb-2 font-mono text-[10px] uppercase tracking-wider opacity-50">
                {novel.status}
              </div>
              <div className="mb-2 text-xl font-extrabold uppercase">{novel.title}</div>
              {novel.description && (
                <div className="mb-3 text-[13px] leading-relaxed text-gray-500">
                  {novel.description}
                </div>
              )}
              <div className="flex gap-4 font-mono text-[10px] opacity-40">
                <span>{novel.stats?.currentWordCount?.toLocaleString() ?? 0} words</span>
                <span>{novel.characters?.length ?? 0} characters</span>
              </div>
              <button
                title="Delete novel"
                onClick={(e) => { e.stopPropagation(); setDeleteTarget(novel); }}
                className="absolute right-4 top-4 cursor-pointer border-none bg-transparent p-1 text-gray-300 opacity-0 transition-all group-hover:opacity-100 hover:text-danger"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        message={<>Delete <b>{deleteTarget?.title}</b>? This cannot be undone.</>}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
