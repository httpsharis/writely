/**
 * @file searchApi.ts
 * @desc RTK Query endpoints for the Global Search feature.
 * Injects into the master apiSlice to share auth middleware.
 */

import { apiSlice } from "../../api/apiSlice";

// --- Strict Types ---
export type SearchableEntityType = "novel" | "chapter" | "note" | "user";

export interface GlobalSearchResult {
  _id: string;
  type: SearchableEntityType;
  title: string;
  slug?: string;
  excerpt?: string;
  updatedAt: string;
  metadata?: Record<string, unknown>; 
}

export interface SearchParams {
  q: string;
  types?: SearchableEntityType[];
  limit?: number;
}

// --- API Injection ---
export const searchApi = apiSlice.injectEndpoints({
  overrideExisting: true, // Prevents Next.js hot-reload crashes
  endpoints: (builder) => ({
    
    /**
     * Performs a global search across the entire platform.
     * Caches strictly based on the query arguments.
     */
    globalSearch: builder.query<{ results: GlobalSearchResult[] }, SearchParams>({
      query: ({ q, types, limit = 10 }) => ({
        url: "/search",
        // RTK Query automatically builds the URL string and ignores undefined params
        params: {
          q,
          types: types?.join(","), 
          limit,
        },
      }),
      // We don't provide tags here because search results are highly dynamic.
      // Caching them based on the exact search string is sufficient.
    }),
    
  }),
});

export const { useGlobalSearchQuery } = searchApi;