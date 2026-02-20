import type { IProject, ICharacter } from '@/types/project';
import type { IChapter, WriterComment } from '@/types/chapter';

// ─── Chapter types ───────────────────────────────────────────────────

/** Lightweight chapter data returned by the sidebar/list endpoint. */
export interface ChapterSummary {
  _id: string;
  title: string;
  order: number;
  status: 'draft' | 'published';
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Full chapter with content (editor endpoint).
 * Overrides Mongoose types with plain-JSON equivalents that match
 * what the API actually returns.
 */
export interface ChapterFull
  extends Omit<IChapter, '_id' | 'projectId' | 'writerComments' | 'createdAt' | 'updatedAt'> {
  _id: string;
  projectId: string;
  writerComments: WriterComment[];
  createdAt: string;
  updatedAt: string;
}

// ─── Novel type ──────────────────────────────────────────────────────

/** Novel with plain-string IDs (API response, not Mongoose document). */
export interface NovelData extends Omit<IProject, 'characters'> {
  _id: string;
  characters: ICharacter[];
}
