import { createApi } from '@reduxjs/toolkit/query/react';
import { sharedBaseQuery } from '@/redux/api/baseQuery'; // Use your shared query!

export interface LikeStatusResponse {
  isLiked: boolean;
}

export interface ToggleLikeResponse {
  isLiked: boolean;
  likesCount: number;
}

/**
 * API Slice for handling user likes on documents.
 * Uses optimistic updates to ensure instant UI feedback when a user clicks "Like".
 */
export const likeApi = createApi({
  reducerPath: 'likeApi',
  baseQuery: sharedBaseQuery,
  // We include 'Document' here so we can trigger a refresh of the Document's like count
  tagTypes: ['Like', 'Document'], 
  endpoints: (builder) => ({
        
    /**
     * Fetches whether the current user has liked a specific document.
     */
    getLikeStatus: builder.query<LikeStatusResponse, string>({
      query: (documentId) => `/likes/${documentId}/status`,
      providesTags: (result, error, documentId) => [{ type: 'Like', id: documentId }],
    }),

    /**
     * Toggles a like on a document.
     * Uses onQueryStarted to optimistically update the cache instantly,
     * preventing UI flicker while waiting for the server.
     */
    toggleLike: builder.mutation<ToggleLikeResponse, string>({
      query: (documentId) => ({
        url: `/likes/${documentId}`,
        method: 'POST',
      }),
      async onQueryStarted(documentId, { dispatch, queryFulfilled }) {
        // Optimistically update the Like status to true instantly
        const patchResult = dispatch(
          likeApi.util.updateQueryData('getLikeStatus', documentId, (draft) => {
            draft.isLiked = !draft.isLiked; // Toggle it instantly in the UI
          })
        );
        try {
          await queryFulfilled;
          // If successful, invalidate the Document tag so the total count updates in the background
          dispatch(
            likeApi.util.invalidateTags([{ type: 'Document', id: documentId }])
          );
        } catch {
          // If the request fails, roll back the optimistic update
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