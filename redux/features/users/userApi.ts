/**
 * @file userApi.ts
 * @desc RTK Query endpoints for fetching User Dashboards, Profiles, and Settings.
 * Injects into the master apiSlice to share auth middleware and global caching.
 */

import { apiSlice } from "../../api/apiSlice";

// --- Strict Interfaces ---

export interface RecentDocument {
  _id: string;
  title: string;
  slug: string;
  type: "novel" | "chapter";
  parentId: string | null;
  updatedAt: string;
}

export interface MinimalDashboardResponse {
  wordsToday: number;
  recentDocuments: RecentDocument[];
}

export interface HeatmapData {
  _id: string; // Format: 'YYYY-MM-DD'
  dailyMax: number;
}

export interface WritingGoal {
  _id: string;
  targetWords: number;
  currentWords?: number; // Added by frontend or aggregation occasionally
  type: "daily" | "weekly" | "novel_total";
}

export interface UserProfileResponse {
  profile: {
    bio?: string;
    avatarUrl?: string;
    website?: string;
    socialLinks?: { twitter?: string; instagram?: string };
  };
  settings: {
    theme: "light" | "dark" | "system";
    notifications: { emailWeeklySummary: boolean; pushMilestones: boolean };
    editor: { fontFamily: string; fontSize: number; focusMode: boolean };
  };
  analytics: {
    currentStreak: number;
    longestStreak: number;
    heatmap: HeatmapData[];
  };
  goals: WritingGoal[]; 
}

export interface PublicNovel {
  _id: string;
  title: string;
  slug: string;
  coverImage?: string;
  synopsis?: string;
  genre?: string[];
  likesCount?: number;
  createdAt: string;
}

export interface PublicAuthorProfileResponse {
  author: {
    name: string;
    bio?: string;
    avatarUrl?: string;
    website?: string;
    socialLinks?: { twitter?: string; instagram?: string };
    joinedAt: string;
  };
  novels: PublicNovel[];
}

// --- API Injection ---

export const userApi = apiSlice.injectEndpoints({
  overrideExisting: true, // Prevents Next.js hot-reload crashes
  endpoints: (builder) => ({
    
    /** Fetches lightweight data required for the main home dashboard screen */
    getMinimalDashboard: builder.query<MinimalDashboardResponse, void>({
      query: () => "/users/dashboard",
      providesTags: ["User", "Document", "Analytics"],
    }),

    /** Fetches heavy, detailed data for the private Trophy Room / Settings screen */
    getUserDashboard: builder.query<UserProfileResponse, void>({
      query: () => "/users/analytics",
      providesTags: ["User", "Analytics"],
    }),

    /** Public route: Fetches an author's public portfolio for readers to view */
    getPublicAuthorProfile: builder.query<PublicAuthorProfileResponse, string>({
      query: (username) => `/users/${username}`,
      // No providesTags needed: Public viewers don't trigger or receive live cache invalidations
    }),
    
  }),
});

export const {
  useGetMinimalDashboardQuery,
  useGetUserDashboardQuery,
  useGetPublicAuthorProfileQuery,
} = userApi;