import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface StateWithAuth {
    auth: {
        accessToken: string | null;
    };
}

export const searchApi = createApi({
    reducerPath: 'searchApi',
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
        searchDocs: builder.query<any[], string>({
            query: (searchTerm) => `/search?q=${searchTerm}`,
        }),
    }),
});

export const { useSearchDocsQuery } = searchApi;