/**
 * @file likeApi.ts
 * @desc RTK Query endpoints for handling document likes.
 * Uses Optimistic Updates to ensure instant UI feedback (zero latency).
 */

import { apiSlice } from "../../api/apiSlice";

export interface LikeStatusResponse {
  isLiked: boolean;
}

export interface ToggleLikeResponse {
  isLiked: boolean;
  likesCount: number;
}

export const likeApi = apiSlice.injectEndpoints({
  overrideExisting: true, // Prevents Next.js hot-reload crashes
  endpoints: (builder) => ({
    
    /** Fetches whether the current user has liked a specific document. */
    getLikeStatus: builder.query<LikeStatusResponse, string>({
      query: (documentId) => `/likes/${documentId}/status`,
      providesTags: (_, __, documentId) => [{ type: "Likes", id: documentId }],
    }),

    /** * Toggles a like on a document.
     * Uses onQueryStarted to optimistically update the cache instantly.
     */
    toggleLike: builder.mutation<ToggleLikeResponse, string>({
      query: (documentId) => ({
        url: `/likes/${documentId}`,
        method: "POST",
      }),
      // 🟢 Automatically refetches the Document to update the total 'likesCount' for other readers
      invalidatesTags: (_, __, documentId) => [{ type: "Document", id: documentId }],
      
      async onQueryStarted(documentId, { dispatch, queryFulfilled }) {
        // 🟢 Optimistically update the Like status to true/false instantly in the UI
        const patchResult = dispatch(
          likeApi.util.updateQueryData("getLikeStatus", documentId, (draft) => {
            draft.isLiked = !draft.isLiked; 
          })
        );
        try {
          await queryFulfilled; // Wait for the backend to confirm
        } catch {
          // 🔴 If the backend fails (network error), instantly roll back the heart icon
          patchResult.undo();
        }
      },
    }),
    
  }),
});

export const {
  useGetLikeStatusQuery,
  useToggleLikeMutation,
} = likeApi;