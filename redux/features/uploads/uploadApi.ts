import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface StateWithAuth {
    auth: {
        accessToken: string | null;
    };
}

export interface UploadResponse {
    message: string;
    url: string; // The secure Cloudinary URL to save in your database
}

export const uploadApi = createApi({
    reducerPath: 'uploadApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api',
        prepareHeaders(headers, { getState }) {
            const state = getState() as StateWithAuth;
            const token = state.auth.accessToken;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            // Note: We DO NOT set 'Content-Type': 'application/json' here!
            // When using FormData, the browser automatically sets the correct 
            // multipart/form-data boundary headers for us.
            return headers;
        },
    }),
    endpoints: (builder) => ({
        uploadImage: builder.mutation<UploadResponse, File>({
            query: (file) => {
                // We pack the file into a FormData object right before sending
                const body = new FormData();
                body.append('image', file); // 'image' matches upload.single('image') in your backend

                return {
                    url: '/upload',
                    method: 'POST',
                    body,
                };
            },
        }),
    }),
});

export const { useUploadImageMutation } = uploadApi;