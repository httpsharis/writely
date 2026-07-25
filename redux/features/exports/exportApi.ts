/**
 * @file exportApi.ts
 * @desc RTK Query endpoints for exporting and downloading manuscripts.
 * Injects into the master apiSlice to share auth middleware.
 */

import { apiSlice } from "../../api/apiSlice";

export const exportApi = apiSlice.injectEndpoints({
  overrideExisting: true, // Prevents Next.js hot-reload crashes
  endpoints: (builder) => ({
    
    /** * Exports a specific novel as raw text/Markdown.
     * Useful for displaying the raw output in a UI preview window.
     */
    exportNovel: builder.mutation<string, string>({
      query: (novelId) => ({
        url: `/export/novel/${novelId}`,
        method: "GET",
        responseHandler: "text", 
      }),
    }),

    /** Exports a single chapter as raw text/Markdown. */
    exportChapter: builder.mutation<string, string>({
      query: (chapterId) => ({
        url: `/export/chapter/${chapterId}`,
        method: "GET",
        responseHandler: "text",
      }),
    }),

    /**
     * Downloads a novel as a physical file (e.g., PDF, DOCX, or Markdown).
     * Parses the response as a Blob so the browser can trigger a native file download.
     */
    downloadNovelFile: builder.mutation<Blob, { novelId: string; format: "pdf" | "docx" | "md" }>({
      query: ({ novelId, format }) => ({
        url: `/export/novel/${novelId}/download`,
        method: "GET",
        params: { format }, // Automatically appends ?format=pdf
        responseHandler: (response) => response.blob(),
      }),
    }),
    
  }),
});

export const { 
  useExportNovelMutation, 
  useExportChapterMutation, 
  useDownloadNovelFileMutation 
} = exportApi;