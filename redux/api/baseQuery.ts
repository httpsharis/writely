import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface StateWithAuth {
    auth: {
        accessToken: string | null;
    };
}

export const sharedBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as StateWithAuth;
        const token = state.auth?.accessToken;
        
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});