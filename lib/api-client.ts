/**
 * API client barrel — re-exports everything from the split modules.
 *
 * All existing imports like:
 *   import { fetchChapter, type ChapterFull } from '@/lib/api-client'
 * continue to work without any changes.
 *
 * Module layout:
 *   lib/api/fetcher.ts   — internal apiFetch helper
 *   lib/api/types.ts     — ChapterSummary, ChapterFull, NovelData
 *   lib/api/novels.ts    — novel CRUD, cache, publish, author notes, characters
 *   lib/api/chapters.ts  — chapter CRUD, writer comments
 *   lib/api/editor.ts    — editor bootstrap (fetchEditorData)
 *   lib/api/public.ts    — public reader types + endpoints
 */

export type { ChapterSummary, ChapterFull, NovelData } from './api/types';

export {
  fetchNovels,
  invalidateNovelsCache,
  fetchNovel,
  createNovel,
  deleteNovel,
  updateNovel,
  togglePublish,
  addAuthorNote,
  removeAuthorNote,
  addCharacter,
  removeCharacter,
} from './api/novels';

export {
  fetchChapters,
  createChapter,
  fetchChapter,
  saveChapter,
  deleteChapter,
  toggleChapterStatus,
  addComment,
  removeComment,
  resolveComment,
} from './api/chapters';

export type { EditorInitData } from './api/editor';
export { fetchEditorData } from './api/editor';

export type { PublicNovel, PublicChapterSummary, PublicChapter } from './api/public';
export { fetchPublicNovel, fetchPublicChapters, fetchPublicChapter } from './api/public';
