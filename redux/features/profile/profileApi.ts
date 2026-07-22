import { createApi } from '@reduxjs/toolkit/query/react';
import { sharedBaseQuery } from "../../api/baseQuery";

// --- 1. Strict Type Definitions ---
export interface SocialLinks {
  twitter?: string;
  instagram?: string;
  website?: string;
}

export interface UserProfile {
  _id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks: SocialLinks;
  joinedAt: string;
}

// Partial allows us to update only the fields the user actually changed
export type UpdateProfilePayload = Partial<Omit<UserProfile, '_id' | 'joinedAt'>>;

export interface PublicProfileResponse {
  author: Pick<UserProfile, 'displayName' | 'bio' | 'avatarUrl' | 'socialLinks' | 'joinedAt'>;
  stats: {
    totalNovels: number;
    totalWords: number;
  };
}


// --- 2. API Slice ---

/**
 * API Slice for managing User Profiles.
 * Handles both private (auth-required) and public profile operations.
 */
export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: sharedBaseQuery, // Always use the shared base query!
  tagTypes: ['Profile'],
  endpoints: (builder) => ({

    /**
     * Fetches the authenticated user's private profile.
     * Used in Settings and Dashboard screens.
     */
    getMyProfile: builder.query<UserProfile, void>({
      query: () => '/profile/me',
      providesTags: (result, error) => [{ type: 'Profile', id: 'ME' }],
    }),

    /**
     * Updates the authenticated user's profile.
     * Uses an Optimistic Update to instantly reflect changes in the UI 
     * without waiting for the server response.
     */
    updateMyProfile: builder.mutation<UserProfile, UpdateProfilePayload>({
      query: (body) => ({
        url: '/profile/me',
        method: 'PUT',
        body,
      }),
      async onQueryStarted(patch, { dispatch, queryFulfilled }) {
        // Optimistically update the cached profile instantly
        const patchResult = dispatch(
          profileApi.util.updateQueryData('getMyProfile', undefined, (draft) => {
            // Merge the patched fields into the draft
            Object.assign(draft, patch);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          // If the server rejects it, roll back the UI instantly
          patchResult.undo();
        }
      },
    }),

    /**
     * Fetches a public profile by username.
     * Used when readers visit an author's public page.
     * We use `username` instead of `_id` for SEO-friendly URLs.
     */
    getPublicProfile: builder.query<PublicProfileResponse, string>({
      query: (username) => `/profile/public/${username}`,
      // No tags provided here because public viewers don't trigger updates.
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useGetPublicProfileQuery,
} = profileApi;