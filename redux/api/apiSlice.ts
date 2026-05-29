import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api',
        prepareHeaders: (headers, { getState }) => {
            // Later, we will grab the token from Redux state and attach it here!
            return headers;
        },
    }),
    // Define all your cache tags here so features can use them
    tagTypes: ['User', 'Chapter', 'Project', 'Note'], 
    endpoints: (builder) => ({}), // We leave this completely empty!
});