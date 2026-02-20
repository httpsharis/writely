import { apiFetch } from './fetcher';
import type { NovelData, ChapterSummary, ChapterFull } from './types';

export interface EditorInitData {
  novel: NovelData;
  chapters: ChapterSummary[];
  firstChapter: ChapterFull | null;
}

/**
 * Bootstraps the editor in one round-trip:
 * novel metadata + chapter list + first chapter content.
 */
export async function fetchEditorData(novelId: string): Promise<EditorInitData> {
  return apiFetch<EditorInitData>(`/api/editor/${novelId}`);
}
