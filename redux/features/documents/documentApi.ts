import { sharedBaseQuery } from "@/redux/api/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

/**
 * Represents a document (Novel or Chapter) in the database.
 */
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
  content?: Record<string, unknown>;
  coverImage?: string;
  icon?: string;
  synopsis?: string;
  authorNote?: string;
  genre?: string[];
  likesCount?: number;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  chapters: Document[];
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
  content?: Record<string, unknown>;
}

export interface UpdateDocumentPayload {
  id: string;
  data: Partial<Document>;
}

/**
 * API Slice for managing Documents (Novels & Chapters).
 * Handles CRUD operations, trash management, and public reader interactions.
 */
export const documentApi = createApi({
  reducerPath: "documentApi",
  baseQuery: sharedBaseQuery,
  tagTypes: ["Document", "Trash"],
  endpoints: (builder) => ({
    /**
     * Fetches active documents for the authenticated user.
     * @param params Optional filter object (e.g., { type: "novel" })
     */
    getDocuments: builder.query<{ documents: Document[] }, { type?: string } | void>({
      query: (params) => {
        // Minimalist URL building
        const queryStr = params?.type ? `?type=${params.type}` : "";
        return `/documents${queryStr}`;
      },
      providesTags: (result) =>
        result?.documents
          ? [
              ...result.documents.map(({ _id }) => ({ type: "Document" as const, id: _id })),
              { type: "Document" as const, id: "LIST" },
            ]
          : [{ type: "Document" as const, id: "LIST" }],
    }),

    /**
     * Fetches a single document by ID.
     * Provides tags for both the document itself and its child chapters,
     * ensuring the parent refetches if a child is updated.
     */
    getDocumentById: builder.query<{ document: Document }, string>({
      query: (id) => `/documents/${id}`,
      providesTags: (result) =>
        result
          ? [
              { type: "Document" as const, id: result.document._id },
              ...result.document.chapters.map(({ _id }) => ({ type: "Document" as const, id: _id })),
            ]
          : [{ type: "Document" as const, id: "LIST" }], // Fallback for error state
    }),

    /**
     * Creates a new document.
     * Invalidates the parent document (if chapter) or the global list (if novel).
     */
    createDocument: builder.mutation<{ document: { _id: string; title: string; slug: string } }, CreateDocumentPayload>({
      query: (body) => ({
        url: "/documents",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) =>
        arg.parentId
          ? [{ type: "Document", id: arg.parentId }]
          : [{ type: "Document", id: "LIST" }],
    }),

    /**
     * Updates an existing document (usually triggered by auto-save).
     */
    updateDocument: builder.mutation<{ document: Document }, UpdateDocumentPayload>({
      query: ({ id, data }) => ({
        url: `/documents/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Document", id }],
    }),

    /**
     * Soft-deletes a document, moving it to the trash.
     */
    trashDocument: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/documents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Document", id: "LIST" },
        { type: "Document", id },
        { type: "Trash", id: "LIST" },
      ],
    }),

    /**
     * Fetches all documents currently in the trash.
     */
    getTrash: builder.query<{ documents: Document[] }, void>({
      query: () => "/documents/trash",
      providesTags: [{ type: "Trash", id: "LIST" }],
    }),

    /**
     * Restores a document from the trash back to the active library.
     */
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

    /**
     * Public route: Fetches a published document via its slug.
     */
    getPublicDocument: builder.query<{ document: Document }, string>({
      query: (slug) => `/documents/public/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Document", id: slug }],
    }),

    /**
     * Public route: Likes a document.
     */
    likePublicDocument: builder.mutation<{ message: string }, string>({
      query: (slug) => ({
        url: `/documents/public/${slug}/like`,
        method: "POST",
      }),
      invalidatesTags: (result, error, slug) => [{ type: "Document", id: slug }],
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
} = documentApi;