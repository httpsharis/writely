import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface StateWithAuth {
    auth: {
        accessToken: string | null;
    };
}

export interface LikeStatusResponse {
    isLiked: boolean;
}

export interface ToggleLikeResponse {
    isLiked: boolean;
    likesCount: number;
}

export const likeApi = createApi({
    reducerPath: 'likeApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api',
        prepareHeaders(headers, { getState }) {
            const state = getState() as StateWithAuth;
            const token = state.auth.accessToken;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    // We include 'Document' here so we can trigger a refresh of the Document's like count
    tagTypes: ['Like', 'Document'], 

    endpoints: (builder) => ({
        
        // GET /api/likes/:documentId/status
        getLikeStatus: builder.query<LikeStatusResponse, string>({
            query: (documentId) => `/likes/${documentId}/status`,
            providesTags: (result, error, documentId) => [{ type: 'Like', id: documentId }],
        }),

        // POST /api/likes/:documentId
        toggleLike: builder.mutation<ToggleLikeResponse, string>({
            query: (documentId) => ({
                url: `/likes/${documentId}`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, documentId) => [
                { type: 'Like', id: documentId },
                { type: 'Document', id: documentId } // Refreshes the document to get the new total count!
            ],
        }),
    }),
});

export const {
    useGetLikeStatusQuery,
    useToggleLikeMutation,
} = likeApi;