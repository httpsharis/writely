'use client';

import { use, useState, useMemo, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useEditor } from '@/hooks/useEditor';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/Spinner';
import ChapterSidebar from '@/components/editor/ChapterSidebar';
import TiptapEditor from '@/components/editor/TiptapEditor';
import type { TiptapEditorHandle } from '@/components/editor/TiptapEditor';
import MetaStrip from '@/components/editor/MetaStrip';
import ToolsPanel from '@/components/editor/ToolsPanel';
import PublishDialog from '@/components/editor/PublishDialog';

interface Props {
  params: Promise<{ novelId: string }>;
}

export default function EditorPage({ params }: Props) {
  const { novelId } = use(params);
  const { status } = useSession();

  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const editorRef = useRef<TiptapEditorHandle>(null);

  const {
    novel, chapters, activeChapter, activeChapterId,
    saveStatus, isLoading, error,
    loadChapter, autoSave, addChapter, removeChapter,
    toggleStatus, togglePublish, renameNovel,
    addComment, removeComment, toggleResolveComment,
    addCharacterToNovel, removeCharacterFromNovel,
  } = useEditor(novelId);

  const publishedChapterCount = useMemo(
    () => chapters.filter((c) => c.status === 'published').length,
    [chapters],
  );

  // Auth guard
  if (status === 'loading') {
    return (
      <div className="flex h-dvh items-center justify-center bg-grid">
        <Spinner />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex h-dvh items-center justify-center bg-grid">
        <div className="text-center font-mono text-xs opacity-60">
          <p className="mb-4">ACCESS_DENIED</p>
          <Link href="/" className="text-secondary underline">Return to login</Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-grid">
        <div className="text-center font-mono text-xs opacity-60">
          <Spinner className="mx-auto mb-4" />
          <p>LOADING PROJECT...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-dvh items-center justify-center bg-grid">
        <div className="max-w-100 text-center font-mono text-xs">
          <p className="mb-4 text-danger">ERROR: {error}</p>
          <Link href="/" className="text-secondary underline">Back to novels</Link>
        </div>
      </div>
    );
  }

  const totalWords = novel?.stats?.currentWordCount ?? 0;
  const unresolvedComments = (activeChapter?.writerComments ?? []).filter(
    (c) => !c.isResolved,
  ).length;
  function handleSelectChapter(id: string) {
    loadChapter(id);
    setLeftOpen(false);
  }

  return (
    <div className="relative h-dvh w-screen overflow-hidden lg:grid lg:grid-cols-[280px_1fr_300px]">
      {/* Mobile overlay */}
      {(leftOpen || rightOpen) && (
        <div
          className="fixed inset-0 z-55 bg-black/35 lg:hidden"
          onClick={() => { setLeftOpen(false); setRightOpen(false); }}
        />
      )}

      {/* Left sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-60 w-70 -translate-x-full transition-transform duration-200 max-[480px]:w-full',
        'lg:static lg:z-auto lg:translate-x-0 lg:transition-none',
        leftOpen && 'translate-x-0 shadow-xl',
      )}>
        <button
          className="absolute right-4 top-4 z-10 flex cursor-pointer items-center justify-center rounded border-2 border-black bg-white p-1 lg:hidden"
          onClick={() => setLeftOpen(false)}
          aria-label="Close chapters"
        >
          <X size={18} />
        </button>
        <ChapterSidebar
          chapters={chapters}
          activeChapterId={activeChapterId}
          onSelectChapter={handleSelectChapter}
          onAddChapter={addChapter}
          onDeleteChapter={removeChapter}
          onToggleStatus={toggleStatus}
        />
      </div>

      {/* Editor workspace */}
      <main className="flex h-full flex-col overflow-hidden bg-grid">
        <MetaStrip
          novel={novel}
          wordCount={totalWords}
          saveStatus={saveStatus}
          commentCount={unresolvedComments}
          onToggleLeft={() => setLeftOpen((v) => !v)}
          onToggleRight={() => setRightOpen((v) => !v)}
          onOpenPublish={() => setPublishOpen(true)}
          onRenameNovel={renameNovel}
        />
        <TiptapEditor
          ref={editorRef}
          chapter={activeChapter}
          onAutoSave={autoSave}
          saveStatus={saveStatus}
        />
      </main>

      {/* Right sidebar */}
      <div className={cn(
        'fixed inset-y-0 right-0 z-60 w-70 translate-x-full transition-transform duration-200 max-[480px]:w-full lg:w-75',
        'lg:static lg:z-auto lg:translate-x-0 lg:transition-none',
        rightOpen && 'translate-x-0 shadow-xl',
      )}>
        <button
          className="absolute right-4 top-4 z-10 flex cursor-pointer items-center justify-center rounded border-2 border-black bg-white p-1 lg:hidden"
          onClick={() => setRightOpen(false)}
          aria-label="Close tools"
        >
          <X size={18} />
        </button>
        <ToolsPanel
          characters={novel?.characters ?? []}
          comments={(activeChapter?.writerComments as unknown as import('@/types/chapter').WriterComment[]) ?? []}
          getSelection={() => editorRef.current?.getSelection() ?? null}
          onAddCharacter={addCharacterToNovel}
          onRemoveCharacter={removeCharacterFromNovel}
          onAddComment={addComment}
          onRemoveComment={removeComment}
          onResolveComment={toggleResolveComment}
        />
      </div>

      {/* Publish dialog */}
      {publishOpen && novel && (
        <PublishDialog
          novel={novel}
          publishedChapterCount={publishedChapterCount}
          onTogglePublish={togglePublish}
          onClose={() => setPublishOpen(false)}
        />
      )}
    </div>
  );
}