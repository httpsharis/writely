import { createApi } from "@reduxjs/toolkit/query/react";
import { sharedBaseQuery } from "@/redux/api/baseQuery";

export interface Note {
    _id: string;
    novelId?: string;
    title: string;
    content?: any;
    type: 'lore' | 'plot' | 'worldbuilding' | 'research' | 'timeline' | 'misc';
    createdAt: string;
    updatedAt: string;
}

export interface CreateNotePayLoad {
    novelId: string;
    data: Partial<Note>
}

export interface GetNotesParams {
    novelId: string;
    type?: string;
    page?: string;
    limit?: string;
}

export interface UpdateNotePayload {
    noteId: string;
    data: Partial<Note>
}

export const noteApi = createApi({
    reducerPath: 'noteApi',
    baseQuery: sharedBaseQuery,
    tagTypes: ['Note'],

    endpoints: (builder) => ({
        // GET /api/notes
        // Fetches all notes globally (for Inbox)
        getInboxNotes: builder.query<{ notes: Note[], total: number }, void>({
            query: () => '/notes',
            providesTags: (result) =>
                result
                    ? [
                        ...result.notes.map(({ _id }) => ({ type: 'Note' as const, id: _id })),
                        { type: 'Note', id: 'LIST' }
                    ]
                    : [{ type: 'Note', id: 'LIST' }]
        }),

        // GET /api/notes/novel/:novelId?type=...&page=...
        getNovelNotes: builder.query<{ notes: Note[], total: number }, GetNotesParams>({
            query: ({ novelId, type, page = 1, limit = 20 }) => {
                let url = `/notes/novel/${novelId}?page=${page}&limit=${limit}`;
                if (type) url += `&type=${type}`
                return url;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.notes.map(({ _id }) => ({ type: 'Note' as const, id: _id })),
                        { type: 'Note', id: 'LIST' }
                    ]
                    : [{ type: 'Note', id: 'LIST' }]
        }),

        // POST /api/notes
        // Create an unassigned note for the Inbox
        createInboxNote: builder.mutation<{ note: Note }, { data: Partial<Note> }>({
            query: ({ data }) => ({
                url: `/notes`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Note', id: 'LIST' }]
        }),

        // POST /api/notes/novel/:novelId
        createNote: builder.mutation<{ note: Note }, CreateNotePayLoad>({
            query: ({ novelId, data }) => ({
                url: `/notes/${novelId}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Note', id: 'LIST' }]
        }),

        // PUT /api/notes/:noteId
        updateNote: builder.mutation<{ note: Note }, UpdateNotePayload>({
            query: ({ noteId, data }) => ({
                url: `/notes/${noteId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { noteId }) => [
                { type: 'Note', id: noteId }
            ],
        }),

        // DELETE /api/notes/:noteId
        deleteNote: builder.mutation<void, string>({
            query: (noteId) => ({
                url: `/notes/${noteId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, noteId) => [
                { type: 'Note', id: 'LIST' },
                { type: 'Note', id: noteId }
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