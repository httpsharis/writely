import { createApi } from '@reduxjs/toolkit/query/react';
import { sharedBaseQuery } from '@/redux/api/baseQuery';

// --- Types ---
export interface RecentDocument {
  _id: string;
  title: string;
  slug: string;
  type: 'novel' | 'chapter';
  parentId: string | null;
  updatedAt: string;
}

export interface MinimalDashboardResponse {
  wordsToday: number;
  recentDocuments: RecentDocument[];
}

export interface HeatmapData {
  _id: string; // 'YYYY-MM-DD'
  dailyMax: number;
}

// Replace 'any' with a proper interface or a safe unknown object
export interface WritingGoal {
  _id: string;
  target: number;
  type: 'daily' | 'total';
  // add other goal fields here
}

export interface UserProfileResponse {
  profile: {
    bio?: string;
    avatarUrl?: string;
    website?: string;
    socialLinks?: {
      twitter?: string;
      instagram?: string;
    };
  };
  settings: {
    theme: 'light' | 'dark' | 'system';
    notifications: {
      emailWeeklySummary: boolean;
      pushMilestones: boolean;
    };
    editor: {
      fontFamily: string;
      fontSize: number;
      focusMode: boolean;
    };
  };
  analytics: {
    currentStreak: number;
    longestStreak: number;
    heatmap: HeatmapData[];
  };
  goals: WritingGoal[]; // Fixed the 'any'!
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
    socialLinks?: {
      twitter?: string;
      instagram?: string;
    };
    joinedAt: string;
  };
  novels: PublicNovel[];
}

/**
 * API Slice for fetching User data (Dashboards, Profiles).
 * This is strictly for READ operations.
 */
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: sharedBaseQuery, // Use shared base query!
  tagTypes: ['User', 'Document', 'Analytics'],
  endpoints: (builder) => ({
    
    /** Lightweight fetch for the home screen */
    getMinimalDashboard: builder.query<MinimalDashboardResponse, void>({
      query: () => '/users/dashboard',
      providesTags: ['User', 'Document', 'Analytics'],
    }),

    /** Heavy fetch for the Trophy Room / Settings screen */
    getProfileDashboard: builder.query<UserProfileResponse, void>({
      query: () => '/users/profile',
      providesTags: ['User', 'Analytics'],
    }),

    /** For readers visiting an author's page */
    getPublicAuthorProfile: builder.query<PublicAuthorProfileResponse, string>({
      query: (userId) => `/users/public/${userId}`,
      // No tags needed for public routes
    }),
  }),
});

export const {
  useGetMinimalDashboardQuery,
  useGetProfileDashboardQuery,
  useGetPublicAuthorProfileQuery,
} = userApi;