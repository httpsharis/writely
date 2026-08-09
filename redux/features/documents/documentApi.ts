/**
 * @file documentApi.ts
 * @desc RTK Query endpoints for Document (Novel & Chapter) management.
 * Injects into the master apiSlice to share auth middleware and caching.
 */

import { apiSlice } from "../../api/apiSlice";

// --- Strict Interfaces ---

export interface Document {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  type: "novel" | "chapter";
  status: "draft" | "published" | "archived";
  parentId: string | null;
  order: number;
  wordCount?: number;
  content?: Record<string, unknown> | string; // Handled Tiptap JSON or plain text
  coverImage?: string;
  icon?: string;
  synopsis?: string;
  authorNote?: string;
  genre?: string[];
  likesCount?: number;
  viewsCount?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  characters?: Record<string, unknown>[];
  chapters?: Document[];
}

export interface CreateDocumentPayload {
  title: string;
  type: "novel" | "chapter";
  parentId?: string | null;
  tags?: string[];
  targetWords?: number;
  synopsis?: string;
  authorNote?: string;
  coverImage?: string;
  content?: Record<string, unknown> | string;
}

export interface UpdateDocumentPayload {
  id: string;
  data: Partial<Document>;
}

// --- API Injection ---

export const documentApi = apiSlice.injectEndpoints({
  overrideExisting: true, // Prevents Next.js hot-reload crashes
  endpoints: (builder) => ({
    /** Fetches active documents for the authenticated user, optionally filtered by type. */
    getDocuments: builder.query<
      { documents: Document[] },
      { type?: string } | void
    >({
      query: (params) =>
        `/documents${params?.type ? `?type=${params.type}` : ""}`,
      providesTags: (result) =>
        result?.documents
          ? [
            ...result.documents.map(({ _id }) => ({
              type: "Document" as const,
              id: _id,
            })),
            { type: "Document" as const, id: "LIST" },
          ]
          : [{ type: "Document" as const, id: "LIST" }],
    }),

    /** Fetches a single document and deeply caches its child chapters. */
    getDocumentById: builder.query<{ document: Document }, string>({
      query: (id) => `/documents/${id}`,
      providesTags: (result) =>
        result?.document
          ? [
            { type: "Document" as const, id: result.document._id },
            ...(result.document.chapters?.map(({ _id }) => ({
              type: "Document" as const,
              id: _id,
            })) || []),
          ]
          : [{ type: "Document" as const, id: "LIST" }],
    }),

    /** Creates a new document. Invalidates parent cache if it's a chapter. */
    createDocument: builder.mutation<
      { document: { _id: string; title: string; slug: string } },
      CreateDocumentPayload
    >({
      query: (body) => ({ url: "/documents", method: "POST", body }),
      invalidatesTags: (_, __, arg) =>
        arg.parentId
          ? [{ type: "Document", id: arg.parentId }]
          : [{ type: "Document", id: "LIST" }],
    }),

    /** Updates an existing document (e.g., auto-save). */
    /** Updates an existing document with Senior-level Optimistic Caching */
    updateDocument: builder.mutation<{ document: Document }, UpdateDocumentPayload>({
      query: ({ id, data }) => ({
        url: `/documents/${id}`,
        method: "PUT",
        body: data,
      }),
      // 🟢 OPTIMISTIC UPDATE: We intercept the cache and update it instantly in memory
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          documentApi.util.updateQueryData('getDocumentById', id, (draft) => {
            // Instantly merge the new data (like wordCount) into the local Redux cache
            Object.assign(draft.document, data);
          })
        );
        try {
          await queryFulfilled; // Wait for the actual DB save to confirm
        } catch {
          patchResult.undo(); // If the internet drops or DB fails, roll back the UI
        }
      },
      invalidatesTags: (_, __, { id }) => [
        { type: "Document", id },
        "Document",
        "Project"
      ],
    }),

    /** Soft-deletes a document, moving it to the trash. */
    trashDocument: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/documents/${id}`, method: "DELETE" }),
      invalidatesTags: (_, __, id) => [
        { type: "Document", id: "LIST" },
        { type: "Document", id },
        { type: "Trash", id: "LIST" },
      ],
    }),

    /** Fetches all soft-deleted documents in the user's trash. */
    getTrash: builder.query<{ documents: Document[] }, void>({
      query: () => "/documents/trash",
      providesTags: [{ type: "Trash", id: "LIST" }],
    }),

    /** Restores a document from the trash back to the active library. */
    restoreFromTrash: builder.mutation<{ document: Document }, string>({
      query: (id) => ({
        url: `/documents/trash/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "Document", id: "LIST" },
        { type: "Trash", id: "LIST" },
      ],
    }),

    /** Public route: Fetches a published document via its slug. */
    getPublicDocument: builder.query<{ document: Document }, string>({
      query: (slug) => `/documents/public/${slug}`,
      providesTags: (_, __, slug) => [{ type: "Document", id: slug }],
    }),

    /** Public route: Likes a document. */
    likePublicDocument: builder.mutation<{ message: string }, string>({
      query: (slug) => ({
        url: `/documents/public/${slug}/like`,
        method: "POST",
      }),
      invalidatesTags: (_, __, slug) => [{ type: "Document", id: slug }],
    }),

    recordView: builder.mutation<{ success: boolean; viewsCount: number }, string>({
      query: (slug) => ({
        url: `/documents/public/${slug}/view`, // Ensure this matches your backend route!
        method: "POST",
      }),
      // We don't invalidate tags here because we don't want to force 
      // the whole page to reload just because a view was counted!
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useGetDocumentByIdQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useTrashDocumentMutation,
  useGetTrashQuery,
  useRestoreFromTrashMutation,
  useGetPublicDocumentQuery,
  useLikePublicDocumentMutation,
  useRecordViewMutation
} = documentApi;
