'use client';

import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import {
  addComment as apiAddComment,
  removeComment as apiRemoveComment,
  resolveComment as apiResolveComment,
} from '@/lib/api-client';
import type { ChapterFull } from '@/lib/api-client';
import type { AddCommentInput } from '@/types/chapter';
import type { EditorState, EditorRefs } from './types';

type SetState = Dispatch<SetStateAction<EditorState>>;

/**
 * Writer comment mutations — all optimistic with revert on error.
 */
export function useCommentActions(
  state: EditorState,
  setState: SetState,
  { novelIdRef, chapterCache }: Pick<EditorRefs, 'novelIdRef' | 'chapterCache'>,
) {
  // ── Add comment ───────────────────────────────────────────────────────
  const addComment = useCallback(
    async (comment: AddCommentInput) => {
      if (!state.activeChapterId || !state.activeChapter) return;

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

      setState((s) => {
        if (!s.activeChapter) return s;
        return {
          ...s,
          activeChapter: {
            ...s.activeChapter,
            writerComments: [...(s.activeChapter.writerComments ?? []), optimisticComment],
          } as ChapterFull,
        };
      });

      try {
        const updated = await apiAddComment(novelIdRef.current, state.activeChapterId, comment);
        chapterCache.current.set(updated._id, updated);
        setState((s) => ({ ...s, activeChapter: updated }));
      } catch (err) {
        setState((s) => {
          if (!s.activeChapter) return s;
          return {
            ...s,
            activeChapter: {
              ...s.activeChapter,
              writerComments: s.activeChapter.writerComments.filter((c) => c._id !== tempId),
            } as ChapterFull,
            error: err instanceof Error ? err.message : 'Failed to add comment',
          };
        });
      }
    },
    [state.activeChapterId, state.activeChapter], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ── Remove comment ────────────────────────────────────────────────────
  const removeComment = useCallback(
    async (commentId: string) => {
      if (!state.activeChapterId || !state.activeChapter) return;

      const prevComments = state.activeChapter.writerComments;

      setState((s) => {
        if (!s.activeChapter) return s;
        return {
          ...s,
          activeChapter: {
            ...s.activeChapter,
            writerComments: s.activeChapter.writerComments.filter((c) => c._id !== commentId),
          } as ChapterFull,
        };
      });

      try {
        const updated = await apiRemoveComment(novelIdRef.current, state.activeChapterId, commentId);
        chapterCache.current.set(updated._id, updated);
        setState((s) => ({ ...s, activeChapter: updated }));
      } catch (err) {
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
    [state.activeChapterId, state.activeChapter], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ── Toggle resolved ───────────────────────────────────────────────────
  const toggleResolveComment = useCallback(
    async (commentId: string) => {
      if (!state.activeChapterId || !state.activeChapter) return;

      const prevComments = state.activeChapter.writerComments;

      setState((s) => {
        if (!s.activeChapter) return s;
        return {
          ...s,
          activeChapter: {
            ...s.activeChapter,
            writerComments: s.activeChapter.writerComments.map((c) =>
              c._id === commentId ? { ...c, isResolved: !c.isResolved } : c,
            ),
          } as ChapterFull,
        };
      });

      try {
        const updated = await apiResolveComment(novelIdRef.current, state.activeChapterId, commentId);
        chapterCache.current.set(updated._id, updated);
        setState((s) => ({ ...s, activeChapter: updated }));
      } catch (err) {
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
    [state.activeChapterId, state.activeChapter], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return { addComment, removeComment, toggleResolveComment };
}
