'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchNovel,
  fetchChapters,
  fetchChapter,
  createChapter,
  saveChapter,
  deleteChapter,
  toggleChapterStatus,
  togglePublish as apiTogglePublish,
  updateNovel,
  addComment as apiAddComment,
  removeComment as apiRemoveComment,
  resolveComment as apiResolveComment,
  addCharacter as apiAddCharacter,
  removeCharacter as apiRemoveCharacter,
  type NovelData,
  type ChapterSummary,
  type ChapterFull,
} from '@/lib/api-client';
import type { UpdateChapterInput, AddCommentInput } from '@/types/chapter';

// ─── Types ──────────────────────────────────────────────────────────

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface EditorState {
  novel: NovelData | null;
  chapters: ChapterSummary[];
  activeChapter: ChapterFull | null;
  activeChapterId: string | null;
  saveStatus: SaveStatus;
  isLoading: boolean;
  error: string | null;
}

// ─── Hook ───────────────────────────────────────────────────────────

export function useEditor(novelId: string) {
  const [state, setState] = useState<EditorState>({
    novel: null,
    chapters: [],
    activeChapter: null,
    activeChapterId: null,
    saveStatus: 'idle',
    isLoading: true,
    error: null,
  });

  // ── Load novel + chapter list on mount ────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function loadNovel() {
      try {
        setState((s) => ({ ...s, isLoading: true, error: null }));

        const [novel, chapters] = await Promise.all([
          fetchNovel(novelId),
          fetchChapters(novelId),
        ]);

        if (cancelled) return;

        setState((s) => ({
          ...s,
          novel,
          chapters,
          isLoading: false,
        }));

        // Auto-open first chapter if available
        if (chapters.length > 0) {
          loadChapter(chapters[0]._id);
        }
      } catch (err) {
        if (cancelled) return;
        setState((s) => ({
          ...s,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load novel',
        }));
      }
    }

    loadNovel();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [novelId]);

  // ── Load a chapter into the editor ────────────────────────────────
  const loadChapter = useCallback(
    async (chapterId: string) => {
      try {
        setState((s) => ({
          ...s,
          activeChapterId: chapterId,
          saveStatus: 'idle',
        }));

        const chapter = await fetchChapter(novelId, chapterId);

        setState((s) => ({
          ...s,
          activeChapter: chapter,
        }));
      } catch (err) {
        setState((s) => ({
          ...s,
          error: err instanceof Error ? err.message : 'Failed to load chapter',
        }));
      }
    },
    [novelId]
  );

  // ── Auto-save chapter (called by editor on debounce) ──────────────
  const autoSave = useCallback(
    async (data: UpdateChapterInput) => {
      if (!state.activeChapterId) return;

      try {
        setState((s) => ({ ...s, saveStatus: 'saving' }));

        const updated = await saveChapter(novelId, state.activeChapterId, data);

        setState((s) => {
          // Update the chapter list with new title/wordCount
          const chapters = s.chapters.map((ch) =>
            ch._id === updated._id
              ? {
                  ...ch,
                  title: updated.title,
                  wordCount: updated.wordCount,
                  updatedAt: updated.updatedAt as unknown as string,
                }
              : ch
          );

          return {
            ...s,
            activeChapter: updated,
            chapters,
            saveStatus: 'saved',
            // Update novel word count (sum of all chapters)
            novel: s.novel
              ? {
                  ...s.novel,
                  stats: {
                    ...s.novel.stats,
                    currentWordCount: chapters.reduce(
                      (sum, ch) => sum + ch.wordCount,
                      0
                    ),
                  },
                }
              : null,
          };
        });
      } catch {
        setState((s) => ({ ...s, saveStatus: 'error' }));
      }
    },
    [novelId, state.activeChapterId]
  );

  // ── Add a new chapter ─────────────────────────────────────────────
  const addChapter = useCallback(async () => {
    try {
      const created = await createChapter(novelId);

      const summary: ChapterSummary = {
        _id: created._id,
        title: created.title,
        order: created.order,
        status: created.status,
        wordCount: created.wordCount,
        createdAt: created.createdAt as unknown as string,
        updatedAt: created.updatedAt as unknown as string,
      };

      setState((s) => ({
        ...s,
        chapters: [...s.chapters, summary],
      }));

      // Open the new chapter
      await loadChapter(created._id);
    } catch (err) {
      setState((s) => ({
        ...s,
        error: err instanceof Error ? err.message : 'Failed to create chapter',
      }));
    }
  }, [novelId, loadChapter]);

  // ── Delete a chapter ──────────────────────────────────────────────
  const removeChapter = useCallback(
    async (chapterId: string) => {
      try {
        await deleteChapter(novelId, chapterId);

        // Determine next chapter before updating state
        const wasActive = state.activeChapterId === chapterId;
        const remaining = state.chapters.filter((ch) => ch._id !== chapterId);
        const nextId = wasActive && remaining.length > 0 ? remaining[0]._id : null;

        setState((s) => ({
          ...s,
          chapters: s.chapters.filter((ch) => ch._id !== chapterId),
          activeChapterId: wasActive ? nextId : s.activeChapterId,
          activeChapter: wasActive ? null : s.activeChapter,
        }));

        // Load next chapter outside of setState to avoid cascading renders
        if (wasActive && nextId) loadChapter(nextId);
      } catch (err) {
        setState((s) => ({
          ...s,
          error: err instanceof Error ? err.message : 'Failed to delete chapter',
        }));
      }
    },
    [novelId, loadChapter, state.activeChapterId, state.chapters]
  );

  // ── Toggle chapter status (draft ↔ published) ────────────────────
  const toggleStatus = useCallback(
    async (chapterId: string) => {
      const ch = state.chapters.find((c) => c._id === chapterId);
      if (!ch) return;

      const newStatus = ch.status === 'published' ? 'draft' : 'published';

      try {
        await toggleChapterStatus(novelId, chapterId, newStatus);
        setState((s) => ({
          ...s,
          chapters: s.chapters.map((c) =>
            c._id === chapterId ? { ...c, status: newStatus } : c,
          ),
          activeChapter:
            s.activeChapter?._id === chapterId
              ? { ...s.activeChapter, status: newStatus }
              : s.activeChapter,
        }));
      } catch (err) {
        setState((s) => ({
          ...s,
          error: err instanceof Error ? err.message : 'Failed to update status',
        }));
      }
    },
    [novelId, state.chapters],
  );

  // ── Add comment ───────────────────────────────────────────────────
  const addComment = useCallback(
    async (comment: AddCommentInput) => {
      if (!state.activeChapterId) return;
      try {
        const updated = await apiAddComment(novelId, state.activeChapterId, comment);
        setState((s) => ({ ...s, activeChapter: updated }));
      } catch (err) {
        setState((s) => ({
          ...s,
          error: err instanceof Error ? err.message : 'Failed to add comment',
        }));
      }
    },
    [novelId, state.activeChapterId],
  );

  // ── Remove comment ────────────────────────────────────────────────
  const removeComment = useCallback(
    async (commentId: string) => {
      if (!state.activeChapterId) return;
      try {
        const updated = await apiRemoveComment(novelId, state.activeChapterId, commentId);
        setState((s) => ({ ...s, activeChapter: updated }));
      } catch (err) {
        setState((s) => ({
          ...s,
          error: err instanceof Error ? err.message : 'Failed to remove comment',
        }));
      }
    },
    [novelId, state.activeChapterId],
  );

  // ── Resolve/unresolve comment ─────────────────────────────────────
  const toggleResolveComment = useCallback(
    async (commentId: string) => {
      if (!state.activeChapterId) return;
      try {
        const updated = await apiResolveComment(novelId, state.activeChapterId, commentId);
        setState((s) => ({ ...s, activeChapter: updated }));
      } catch (err) {
        setState((s) => ({
          ...s,
          error: err instanceof Error ? err.message : 'Failed to update comment',
        }));
      }
    },
    [novelId, state.activeChapterId],
  );

  // ── Add character ─────────────────────────────────────────────────
  const addCharacterToNovel = useCallback(
    async (char: { name: string; role: string; description?: string }) => {
      try {
        const updated = await apiAddCharacter(novelId, char);
        setState((s) => ({ ...s, novel: updated }));
      } catch (err) {
        setState((s) => ({
          ...s,
          error: err instanceof Error ? err.message : 'Failed to add character',
        }));
      }
    },
    [novelId],
  );

  // ── Remove character ──────────────────────────────────────────────
  const removeCharacterFromNovel = useCallback(
    async (index: number) => {
      try {
        const updated = await apiRemoveCharacter(novelId, index);
        setState((s) => ({ ...s, novel: updated }));
      } catch (err) {
        setState((s) => ({
          ...s,
          error: err instanceof Error ? err.message : 'Failed to remove character',
        }));
      }
    },
    [novelId],
  );

  // ── Rename novel ──────────────────────────────────────────────────
  const renameNovel = useCallback(
    async (title: string) => {
      try {
        const updated = await updateNovel(novelId, { title });
        setState((s) => ({ ...s, novel: updated }));
      } catch (err) {
        setState((s) => ({
          ...s,
          error: err instanceof Error ? err.message : 'Failed to rename novel',
        }));
      }
    },
    [novelId],
  );

  // ── Toggle publish ────────────────────────────────────────────────
  const togglePublish = useCallback(async () => {
    const current = state.novel?.isPublished ?? false;
    try {
      const updated = await apiTogglePublish(novelId, !current);
      setState((s) => ({ ...s, novel: updated }));
    } catch (err) {
      setState((s) => ({
        ...s,
        error: err instanceof Error ? err.message : 'Failed to toggle publish',
      }));
    }
  }, [novelId, state.novel?.isPublished]);

  return {
    ...state,
    loadChapter,
    autoSave,
    addChapter,
    removeChapter,
    toggleStatus,
    togglePublish,
    renameNovel,
    addComment,
    removeComment,
    toggleResolveComment,
    addCharacterToNovel,
    removeCharacterFromNovel,
  };
}
