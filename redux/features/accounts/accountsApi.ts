import { createApi } from '@reduxjs/toolkit/query/react';
import { sharedBaseQuery } from "../../api/baseQuery";
import { UserProfileResponse } from '../users/userApi'; // Import shared types

/**
 * API Slice for Account lifecycle and settings mutations.
 * This handles WRITE operations for the authenticated user.
 */
export const accountApi = createApi({
  reducerPath: 'accountApi',
  baseQuery: sharedBaseQuery,
  tagTypes: ['User'], // Invalidate User tags when profile/settings change
  endpoints: (builder) => ({
    
    /** Updates user profile (bio, avatar, links) */
    updateProfile: builder.mutation<UserProfileResponse, Partial<UserProfileResponse['profile']>>({
      query: (body) => ({
        url: '/users/profile',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    /** Updates user settings (theme, editor, notifications) */
    updateSettings: builder.mutation<UserProfileResponse, Partial<UserProfileResponse['settings']>>({
      query: (body) => ({
        url: '/users/settings',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    /** Triggers a backend job to zip and send user data */
    exportGlobalData: builder.mutation<{ downloadUrl: string }, void>({
      query: () => ({
        url: '/account/export',
        method: 'POST',
      }),
    }),

    /** Permanently deletes the user and all their documents */
    deleteAccount: builder.mutation<{ message: string }, { password: string }>({
      query: (body) => ({
        url: '/account/delete',
        method: 'DELETE',
        body,
      }),
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useUpdateSettingsMutation,
  useExportGlobalDataMutation,
  useDeleteAccountMutation,
} = accountApi;