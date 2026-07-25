/**
 * @file analyticsApi.ts
 * @desc RTK Query endpoints for user writing stats, streaks, and goals.
 * Injects into the master apiSlice to share authentication and caching logic.
 */

import { apiSlice } from "../../api/apiSlice";

// --- Strict Payload & Response Types ---

export interface DashboardSummary {
  wordsToday: number;
  currentStreak: number;
  longestStreak: number;
  totalWords: number;
}

export interface RecordSnapshotPayload {
  chapterId: string;
  novelId: string;
  wordCount: number;
}

export interface CreateGoalPayload {
  type: "daily" | "weekly" | "novel_total";
  targetWords: number;
  novelId?: string;
  deadline?: string;
}

export interface Goal {
  _id: string;
  type: "daily" | "weekly" | "novel_total";
  targetWords: number;
  currentWords: number;
  novelId?: string;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  title: string;
  type: string;
  status: string;
  chapters: number;
  wordCount: number;
  updatedAt: string;
}

export interface ProfileDashboardResponse {
  success: boolean;
  data: {
    stats: { totalWords: number; currentStreak: number; activeProjects: number };
    recentDocuments: Project[];
  };
}

// --- API Injection ---

export const analyticsApi = apiSlice.injectEndpoints({
  overrideExisting: true, // Prevents Next.js hot-reload crashes
  endpoints: (builder) => ({
    
    /** Fetches the global writing stats for the main dashboard */
    getDashboardAnalytics: builder.query<DashboardSummary, void>({
      query: () => "/analytics/dashboard",
      providesTags: ["Analytics"],
    }),

    /** Fetches aggregated stats and recent projects for the user profile */
    getProfileDashboard: builder.query<ProfileDashboardResponse, void>({
      query: () => "/profile/dashboard",
      providesTags: ["Analytics", "User"],
    }),

    /** Silently records a word count snapshot for heatmap/streak tracking */
    recordSnapshot: builder.mutation<{ recorded: boolean }, RecordSnapshotPayload>({
      query: (body) => ({ url: "/analytics/snapshot", method: "POST", body }),
      // Only invalidate Analytics if a new snapshot was actually recorded
      invalidatesTags: (result) => (result?.recorded ? ["Analytics"] : []),
    }),

    /** Fetches the user's active writing goals */
    getGoals: builder.query<Goal[], void>({
      query: () => "/analytics/goals",
      providesTags: ["Analytics"],
    }),

    /** Creates a new writing goal and triggers UI cache refresh */
    createGoal: builder.mutation<Goal, CreateGoalPayload>({
      query: (body) => ({ url: "/analytics/goals", method: "POST", body }),
      invalidatesTags: ["Analytics"],
    }),
    
  }),
});

export const {
  useGetDashboardAnalyticsQuery,
  useGetProfileDashboardQuery,
  useRecordSnapshotMutation,
  useGetGoalsQuery,
  useCreateGoalMutation,
} = analyticsApi;