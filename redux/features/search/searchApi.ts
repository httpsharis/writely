import { createApi } from "@reduxjs/toolkit/query/react";
import { sharedBaseQuery } from "@/redux/api/baseQuery";

export interface SearchResult {
  _id: string;
  title: string;
  slug: string;
  type: "novel" | "chapter";
  updatedAt: string;
}

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: sharedBaseQuery,
  endpoints: (builder) => ({
    searchDocuments: builder.query<SearchResult[], string>({
      query: (searchTerm) => `/search?q=${encodeURIComponent(searchTerm)}`,
    }),
  }),
});

export const { useSearchDocumentsQuery } = searchApi;