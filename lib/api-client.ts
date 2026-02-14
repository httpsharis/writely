/**
 * Client-side API functions for Writely.
 *
 * These run in the browser and talk to our Next.js API routes.
 * Every function returns typed data or throws on error.
 */

import type { IProject, ICharacter } from '@/types/project';
import type { IChapter, UpdateChapterInput, AddCommentInput, WriterComment } from '@/types/chapter';

// ─── Types for API responses ────────────────────────────────────────

/** Lightweight chapter data returned by the sidebar endpoint */
export interface ChapterSummary {
  _id: string;
  title: string;
  order: number;
  status: 'draft' | 'published';
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

/** Full chapter with content (from editor endpoint) */
export interface ChapterFull extends Omit<IChapter, '_id' | 'projectId'> {
  _id: string;
  projectId: string;
}

/** Novel with string IDs (from API, not Mongoose) */
export interface NovelData extends Omit<IProject, 'characters'> {
  _id: string;
  characters: ICharacter[];
}

// ─── Internal fetch helper ──────────────────────────────────────────

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data as T;
}

// ─── Novel endpoints ────────────────────────────────────────────────

export async function fetchNovels(): Promise<NovelData[]> {
  return apiFetch<NovelData[]>('/api/novels');
}

export async function fetchNovel(novelId: string): Promise<NovelData> {
  return apiFetch<NovelData>(`/api/novels/${novelId}`);
}

export async function createNovel(title?: string): Promise<NovelData> {
  return apiFetch<NovelData>('/api/novels', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}

export async function deleteNovel(novelId: string): Promise<void> {
  await apiFetch(`/api/novels/${novelId}`, { method: 'DELETE' });
}

export async function updateNovel(
  novelId: string,
  data: Record<string, unknown>,
): Promise<NovelData> {
  return apiFetch<NovelData>(`/api/novels/${novelId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// ─── Chapter list (sidebar) ─────────────────────────────────────────

export async function fetchChapters(novelId: string): Promise<ChapterSummary[]> {
  return apiFetch<ChapterSummary[]>(`/api/novels/${novelId}/chapters`);
}

export async function createChapter(
  novelId: string,
  title?: string
): Promise<ChapterFull> {
  return apiFetch<ChapterFull>(`/api/novels/${novelId}/chapters`, {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}

// ─── Chapter editor (full content) ──────────────────────────────────

export async function fetchChapter(
  novelId: string,
  chapterId: string
): Promise<ChapterFull> {
  return apiFetch<ChapterFull>(`/api/novels/${novelId}/chapters/${chapterId}`);
}

export async function saveChapter(
  novelId: string,
  chapterId: string,
  data: UpdateChapterInput
): Promise<ChapterFull> {
  return apiFetch<ChapterFull>(
    `/api/novels/${novelId}/chapters/${chapterId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );
}

export async function deleteChapter(
  novelId: string,
  chapterId: string
): Promise<void> {
  await apiFetch(`/api/novels/${novelId}/chapters/${chapterId}`, {
    method: 'DELETE',
  });
}

// ─── Chapter status toggle ──────────────────────────────────────────

export async function toggleChapterStatus(
  novelId: string,
  chapterId: string,
  status: 'draft' | 'published',
): Promise<ChapterFull> {
  return saveChapter(novelId, chapterId, { status } as UpdateChapterInput);
}

// ─── Writer comments ────────────────────────────────────────────────

export async function addComment(
  novelId: string,
  chapterId: string,
  comment: AddCommentInput,
): Promise<ChapterFull> {
  return apiFetch<ChapterFull>(
    `/api/novels/${novelId}/chapters/${chapterId}`,
    { method: 'PATCH', body: JSON.stringify({ addComment: comment }) },
  );
}

export async function removeComment(
  novelId: string,
  chapterId: string,
  commentId: string,
): Promise<ChapterFull> {
  return apiFetch<ChapterFull>(
    `/api/novels/${novelId}/chapters/${chapterId}`,
    { method: 'PATCH', body: JSON.stringify({ removeCommentId: commentId }) },
  );
}

export async function resolveComment(
  novelId: string,
  chapterId: string,
  commentId: string,
): Promise<ChapterFull> {
  return apiFetch<ChapterFull>(
    `/api/novels/${novelId}/chapters/${chapterId}`,
    { method: 'PATCH', body: JSON.stringify({ resolveCommentId: commentId }) },
  );
}

// ─── Characters ─────────────────────────────────────────────────────

export async function addCharacter(
  novelId: string,
  char: { name: string; role: string; description?: string },
): Promise<NovelData> {
  return updateNovel(novelId, { addCharacter: char });
}

export async function removeCharacter(
  novelId: string,
  index: number,
): Promise<NovelData> {
  return updateNovel(novelId, { removeCharacterIndex: index });
}

// ─── Publish toggle ─────────────────────────────────────────────────

export async function togglePublish(
  novelId: string,
  isPublished: boolean,
): Promise<NovelData> {
  return updateNovel(novelId, { isPublished });
}

// ─── Author Notes ───────────────────────────────────────────────────

export async function addAuthorNote(
  novelId: string,
  text: string,
): Promise<NovelData> {
  return updateNovel(novelId, { addAuthorNote: text });
}

export async function removeAuthorNote(
  novelId: string,
  index: number,
): Promise<NovelData> {
  return updateNovel(novelId, { removeAuthorNoteIndex: index });
}

// ─── Public reader endpoints (no auth required) ─────────────────────

export interface PublicNovel {
  _id: string;
  title: string;
  description?: string;
  authorName: string;
  status: string;
  stats: { currentWordCount: number; goalWordCount: number };
  characterCount: number;
  publishedChapterCount: number;
  authorNotes: { text: string; createdAt: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface PublicChapterSummary {
  _id: string;
  title: string;
  order: number;
  wordCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicChapter {
  _id: string;
  title: string;
  content: Record<string, unknown> | string;
  contentType: string;
  order: number;
  wordCount: number;
  novelTitle: string;
  authorName: string;
  prevChapter: { _id: string; title: string } | null;
  nextChapter: { _id: string; title: string } | null;
  totalChapters: number;
  chapterNumber: number;
}

export async function fetchPublicNovel(novelId: string): Promise<PublicNovel> {
  return apiFetch<PublicNovel>(`/api/public/novels/${novelId}`);
}

export async function fetchPublicChapters(novelId: string): Promise<PublicChapterSummary[]> {
  return apiFetch<PublicChapterSummary[]>(`/api/public/novels/${novelId}/chapters`);
}

export async function fetchPublicChapter(
  novelId: string,
  chapterId: string,
): Promise<PublicChapter> {
  return apiFetch<PublicChapter>(`/api/public/novels/${novelId}/chapters/${chapterId}`);
}
