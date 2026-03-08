import { apiFetch } from './fetcher';

// ─── Note client type ────────────────────────────────────────────────

export interface NoteData {
  _id: string;
  userEmail: string;
  novelId: string | null;
  novelTitle: string | null;
  title: string;
  content: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ─── Notes CRUD ──────────────────────────────────────────────────────

export async function fetchNotes(): Promise<NoteData[]> {
  return apiFetch<NoteData[]>('/api/notes');
}

export async function createNote(input: {
  novelId?: string;
  novelTitle?: string;
  title?: string;
  content?: Record<string, unknown>;
}): Promise<NoteData> {
  return apiFetch<NoteData>('/api/notes', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateNote(
  noteId: string,
  data: Record<string, unknown>,
): Promise<NoteData> {
  return apiFetch<NoteData>(`/api/notes/${noteId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteNote(noteId: string): Promise<void> {
  await apiFetch(`/api/notes/${noteId}`, { method: 'DELETE' });
}
