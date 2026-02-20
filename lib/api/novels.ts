import { apiFetch } from './fetcher';
import type { NovelData } from './types';

// ─── In-memory cache ─────────────────────────────────────────────────
// Avoids redundant list refetches during the same browser session.

let novelsCache: { data: NovelData[]; timestamp: number } | null = null;
const NOVELS_CACHE_TTL = 5_000; // 5 seconds

export async function fetchNovels(): Promise<NovelData[]> {
  if (novelsCache && Date.now() - novelsCache.timestamp < NOVELS_CACHE_TTL) {
    return novelsCache.data;
  }
  const data = await apiFetch<NovelData[]>('/api/novels');
  novelsCache = { data, timestamp: Date.now() };
  return data;
}

/** Bust the cache after create / delete so the next fetch is fresh. */
export function invalidateNovelsCache(): void {
  novelsCache = null;
}

// ─── Novel CRUD ──────────────────────────────────────────────────────

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

// ─── Publish ─────────────────────────────────────────────────────────

export async function togglePublish(
  novelId: string,
  isPublished: boolean,
): Promise<NovelData> {
  return updateNovel(novelId, { isPublished });
}

// ─── Author notes ────────────────────────────────────────────────────

export async function addAuthorNote(novelId: string, text: string): Promise<NovelData> {
  return updateNovel(novelId, { addAuthorNote: text });
}

export async function removeAuthorNote(novelId: string, noteId: string): Promise<NovelData> {
  return updateNovel(novelId, { removeAuthorNoteId: noteId });
}

// ─── Characters ──────────────────────────────────────────────────────

export async function addCharacter(
  novelId: string,
  char: { name: string; role: string; description?: string },
): Promise<NovelData> {
  return updateNovel(novelId, { addCharacter: char });
}

export async function removeCharacter(
  novelId: string,
  characterId: string,
): Promise<NovelData> {
  return updateNovel(novelId, { removeCharacterId: characterId });
}
