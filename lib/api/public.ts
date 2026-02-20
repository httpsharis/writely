import { apiFetch } from './fetcher';

// ─── Public response types ────────────────────────────────────────────

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
  contentEncoding?: string;
  order: number;
  wordCount: number;
  novelTitle: string;
  authorName: string;
  prevChapter: { _id: string; title: string } | null;
  nextChapter: { _id: string; title: string } | null;
  totalChapters: number;
  chapterNumber: number;
}

// ─── Public endpoints (no auth) ──────────────────────────────────────

export async function fetchPublicNovel(novelId: string): Promise<PublicNovel> {
  return apiFetch<PublicNovel>(`/api/public/novels/${novelId}`);
}

export async function fetchPublicChapters(novelId: string): Promise<PublicChapterSummary[]> {
  return apiFetch<PublicChapterSummary[]>(`/api/public/chapters?novelId=${novelId}`);
}

export async function fetchPublicChapter(
  novelId: string,
  chapterId: string,
): Promise<PublicChapter> {
  const data = await apiFetch<PublicChapter>(
    `/api/public/chapters/${chapterId}?novelId=${novelId}`,
  );

  // Decode base64-obfuscated content sent by the server
  if (data.contentEncoding === 'base64' && typeof data.content === 'string') {
    try {
      data.content = JSON.parse(atob(data.content));
    } catch {
      // Keep content as-is if decode fails
    }
  }

  return data;
}
