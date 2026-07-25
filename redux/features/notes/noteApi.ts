/**
 * @file noteApi.ts
 * @desc RTK Query endpoints for managing both Global Inbox Notes and Novel-specific Notes.
 * Injects into the master apiSlice to share auth middleware and global caching.
 */

import { apiSlice } from "../../api/apiSlice";

// --- Strict Interfaces ---

export interface Note {
  _id: string;
  novelId?: string;
  title: string;
  content?: Record<string, unknown> | string; // Supports Tiptap JSON or raw text
  type: "lore" | "plot" | "worldbuilding" | "research" | "timeline" | "misc";
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotePayload {
  novelId: string;
  data: Partial<Note>;
}

export interface GetNotesParams {
  novelId: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface UpdateNotePayload {
  noteId: string;
  data: Partial<Note>;
}

// --- API Injection ---

export const noteApi = apiSlice.injectEndpoints({
  overrideExisting: true, // Prevents Next.js hot-reload crashes
  endpoints: (builder) => ({
      
    /** Fetches all global notes for the user's universal Inbox. */
    getInboxNotes: builder.query<{ notes: Note[], total: number }, void>({
      query: () => "/notes",
      providesTags: (result) =>
        result
          ? [
              ...result.notes.map(({ _id }) => ({ type: "Note" as const, id: _id })),
              { type: "Note" as const, id: "LIST" },
            ]
          : [{ type: "Note" as const, id: "LIST" }],
    }),

    /** Fetches notes for a specific novel with optional filtering and pagination. */
    getNovelNotes: builder.query<{ notes: Note[], total: number }, GetNotesParams>({
      query: ({ novelId, type, page = 1, limit = 20 }) => ({
        url: `/notes/novel/${novelId}`,
        params: { page, limit, type }, // RTK Query automatically builds the ?page=1&limit=20 string
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.notes.map(({ _id }) => ({ type: "Note" as const, id: _id })),
              { type: "Note" as const, id: "LIST" },
            ]
          : [{ type: "Note" as const, id: "LIST" }],
    }),

    /** Creates a global note for the Inbox (no novelId attached). */
    createInboxNote: builder.mutation<{ note: Note }, { data: Partial<Note> }>({
      query: ({ data }) => ({
        url: `/notes`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Note", id: "LIST" }],
    }),

    /** Creates a note tied strictly to a specific novel. */
    createNote: builder.mutation<{ note: Note }, CreateNotePayload>({
      query: ({ novelId, data }) => ({
        url: `/notes/novel/${novelId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Note", id: "LIST" }],
    }),

    /** Updates an existing note's content, title, or type. */
    updateNote: builder.mutation<{ note: Note }, UpdateNotePayload>({
      query: ({ noteId, data }) => ({
        url: `/notes/${noteId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { noteId }) => [{ type: "Note", id: noteId }],
    }),

    /** Permanently deletes a note by ID. */
    deleteNote: builder.mutation<void, string>({
      query: (noteId) => ({
        url: `/notes/${noteId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, noteId) => [
        { type: "Note", id: "LIST" },
        { type: "Note", id: noteId },
      ],
    }),
    
  }),
});

export const {
  useGetInboxNotesQuery,
  useGetNovelNotesQuery,
  useCreateInboxNoteMutation,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = noteApi;