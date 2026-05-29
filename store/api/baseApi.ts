import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    prepareHeaders: async (headers) => {
      // Fetch NextAuth session to inject the token if available
      const session = await getSession();
      const token = (session as any)?.user?.id; // Or however you store the token in the session JWT

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Project', 'Chapter', 'Dashboard'],
  endpoints: () => ({}),
});
