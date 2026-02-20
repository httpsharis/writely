'use client';

import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import {
  updateNovel,
  togglePublish as apiTogglePublish,
  addCharacter as apiAddCharacter,
  removeCharacter as apiRemoveCharacter,
} from '@/lib/api-client';
import type { EditorState, EditorRefs } from './types';

type SetState = Dispatch<SetStateAction<EditorState>>;

/**
 * Novel-level mutations: metadata, publish state, and character list.
 * Rename and publish are optimistic with revert on error.
 */
export function useNovelActions(
  state: EditorState,
  setState: SetState,
  { novelIdRef }: Pick<EditorRefs, 'novelIdRef'>,
) {
  // ── Rename novel (optimistic) ──────────────────────────────────────────
  const renameNovel = useCallback(
    async (title: string) => {
      const oldTitle = state.novel?.title;
      setState((s) => ({ ...s, novel: s.novel ? { ...s.novel, title } : s.novel }));

      try {
        await updateNovel(novelIdRef.current, { title });
      } catch (err) {
        console.error('[useNovelActions] renameNovel failed:', err);
        setState((s) => ({ ...s, novel: s.novel ? { ...s.novel, title: oldTitle ?? '' } : s.novel }));
      }
    },
    [state.novel?.title], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ── Toggle publish (optimistic) ────────────────────────────────────────
  const togglePublish = useCallback(async () => {
    const current = state.novel?.isPublished ?? false;
    setState((s) => ({ ...s, novel: s.novel ? { ...s.novel, isPublished: !current } : s.novel }));

    try {
      await apiTogglePublish(novelIdRef.current, !current);
    } catch (err) {
      console.error('[useNovelActions] togglePublish failed:', err);
      setState((s) => ({ ...s, novel: s.novel ? { ...s.novel, isPublished: current } : s.novel }));
    }
  }, [state.novel?.isPublished]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Add character ──────────────────────────────────────────────────────
  const addCharacterToNovel = useCallback(
    async (char: { name: string; role: string; description?: string }) => {
      try {
        const updated = await apiAddCharacter(novelIdRef.current, char);
        setState((s) => ({ ...s, novel: updated }));
      } catch (err) {
        setState((s) => ({ ...s, error: err instanceof Error ? err.message : 'Failed to add character' }));
      }
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ── Remove character ───────────────────────────────────────────────────
  const removeCharacterFromNovel = useCallback(
    async (id: string) => {
      try {
        const updated = await apiRemoveCharacter(novelIdRef.current, id);
        setState((s) => ({ ...s, novel: updated }));
      } catch (err) {
        setState((s) => ({ ...s, error: err instanceof Error ? err.message : 'Failed to remove character' }));
      }
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return { renameNovel, togglePublish, addCharacterToNovel, removeCharacterFromNovel };
}
