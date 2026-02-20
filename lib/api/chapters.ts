import { apiFetch } from './fetcher';
import type { ChapterSummary, ChapterFull } from './types';
import type { UpdateChapterInput, AddCommentInput } from '@/types/chapter';

// ─── Chapter list ─────────────────────────────────────────────────────

export async function fetchChapters(novelId: string): Promise<ChapterSummary[]> {
  return apiFetch<ChapterSummary[]>(`/api/chapters?novelId=${novelId}`);
}

// ─── Chapter CRUD ─────────────────────────────────────────────────────

export async function createChapter(novelId: string, title?: string): Promise<ChapterFull> {
  return apiFetch<ChapterFull>('/api/chapters', {
    method: 'POST',
    body: JSON.stringify({ novelId, title }),
  });
}

export async function fetchChapter(novelId: string, chapterId: string): Promise<ChapterFull> {
  return apiFetch<ChapterFull>(`/api/chapters/${chapterId}`);
}

export async function saveChapter(
  novelId: string,
  chapterId: string,
  data: UpdateChapterInput,
): Promise<ChapterFull> {
  return apiFetch<ChapterFull>(`/api/chapters/${chapterId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteChapter(novelId: string, chapterId: string): Promise<void> {
  await apiFetch(`/api/chapters/${chapterId}`, { method: 'DELETE' });
}

export async function toggleChapterStatus(
  novelId: string,
  chapterId: string,
  status: 'draft' | 'published',
): Promise<ChapterFull> {
  return saveChapter(novelId, chapterId, { status } as UpdateChapterInput);
}

// ─── Writer comments ──────────────────────────────────────────────────

export async function addComment(
  novelId: string,
  chapterId: string,
  comment: AddCommentInput,
): Promise<ChapterFull> {
  return apiFetch<ChapterFull>(`/api/chapters/${chapterId}`, {
    method: 'PATCH',
    body: JSON.stringify({ addComment: comment }),
  });
}

export async function removeComment(
  novelId: string,
  chapterId: string,
  commentId: string,
): Promise<ChapterFull> {
  return apiFetch<ChapterFull>(`/api/chapters/${chapterId}`, {
    method: 'PATCH',
    body: JSON.stringify({ removeCommentId: commentId }),
  });
}

export async function resolveComment(
  novelId: string,
  chapterId: string,
  commentId: string,
): Promise<ChapterFull> {
  return apiFetch<ChapterFull>(`/api/chapters/${chapterId}`, {
    method: 'PATCH',
    body: JSON.stringify({ resolveCommentId: commentId }),
  });
}
