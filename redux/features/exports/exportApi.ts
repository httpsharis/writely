import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface StateWithAuth {
    auth: {
        accessToken: string | null;
    };
}

export const exportApi = createApi({
    reducerPath: 'exportApi',
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
    endpoints: (builder) => ({
        // We use a mutation so the download only triggers when the user clicks a button
        exportNovel: builder.mutation<string, string>({
            query: (novelId) => ({
                url: `/export/novel/${novelId}`,
                method: 'GET',
                // CRITICAL: Tells Redux not to crash trying to parse Markdown as JSON
                responseHandler: 'text', 
            }),
        }),
    }),
});

export const { useExportNovelMutation } = exportApi;