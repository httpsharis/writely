import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api',
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => {
            // 1. Get the current Redux state
            const state = getState() as RootState;
            
            // 2. Grab the access token from the auth slice
            const token = state.auth.accessToken;

            // 3. If a token exists, attach it to the Authorization header
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: ['User', 'Chapter', 'Project', 'Note', 'Document'], 
    endpoints: (builder) => ({}), 
});