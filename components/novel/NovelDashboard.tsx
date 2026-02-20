"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { deleteNovel, deleteChapter } from "@/lib/api-client";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useNovelData } from "@/hooks/useNovelData";
import type { ChapterSummary } from "@/lib/api-client";

// UI Components
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";

// Novel Components
import TopBar from "./TopBar";
import NovelIdentity from "./NovelIdentity";
import NovelStats from "./NovelStats";
import NovelControls from "./NovelControls";
import ProgressBar from "./ProgressBar";
import ChaptersManager from "./ChapterManager";
import AuthorNotesManager from "./AuthorNotesManager";

export default function NovelDashboard({ novelId }: { novelId: string }) {
  const router = useRouter();
  const { novel, chapters, loading, error, setNovel, setChapters } = useNovelData(novelId);
  const [deleteTarget, setDeleteTarget] = useState<"novel" | ChapterSummary | null>(null);

  // 1. Computed Stats
  const stats = useMemo(() => {
    const totalWords = novel?.stats?.currentWordCount ?? 0;
    const goalWords = novel?.stats?.goalWordCount ?? 0;
    const publishedCount = chapters.filter((c) => c.status === "published").length;
    const draftCount = chapters.filter((c) => c.status === "draft").length;
    const progressPct = goalWords > 0 ? Math.min(100, Math.round((totalWords / goalWords) * 100)) : 0;
    return { totalWords, goalWords, publishedCount, draftCount, progressPct };
  }, [novel, chapters]);

  // 2. Guard Clauses
  if (loading) return <LoadingState />;
  if (error || !novel) return <ErrorState error={error} />;


  // 3. Deletion Logic
  async function handleConfirmDelete() {
    if (deleteTarget === "novel") {
      await deleteNovel(novelId);
      router.push("/");
    } else if (deleteTarget) {
      await deleteChapter(novelId, deleteTarget._id);
      setChapters((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      setDeleteTarget(null);
    }
  }

  function getDeleteMessage() {
    if (deleteTarget === "novel") return <>Delete <b>{novel?.title}</b> and all chapters? Cannot be undone.</>;
    if (deleteTarget) return <>Delete chapter <b>{deleteTarget.title}</b>?</>;
    return "";
  }

  // 4. The Layout (Clean, readable, orchestrated)
  return (
    <div className="min-h-dvh bg-grid">
      <TopBar novelId={novelId} onDelete={() => setDeleteTarget("novel")} />

      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        <NovelIdentity novel={novel} setNovel={setNovel} />

        <NovelStats
          novel={novel}
          chapters={chapters}
          totalWords={stats.totalWords}
          goalWords={stats.goalWords}
          progressPct={stats.progressPct}
          publishedCount={stats.publishedCount}
          draftCount={stats.draftCount}
        />

        <NovelControls novel={novel} setNovel={setNovel} goalWords={stats.goalWords} />

        {stats.goalWords > 0 && <ProgressBar progressPct={stats.progressPct} />}

        <ChaptersManager
          novelId={novelId}
          chapters={chapters}
          setChapters={setChapters}
          onDeleteClick={(ch) => setDeleteTarget(ch)}
        />

        <AuthorNotesManager novel={novel} setNovel={setNovel} />

        <div className="mt-8 border-t-2 border-gray-200 pt-4 font-mono text-[10px] text-gray-400">
          <span>Created: {new Date(novel.createdAt).toLocaleDateString()}</span>
          <span className="ml-6">Updated: {new Date(novel.updatedAt).toLocaleDateString()}</span>
        </div>
      </main>

      <ConfirmDialog
        open={!!deleteTarget}
        message={getDeleteMessage()}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}