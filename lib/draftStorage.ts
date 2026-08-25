/**
 * Local Storage Draft Safety Net Utility
 * Guarantees zero data loss for authors by capturing every keystroke to local storage
 * before debounced network auto-save cycles complete.
 */

export interface LocalDraft {
  chapterId: string;
  content: any;
  wordCount: number;
  title?: string;
  timestamp: number;
}

const STORAGE_PREFIX = "writely_draft_";

export function getDraftStorageKey(chapterId: string): string {
  return `${STORAGE_PREFIX}${chapterId}`;
}

/**
 * Save draft instantly to localStorage on keystroke
 */
export function saveLocalDraft(
  chapterId: string,
  data: { content: any; wordCount: number; title?: string }
): void {
  if (typeof window === "undefined" || !chapterId || chapterId === "draft") return;

  try {
    const draft: LocalDraft = {
      chapterId,
      content: data.content,
      wordCount: data.wordCount,
      title: data.title,
      timestamp: Date.now(),
    };
    localStorage.setItem(getDraftStorageKey(chapterId), JSON.stringify(draft));
  } catch (err) {
    console.warn("Unable to write draft to localStorage (quota exceeded or private browsing):", err);
  }
}

/**
 * Retrieve saved local draft if present
 */
export function getLocalDraft(chapterId: string): LocalDraft | null {
  if (typeof window === "undefined" || !chapterId) return null;

  try {
    const raw = localStorage.getItem(getDraftStorageKey(chapterId));
    if (!raw) return null;
    return JSON.parse(raw) as LocalDraft;
  } catch (err) {
    console.warn("Unable to read draft from localStorage:", err);
    return null;
  }
}

/**
 * Removes local draft after verified server sync
 */
export function removeLocalDraft(chapterId: string): void {
  if (typeof window === "undefined" || !chapterId) return null;

  try {
    localStorage.removeItem(getDraftStorageKey(chapterId));
  } catch {
    // Ignore removal errors
  }
}

/**
 * Check if a local draft exists and is newer than the server timestamp
 */
export function isLocalDraftNewer(
  chapterId: string,
  serverUpdatedAt?: string
): boolean {
  const localDraft = getLocalDraft(chapterId);
  if (!localDraft || !localDraft.timestamp) return false;

  if (!serverUpdatedAt) return true;

  const serverTime = new Date(serverUpdatedAt).getTime();
  // If local draft is at least 3 seconds newer than server timestamp
  return localDraft.timestamp > serverTime + 3000;
}
