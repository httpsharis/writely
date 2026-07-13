import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export const sharedBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api',
    credentials: 'include',
    
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken;

        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});