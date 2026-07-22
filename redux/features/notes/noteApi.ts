import { createApi } from "@reduxjs/toolkit/query/react";
import { sharedBaseQuery } from "@/redux/api/baseQuery";

/**
 * Represents a note in the system.
 * Notes can be global (Inbox) or tied to a specific novel.
 */
export interface Note {
  _id: string;
  novelId?: string;
  title: string;
  // Replaced 'any' with a safe, generic object type for rich text JSON
  content?: Record<string, unknown>; 
  type: 'lore' | 'plot' | 'worldbuilding' | 'research' | 'timeline' | 'misc';
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
  page?: number;  // Changed from string to number
  limit?: number; // Changed from string to number
}

export interface UpdateNotePayload {
  noteId: string;
  data: Partial<Note>;
}

/**
 * API Slice for managing Notes (global inbox & novel-specific).
 */
export const noteApi = createApi({
  reducerPath: 'noteApi',
  baseQuery: sharedBaseQuery,
  tagTypes: ['Note'],
  endpoints: (builder) => ({
      
    /**
     * Fetches all global notes for the user's Inbox.
     */
    getInboxNotes: builder.query<{ notes: Note[], total: number }, void>({
      query: () => '/notes',
      providesTags: (result) =>
        result
          ? [
              ...result.notes.map(({ _id }) => ({ type: 'Note' as const, id: _id })),
              { type: 'Note' as const, id: 'LIST' },
            ]
          : [{ type: 'Note' as const, id: 'LIST' }],
    }),

    /**
     * Fetches notes for a specific novel with optional filtering and pagination.
     */
    getNovelNotes: builder.query<{ notes: Note[], total: number }, GetNotesParams>({
      query: ({ novelId, type, page = 1, limit = 20 }) => ({
        url: `/notes/novel/${novelId}`,
        // RTK Query handles URL encoding and '?'/'&' automatically!
        params: { page, limit, type }, 
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.notes.map(({ _id }) => ({ type: 'Note' as const, id: _id })),
              { type: 'Note' as const, id: 'LIST' },
            ]
          : [{ type: 'Note' as const, id: 'LIST' }],
    }),

    /**
     * Creates a global note for the Inbox (no novelId attached).
     */
    createInboxNote: builder.mutation<{ note: Note }, { data: Partial<Note> }>({
      query: ({ data }) => ({
        url: `/notes`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Note', id: 'LIST' }],
    }),

    /**
     * Creates a note tied to a specific novel.
     */
    createNote: builder.mutation<{ note: Note }, CreateNotePayload>({
      query: ({ novelId, data }) => ({
        url: `/notes/novel/${novelId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Note', id: 'LIST' }],
    }),

    /**
     * Updates an existing note.
     */
    updateNote: builder.mutation<{ note: Note }, UpdateNotePayload>({
      query: ({ noteId, data }) => ({
        url: `/notes/${noteId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { noteId }) => [{ type: 'Note', id: noteId }],
    }),

    /**
     * Deletes a note by ID.
     */
    deleteNote: builder.mutation<void, string>({
      query: (noteId) => ({
        url: `/notes/${noteId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, noteId) => [
        { type: 'Note', id: 'LIST' },
        { type: 'Note', id: noteId },
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