'use client';

import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import {
  fetchChapter,
  fetchChapters,
  createChapter,
  saveChapter,
  deleteChapter,
  toggleChapterStatus,
} from '@/lib/api-client';
import type { ChapterSummary } from '@/lib/api-client';
import type { UpdateChapterInput } from '@/types/chapter';
import type { EditorState, EditorRefs } from './types';

type SetState = Dispatch<SetStateAction<EditorState>>;

/**
 * Chapter CRUD + auto-save.
 * All mutations are optimistic: the UI updates immediately and reverts on error.
 */
export function useChapterActions(
  state: EditorState,
  setState: SetState,
  refs: EditorRefs,
) {
  const { novelIdRef, activeChapterIdRef, chapterCache } = refs;

  // ── Cache-first chapter load (instant tab switching) ────────────────
  const loadChapter = useCallback(async (chapterId: string) => {
    const cached = chapterCache.current.get(chapterId);
    if (cached) {
      setState((s) => ({ ...s, activeChapter: cached, activeChapterId: chapterId, saveStatus: 'idle' }));
      return;
    }

    try {
      setState((s) => ({ ...s, activeChapterId: chapterId, saveStatus: 'idle' }));
      const chapter = await fetchChapter(novelIdRef.current, chapterId);
      chapterCache.current.set(chapterId, chapter);
      setState((s) => ({ ...s, activeChapter: chapter }));
    } catch (err) {
      setState((s) => ({ ...s, error: err instanceof Error ? err.message : 'Failed to load chapter' }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-save (called by the editor on debounce) ─────────────────────
  const autoSave = useCallback(async (data: UpdateChapterInput) => {
    const chapterId = activeChapterIdRef.current;
    if (!chapterId) return;

    try {
      setState((s) => ({ ...s, saveStatus: 'saving' }));
      const updated = await saveChapter(novelIdRef.current, chapterId, data);
      chapterCache.current.set(updated._id, updated);

      setState((s) => {
        const chapters = s.chapters.map((ch) =>
          ch._id === updated._id
            ? { ...ch, title: updated.title, wordCount: updated.wordCount, updatedAt: updated.updatedAt }
            : ch,
        );
        return {
          ...s,
          activeChapter: updated,
          chapters,
          saveStatus: 'saved',
          novel: s.novel
            ? { ...s.novel, stats: { ...s.novel.stats, currentWordCount: chapters.reduce((n, ch) => n + ch.wordCount, 0) } }
            : null,
        };
      });
    } catch {
      setState((s) => ({ ...s, saveStatus: 'error' }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Create chapter ────────────────────────────────────────────────────
  const addChapter = useCallback(async () => {
    try {
      const created = await createChapter(novelIdRef.current);

      const summary: ChapterSummary = {
        _id: created._id,
        title: created.title,
        order: created.order,
        status: created.status,
        wordCount: created.wordCount,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      };

      chapterCache.current.set(created._id, created);
      setState((s) => ({
        ...s,
        chapters: [...s.chapters, summary],
        activeChapter: created,
        activeChapterId: created._id,
        saveStatus: 'idle',
      }));
    } catch (err) {
      setState((s) => ({ ...s, error: err instanceof Error ? err.message : 'Failed to create chapter' }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Delete chapter (optimistic) ───────────────────────────────────────
  const removeChapter = useCallback(
    async (chapterId: string) => {
      const wasActive = state.activeChapterId === chapterId;
      const remaining = state.chapters.filter((ch) => ch._id !== chapterId);
      const nextId = wasActive && remaining.length > 0 ? remaining[0]._id : null;

      chapterCache.current.delete(chapterId);
      setState((s) => ({
        ...s,
        chapters: s.chapters.filter((ch) => ch._id !== chapterId),
        activeChapterId: wasActive ? nextId : s.activeChapterId,
        activeChapter: wasActive ? null : s.activeChapter,
      }));

      if (wasActive && nextId) loadChapter(nextId);

      try {
        await deleteChapter(novelIdRef.current, chapterId);
      } catch (err) {
        console.error('[useChapterActions] removeChapter failed:', err);
        const fresh = await fetchChapters(novelIdRef.current);
        setState((s) => ({ ...s, chapters: fresh }));
      }
    },
    [loadChapter, state.activeChapterId, state.chapters], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ── Toggle draft / published (optimistic) ─────────────────────────────
  const toggleStatus = useCallback(
    async (chapterId: string) => {
      const ch = state.chapters.find((c) => c._id === chapterId);
      if (!ch) return;

      const newStatus = ch.status === 'published' ? 'draft' : 'published';

      setState((s) => ({
        ...s,
        chapters: s.chapters.map((c) => c._id === chapterId ? { ...c, status: newStatus } : c),
        activeChapter: s.activeChapter?._id === chapterId
          ? { ...s.activeChapter, status: newStatus }
          : s.activeChapter,
      }));

      const cached = chapterCache.current.get(chapterId);
      if (cached) chapterCache.current.set(chapterId, { ...cached, status: newStatus });

      try {
        await toggleChapterStatus(novelIdRef.current, chapterId, newStatus);
      } catch (err) {
        console.error('[useChapterActions] toggleStatus failed:', err);
        setState((s) => ({
          ...s,
          chapters: s.chapters.map((c) => c._id === chapterId ? { ...c, status: ch.status } : c),
          activeChapter: s.activeChapter?._id === chapterId
            ? { ...s.activeChapter, status: ch.status }
            : s.activeChapter,
        }));
      }
    },
    [state.chapters], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return { loadChapter, autoSave, addChapter, removeChapter, toggleStatus };
}
