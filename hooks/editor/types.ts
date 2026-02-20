import type { NovelData, ChapterSummary, ChapterFull } from '@/lib/api-client';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface EditorState {
  novel: NovelData | null;
  chapters: ChapterSummary[];
  activeChapter: ChapterFull | null;
  activeChapterId: string | null;
  saveStatus: SaveStatus;
  isLoading: boolean;
  error: string | null;
}

/** Refs shared by all sub-hooks — stable across renders. */
export interface EditorRefs {
  novelIdRef: React.MutableRefObject<string>;
  activeChapterIdRef: React.MutableRefObject<string | null>;
  chapterCache: React.MutableRefObject<Map<string, ChapterFull>>;
}
