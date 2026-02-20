'use client';

/**
 * useEditor — composes the editor sub-hooks into one stable API.
 *
 * Sub-hook breakdown:
 *   hooks/editor/useEditorData.ts      → state, cache, stable refs, initial load
 *   hooks/editor/useChapterActions.ts  → load, auto-save, add, remove, toggleStatus
 *   hooks/editor/useCommentActions.ts  → addComment, removeComment, toggleResolveComment
 *   hooks/editor/useNovelActions.ts    → renameNovel, togglePublish, characters
 */

export type { SaveStatus } from './editor/types';

import { useEditorData } from './editor/useEditorData';
import { useChapterActions } from './editor/useChapterActions';
import { useCommentActions } from './editor/useCommentActions';
import { useNovelActions } from './editor/useNovelActions';

export function useEditor(novelId: string) {
  const { state, setState, refs } = useEditorData(novelId);

  const chapterActions = useChapterActions(state, setState, refs);
  const commentActions = useCommentActions(state, setState, refs);
  const novelActions   = useNovelActions(state, setState, refs);

  return {
    ...state,
    ...chapterActions,
    ...commentActions,
    ...novelActions,
  };
}
