import { baseApi } from './baseApi';
import type { IChapter, CreateChapterInput, UpdateChapterInput, AddCommentInput } from '@/types/chapter';

export const chaptersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChapters: builder.query<IChapter[], string>({
      query: (projectId) => `/chapters?projectId=${projectId}`,
      providesTags: (result, error, projectId) => [{ type: 'Chapter', id: projectId }],
    }),
    getChapterById: builder.query<IChapter, string>({
      query: (id) => `/chapters/${id}`,
      providesTags: (result, error, id) => [{ type: 'Chapter', id }],
    }),
    createChapter: builder.mutation<IChapter, CreateChapterInput>({
      query: (body) => ({
        url: '/chapters',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: 'Chapter', id: projectId }],
    }),
    updateChapter: builder.mutation<IChapter, { id: string; data: UpdateChapterInput }>({
      query: ({ id, data }) => ({
        url: `/chapters/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Chapter', id }],
    }),
    deleteChapter: builder.mutation<void, { id: string; projectId: string }>({
      query: ({ id }) => ({
        url: `/chapters/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: 'Chapter', id: projectId }],
    }),
    addComment: builder.mutation<IChapter, { id: string; data: AddCommentInput }>({
      query: ({ id, data }) => ({
        url: `/chapters/${id}/comments`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Chapter', id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetChaptersQuery,
  useGetChapterByIdQuery,
  useCreateChapterMutation,
  useUpdateChapterMutation,
  useDeleteChapterMutation,
  useAddCommentMutation,
} = chaptersApi;
