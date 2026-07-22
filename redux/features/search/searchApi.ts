import { createApi } from "@reduxjs/toolkit/query/react";
import { sharedBaseQuery } from "@/redux/api/baseQuery";

/**
 * Represents the type of entities that can be searched globally.
 */
export type SearchableEntityType = "novel" | "chapter" | "note" | "user";

/**
 * Represents a single search result returned from the backend.
 * Uses a discriminated union so the frontend knows exactly what data to expect.
 */
export interface GlobalSearchResult {
  _id: string;
  type: SearchableEntityType;
  title: string;
  slug?: string; // Present for novels/chapters
  excerpt?: string; // A snippet of the content (e.g., note content or chapter text)
  updatedAt: string;
  // Optional metadata specific to the result type
  metadata?: Record<string, unknown>; 
}

export interface SearchParams {
  q: string;
  // Optional filter: allows the UI to search only specific sections if needed
  types?: SearchableEntityType[];
  limit?: number;
}

/**
 * API Slice for global search functionality.
 */
export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: sharedBaseQuery,
  endpoints: (builder) => ({
    
    /**
     * Performs a global search across the entire platform.
     * 
     * @example
     * // Search everything
     * useGlobalSearchQuery({ q: "dragon" });
     * 
     * @example
     * // Search only novels and notes
     * useGlobalSearchQuery({ q: "dragon", types: ["novel", "note"] });
     */
    globalSearch: builder.query<{ results: GlobalSearchResult[] }, SearchParams>({
      query: ({ q, types, limit = 10 }) => ({
        url: "/search",
        // RTK Query automatically handles URL encoding and ignores undefined params
        params: {
          q,
          types: types?.join(","), // Convert array to comma-separated string for the URL
          limit,
        },
      }),
      // We don't provide tags here because search results are highly dynamic 
      // and depend on user input. Caching them based on arguments is sufficient.
    }),
  }),
});

export const { 
  useGlobalSearchQuery 
} = searchApi;