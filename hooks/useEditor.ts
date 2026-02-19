'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  fetchEditorData,
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

  // ── Chapter cache — avoids refetching when switching chapters ─────
  const chapterCache = useRef<Map<string, ChapterFull>>(new Map());
  const novelIdRef = useRef(novelId);
  novelIdRef.current = novelId;
  const activeChapterIdRef = useRef<string | null>(null);
  activeChapterIdRef.current = state.activeChapterId;

  // ── Load everything in ONE request ────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    chapterCache.current.clear();

    async function init() {
      try {
        // Single batch request replaces 3 sequential calls
        const { novel, chapters, firstChapter } = await fetchEditorData(novelId);
        if (cancelled) return;

        // Cache first chapter if available
        if (firstChapter) {
          chapterCache.current.set(firstChapter._id, firstChapter);
        }

        setState({
          novel,
          chapters,
          activeChapter: firstChapter,
          activeChapterId: firstChapter?._id ?? null,
          saveStatus: 'idle',
          isLoading: false,
          error: null,
        });
      } catch (err) {
        if (cancelled) return;
        setState((s) => ({
          ...s,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load novel',
        }));
      }
    }

    init();
    return () => { cancelled = true; };
  }, [novelId]);

  // ── Load a chapter (cache-first → instant switching) ──────────────
  const loadChapter = useCallback(
    async (chapterId: string) => {
      // Instant switch if cached
      const cached = chapterCache.current.get(chapterId);
      if (cached) {
        setState((s) => ({
          ...s,
          activeChapter: cached,
          activeChapterId: chapterId,
          saveStatus: 'idle',
        }));
        return;
      }

      // Otherwise fetch (only the first time)
      try {
        setState((s) => ({
          ...s,
          activeChapterId: chapterId,
          saveStatus: 'idle',
        }));

        const chapter = await fetchChapter(novelIdRef.current, chapterId);
        chapterCache.current.set(chapterId, chapter);

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
    [],
  );

  // ── Auto-save chapter (called by editor on debounce) ──────────────
  const autoSave = useCallback(
    async (data: UpdateChapterInput) => {
      const chapterId = activeChapterIdRef.current;
      if (!chapterId) return;

      try {
        setState((s) => ({ ...s, saveStatus: 'saving' }));

        const updated = await saveChapter(novelIdRef.current, chapterId, data);

        // Update cache with saved version
        chapterCache.current.set(updated._id, updated);

        setState((s) => {
          const chapters = s.chapters.map((ch) =>
            ch._id === updated._id
              ? {
                  ...ch,
                  title: updated.title,
                  wordCount: updated.wordCount,
                  updatedAt: updated.updatedAt,
                }
              : ch
          );

          return {
            ...s,
            activeChapter: updated,
            chapters,
            saveStatus: 'saved',
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
    [],
  );

  // ── Add a new chapter (optimistic) ────────────────────────────────
  const addChapter = useCallback(async () => {
    try {
      const created = await createChapter(novelIdRef.current);

      const summary: ChapterSummary = {
        _id: created._id,
        title: created.title,
        order: created.order,
        status: created.status,
        wordCount: created.wordCount,
        createdAt: created.createdAt as unknown as string,
        updatedAt: created.updatedAt as unknown as string,
      };

      // Cache immediately — no refetch when opening it
      chapterCache.current.set(created._id, created);

      setState((s) => ({
        ...s,
        chapters: [...s.chapters, summary],
        activeChapter: created,
        activeChapterId: created._id,
        saveStatus: 'idle',
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        error: err instanceof Error ? err.message : 'Failed to create chapter',
      }));
    }
  }, []);

  // ── Delete a chapter (optimistic) ─────────────────────────────────
  const removeChapter = useCallback(
    async (chapterId: string) => {
      // Determine next chapter before removing
      const wasActive = state.activeChapterId === chapterId;
      const remaining = state.chapters.filter((ch) => ch._id !== chapterId);
      const nextId = wasActive && remaining.length > 0 ? remaining[0]._id : null;

      // Optimistic removal from UI
      chapterCache.current.delete(chapterId);
      setState((s) => ({
        ...s,
        chapters: s.chapters.filter((ch) => ch._id !== chapterId),
        activeChapterId: wasActive ? nextId : s.activeChapterId,
        activeChapter: wasActive ? null : s.activeChapter,
      }));

      // Load next chapter if needed
      if (wasActive && nextId) loadChapter(nextId);

      try {
        await deleteChapter(novelIdRef.current, chapterId);
      } catch (err) {
        // Revert on failure — refetch fresh list
        console.error('[useEditor] removeChapter failed:', err);
        const fresh = await fetchChapters(novelIdRef.current);
        setState((s) => ({ ...s, chapters: fresh }));
      }
    },
    [loadChapter, state.activeChapterId, state.chapters],
  );

  // ── Toggle chapter status (optimistic) ────────────────────────────
  const toggleStatus = useCallback(
    async (chapterId: string) => {
      const ch = state.chapters.find((c) => c._id === chapterId);
      if (!ch) return;

      const newStatus = ch.status === 'published' ? 'draft' : 'published';

      // Optimistic update
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

      // Update cache
      const cached = chapterCache.current.get(chapterId);
      if (cached) {
        chapterCache.current.set(chapterId, { ...cached, status: newStatus });
      }

      try {
        await toggleChapterStatus(novelIdRef.current, chapterId, newStatus);
      } catch (err) {
        // Revert on failure
        console.error('[useEditor] toggleStatus failed:', err);
        setState((s) => ({
          ...s,
          chapters: s.chapters.map((c) =>
            c._id === chapterId ? { ...c, status: ch.status } : c,
          ),
          activeChapter:
            s.activeChapter?._id === chapterId
              ? { ...s.activeChapter, status: ch.status }
              : s.activeChapter,
        }));
      }
    },
    [state.chapters],
  );

  // ── Add comment (optimistic) ──────────────────────────────────────
  const addComment = useCallback(
    async (comment: AddCommentInput) => {
      if (!state.activeChapterId || !state.activeChapter) return;

      // Build optimistic comment
      const tempId = `temp_${Date.now()}`;
      const optimisticComment = {
        _id: tempId,
        userId: 'me',
        userName: 'you',
        text: comment.text,
        anchor: comment.anchor,
        isResolved: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Optimistic: add immediately
      setState((s) => {
        if (!s.activeChapter) return s;
        const updated = {
          ...s.activeChapter,
          writerComments: [...(s.activeChapter.writerComments ?? []), optimisticComment],
        };
        return { ...s, activeChapter: updated as ChapterFull };
      });

      try {
        const updated = await apiAddComment(novelIdRef.current, state.activeChapterId, comment);
        chapterCache.current.set(updated._id, updated);
        setState((s) => ({ ...s, activeChapter: updated }));
      } catch (err) {
        // Revert optimistic add
        setState((s) => {
          if (!s.activeChapter) return s;
          const reverted = {
            ...s.activeChapter,
            writerComments: (s.activeChapter.writerComments ?? []).filter(
              (c) => c._id !== tempId,
            ),
          };
          return {
            ...s,
            activeChapter: reverted as ChapterFull,
            error: err instanceof Error ? err.message : 'Failed to add comment',
          };
        });
      }
    },
    [state.activeChapterId, state.activeChapter],
  );

  // ── Remove comment (optimistic) ───────────────────────────────────
  const removeComment = useCallback(
    async (commentId: string) => {
      if (!state.activeChapterId || !state.activeChapter) return;

      // Snapshot for revert
      const prevComments = state.activeChapter.writerComments ?? [];

      // Optimistic: remove immediately
      setState((s) => {
        if (!s.activeChapter) return s;
        const updated = {
          ...s.activeChapter,
          writerComments: (s.activeChapter.writerComments ?? []).filter(
            (c) => c._id !== commentId,
          ),
        };
        return { ...s, activeChapter: updated as ChapterFull };
      });

      try {
        const updated = await apiRemoveComment(novelIdRef.current, state.activeChapterId, commentId);
        chapterCache.current.set(updated._id, updated);
        setState((s) => ({ ...s, activeChapter: updated }));
      } catch (err) {
        // Revert
        setState((s) => {
          if (!s.activeChapter) return s;
          return {
            ...s,
            activeChapter: { ...s.activeChapter, writerComments: prevComments } as ChapterFull,
            error: err instanceof Error ? err.message : 'Failed to remove comment',
          };
        });
      }
    },
    [state.activeChapterId, state.activeChapter],
  );

  // ── Resolve/unresolve comment (optimistic) ────────────────────────
  const toggleResolveComment = useCallback(
    async (commentId: string) => {
      if (!state.activeChapterId || !state.activeChapter) return;

      // Snapshot for revert
      const prevComments = state.activeChapter.writerComments ?? [];

      // Optimistic: toggle immediately
      setState((s) => {
        if (!s.activeChapter) return s;
        const updated = {
          ...s.activeChapter,
          writerComments: (s.activeChapter.writerComments ?? []).map(
            (c) =>
              c._id === commentId ? { ...c, isResolved: !c.isResolved } : c,
          ),
        };
        return { ...s, activeChapter: updated as ChapterFull };
      });

      try {
        const updated = await apiResolveComment(novelIdRef.current, state.activeChapterId, commentId);
        chapterCache.current.set(updated._id, updated);
        setState((s) => ({ ...s, activeChapter: updated }));
      } catch (err) {
        // Revert
        setState((s) => {
          if (!s.activeChapter) return s;
          return {
            ...s,
            activeChapter: { ...s.activeChapter, writerComments: prevComments } as ChapterFull,
            error: err instanceof Error ? err.message : 'Failed to update comment',
          };
        });
      }
    },
    [state.activeChapterId, state.activeChapter],
  );

  // ── Add character ─────────────────────────────────────────────────
  const addCharacterToNovel = useCallback(
    async (char: { name: string; role: string; description?: string }) => {
      try {
        const updated = await apiAddCharacter(novelIdRef.current, char);
        setState((s) => ({ ...s, novel: updated }));
      } catch (err) {
        setState((s) => ({
          ...s,
          error: err instanceof Error ? err.message : 'Failed to add character',
        }));
      }
    },
    [],
  );

  // ── Remove character by _id (safe — doesn't depend on array index) ──
  const removeCharacterFromNovel = useCallback(
    async (id: string) => {
      try {
        const updated = await apiRemoveCharacter(novelIdRef.current, id);
        setState((s) => ({ ...s, novel: updated }));
      } catch (err) {
        setState((s) => ({
          ...s,
          error: err instanceof Error ? err.message : 'Failed to remove character',
        }));
      }
    },
    [],
  );

  // ── Rename novel (optimistic) ─────────────────────────────────────
  const renameNovel = useCallback(
    async (title: string) => {
      const oldTitle = state.novel?.title;

      // Optimistic
      setState((s) => ({
        ...s,
        novel: s.novel ? { ...s.novel, title } : s.novel,
      }));

      try {
        await updateNovel(novelIdRef.current, { title });
      } catch (err) {
        // Revert
        console.error('[useEditor] renameNovel failed:', err);
        setState((s) => ({
          ...s,
          novel: s.novel ? { ...s.novel, title: oldTitle ?? '' } : s.novel,
        }));
      }
    },
    [state.novel?.title],
  );

  // ── Toggle publish (optimistic) ───────────────────────────────────
  const togglePublish = useCallback(async () => {
    const current = state.novel?.isPublished ?? false;

    // Optimistic
    setState((s) => ({
      ...s,
      novel: s.novel ? { ...s.novel, isPublished: !current } : s.novel,
    }));

    try {
      await apiTogglePublish(novelIdRef.current, !current);
    } catch (err) {
      // Revert
      console.error('[useEditor] togglePublish failed:', err);
      setState((s) => ({
        ...s,
        novel: s.novel ? { ...s.novel, isPublished: current } : s.novel,
      }));
    }
  }, [state.novel?.isPublished]);

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
