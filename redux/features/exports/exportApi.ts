import { createApi } from '@reduxjs/toolkit/query/react';
import { sharedBaseQuery } from '@/redux/api/baseQuery';

/**
 * API Slice for handling data exports.
 * Uses mutations for GET requests because exports should only trigger 
 * on explicit user action (e.g., clicking a "Download" button), not on component mount.
 */
export const exportApi = createApi({
  reducerPath: 'exportApi',
  baseQuery: sharedBaseQuery,
  endpoints: (builder) => ({
    /**
     * Exports a specific novel as raw text/Markdown.
     * Use this when you need to display the markdown in the UI or editor.
     */
    exportNovel: builder.mutation<string, string>({
      query: (novelId) => ({
        url: `/export/novel/${novelId}`,
        method: 'GET',
        responseHandler: 'text', 
      }),
    }),

    /**
     * Exports a specific chapter as raw text/Markdown.
     */
    exportChapter: builder.mutation<string, string>({
      query: (chapterId) => ({
        url: `/export/chapter/${chapterId}`,
        method: 'GET',
        responseHandler: 'text',
      }),
    }),

    /**
     * Downloads a novel as a physical file (e.g., PDF, DOCX, or Markdown).
     * Returns a Blob so the browser can trigger a native file download.
     */
    downloadNovelFile: builder.mutation<Blob, { novelId: string; format: 'pdf' | 'docx' | 'md' }>({
      query: ({ novelId, format }) => ({
        url: `/export/novel/${novelId}/download`,
        method: 'GET',
        params: { format }, // Appends ?format=pdf to the URL
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