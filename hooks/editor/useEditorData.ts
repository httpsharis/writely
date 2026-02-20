'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchEditorData } from '@/lib/api-client';
import type { ChapterFull } from '@/lib/api-client';
import type { EditorState, EditorRefs } from './types';

const INITIAL_STATE: EditorState = {
  novel: null,
  chapters: [],
  activeChapter: null,
  activeChapterId: null,
  saveStatus: 'idle',
  isLoading: true,
  error: null,
};

/**
 * Owns the editor's core state, chapter cache, and stable refs.
 * All other sub-hooks receive these as parameters.
 */
export function useEditorData(novelId: string) {
  const [state, setState] = useState<EditorState>(INITIAL_STATE);

  const chapterCache = useRef<Map<string, ChapterFull>>(new Map());
  const novelIdRef = useRef(novelId);
  novelIdRef.current = novelId;
  const activeChapterIdRef = useRef<string | null>(null);
  activeChapterIdRef.current = state.activeChapterId;

  const refs: EditorRefs = { novelIdRef, activeChapterIdRef, chapterCache };

  // ── Bootstrap — single request for novel + chapters + first chapter ──
  useEffect(() => {
    let cancelled = false;
    chapterCache.current.clear();

    async function init() {
      try {
        const { novel, chapters, firstChapter } = await fetchEditorData(novelId);
        if (cancelled) return;

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

  return { state, setState, refs };
}
