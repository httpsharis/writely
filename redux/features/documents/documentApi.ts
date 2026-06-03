import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// 1. Create a small, local shape of our auth state. 
// We do this to prevent a "circular dependency" error with our main store.
interface StateWithAuth {
    auth: {
        accessToken: string | null;
    };
}

// 2. Define exactly what a "Document" looks like when it comes from the database.
export interface Document {
    _id: string; // MongoDB's default ID
    id?: string; // Our custom mapped ID
    title: string;
    slug: string; // The URL-friendly version of the title
    type: 'novel' | 'chapter';
    status: 'draft' | 'published' | 'archived';
    parentId: string | null; // Null if it's a novel, holds an ID if it's a chapter
    order: number; // Used for arranging chapters

    content?: any; // The rich-text JSON from Tiptap/Novel editor
    coverImage?: string;
    icon?: string;
    synopsis?: string;
    genre?: string[];

    createdAt: string;
    updatedAt: string;
    deletedAt: string | null; // Used for our "soft delete" trash bin
    children: Document[]; // Holds the child chapters when we fetch a full novel
}

// 3. Define the exact data needed to create a new document
export interface CreateDocumentPayload {
    title: string;
    type: 'novel' | 'chapter';
    parentId?: string | null;
}

// 4. Define the exact data needed to update an existing document
export interface UpdateDocumentPayload {
    id: string;
    data: Partial<Document>; // "Partial" means we can update just one field or all of them
}

// 5. Build the actual API Slice
export const documentApi = createApi({
    // The unique name for this slice in the Redux store
    reducerPath: 'documentApi',
    
    // Set up the base URL and default settings for every request
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api',
        
        // This function runs right before every API call
        prepareHeaders(headers, { getState }) {
            // Grab the current state and extract the login token
            const state = getState() as StateWithAuth;
            const token = state.auth.accessToken;
            
            // If the user is logged in, attach the token as an authorization header
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    
    // Tag types act like labels for our cached data. 
    // When we invalidate a tag, Redux knows it needs to fetch fresh data.
    tagTypes: ['Document', 'Trash'], 

    // 6. Define all of our specific API endpoints (GET, POST, PUT, DELETE)
    endpoints: (builder) => ({
        
        // Fetch all of the user's active novels for the dashboard
        getDocuments: builder.query<{ documents: Document[] }, void>({
            query: () => '/documents',
            // Label this list so we can update it later when a new document is made
            providesTags: (result) =>
                result
                    ? [
                        ...result.documents.map(({ _id }) => ({ type: 'Document' as const, id: _id })),
                        { type: 'Document', id: 'LIST' },
                    ]
                    : [{ type: 'Document', id: 'LIST' }],
        }),

        // Fetch one specific document by its ID (used in the editor)
        getDocumentById: builder.query<{ document: Document }, string>({
            query: (id) => `/documents/${id}`,
            // Label this specific document so it updates when we edit it
            providesTags: (result, error, id) => [{ type: 'Document', id }],
        }),

        // Create a new novel or chapter
        createDocument: builder.mutation<{ document: Document }, CreateDocumentPayload>({
            query: (body) => ({
                url: '/documents',
                method: 'POST',
                body,
            }),
            // Tell Redux that the main list is out of date and needs a refresh
            invalidatesTags: [{ type: 'Document', id: 'LIST' }],
        }),

        // Update an existing document (triggered by auto-save)
        updateDocument: builder.mutation<{ document: Document }, UpdateDocumentPayload>({
            query: ({ id, data }) => ({
                url: `/documents/${id}`,
                method: 'PUT',
                body: data,
            }),
            // Tell Redux to refresh the cached data for this specific document
            invalidatesTags: (result, error, { id }) => [{ type: 'Document', id }],
        }),

        // Soft delete a document (move to trash)
        trashDocument: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/documents/${id}`,
                method: 'DELETE',
            }),
            // Refresh the main list, the specific document, AND the trash list
            invalidatesTags: (result, error, id) => [
                { type: 'Document', id: 'LIST' },
                { type: 'Document', id },
                { type: 'Trash', id: 'LIST' }
            ],
        }),

        // Fetch all documents currently sitting in the trash
        getTrash: builder.query<{ documents: Document[] }, void>({
            query: () => '/documents/trash',
            // Label this data as "Trash"
            providesTags: ['Trash'],
        }),

        // Restore a document from the trash back to the main library
        restoreFromTrash: builder.mutation<{ document: Document }, string>({
            query: (id) => ({
                url: `/documents/trash/${id}/restore`,
                method: 'PATCH',
            }),
            // Refresh both the main list and the trash list
            invalidatesTags: (result, error, id) => [
                { type: 'Document', id: 'LIST' },
                { type: 'Trash', id: 'LIST' }
            ],
        }),

        // Public route for readers viewing a published document via its slug URL
        getPublicDocument: builder.query<{ document: Document }, string>({
            query: (slug) => `/documents/public/${slug}`,
            // We don't need tags here because public readers can't edit or delete things
        }),
    })
});

// 7. Export the auto-generated React hooks for our components to use
export const {
    useGetDocumentsQuery,
    useGetDocumentByIdQuery,
    useCreateDocumentMutation,
    useUpdateDocumentMutation,
    useTrashDocumentMutation,
    useGetTrashQuery,
    useRestoreFromTrashMutation,
    useGetPublicDocumentQuery,
} = documentApi;