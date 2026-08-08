/**
 * @file profileApi.ts
 * @desc RTK Query endpoints for fetching and updating Author Profiles.
 * Injects into the master apiSlice to share auth middleware.
 */
import { apiSlice } from "../../api/apiSlice";
import { Document } from "../documents/documentApi"; // Need this to type the published works!

// --- Strict Type Definitions ---
export interface SocialLinks {
  twitter?: string;
  instagram?: string;
  website?: string;
}

export interface UserProfile {
  _id: string;
  username: string;
  name: string; 
  bio?: string;
  avatarUrl?: string;
  coverImageUrl?: string; 
  socialLinks?: SocialLinks;
  createdAt: string; 
}

// Partial allows us to update only the fields the user actually changed
export type UpdateProfilePayload = Partial<Omit<UserProfile, "_id" | "createdAt">>;

export interface PublicProfileResponse {
  _id: string;
  name: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  socialLinks?: SocialLinks;
  createdAt: string;
  publishedWorks: Document[]; // 🟢 Essential for rendering the author's portfolio!
}

// --- API Injection ---

export const profileApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    
    /** Fetches the authenticated user's private profile for the Settings page. */
    getMyProfile: builder.query<UserProfile, void>({
      query: () => "/auth/me",
      providesTags: ["Profile"],
      transformResponse: (res: any) => res.user,
    }),

    /**
     * Updates the authenticated user's profile.
     * Uses an Optimistic Update to instantly reflect changes in the UI.
     */
    updateMyProfile: builder.mutation<UserProfile, UpdateProfilePayload>({
      query: (body) => ({
        url: "/users/profile",
        method: "PUT",
        body,
      }),
      transformResponse: (response: { user: UserProfile }) => response.user,
      async onQueryStarted(patch, { dispatch, queryFulfilled }) {
        // 🟢 Optimistically update the cached profile instantly
        const patchResult = dispatch(
          profileApi.util.updateQueryData("getMyProfile", undefined, (draft) => {
            Object.assign(draft, patch);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          // 🔴 If the server rejects it (e.g., username taken), roll back the UI instantly
          patchResult.undo();
        }
      },
      // Invalidate 'User' tag as well just in case the top-nav avatar needs to refresh
      invalidatesTags: ["Profile", "User"], 
    }),

    /** Fetches a public profile and their published novels by username. */
    getPublicProfile: builder.query<PublicProfileResponse, string>({
      query: (username) => `/profile/${username}`,
      transformResponse: (response: any) => {
        // Handle Bento Box format from profileService
        if (response.author && response.works) {
          return {
            _id: response.author.id,
            name: response.author.name,
            username: response.author.username,
            bio: response.author.bio,
            avatarUrl: response.author.avatarUrl,
            coverImageUrl: response.author.coverImageUrl,
            socialLinks: response.author.socialLinks,
            createdAt: response.author.joinedAt,
            publishedWorks: response.works,
          };
        }
        // Fallback for flat response
        return response;
      },
      providesTags: (result, error, username) => [{ type: "Profile", id: username }],
    }),
    
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useGetPublicProfileQuery,
} = profileApi;