import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// 1. Create a local interface for the exact piece of state we need.
// This completely breaks the circular dependency with store.ts!
interface StateWithAuth {
    auth: {
        accessToken: string | null;
    };
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api',
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => {
            // 2. Cast the state using our local interface instead of RootState
            const state = getState() as StateWithAuth;
            
            const token = state.auth.accessToken;

            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    // Added 'Trash' so our documentApi invalidations work perfectly
    tagTypes: ['User', 'Chapter', 'Project', 'Note', 'Document', 'Trash'], 
    endpoints: (builder) => ({}), 
});