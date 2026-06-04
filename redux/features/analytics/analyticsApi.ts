import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface StateWithAuth {
    auth: {
        accessToken: string | null;
    };
}

// --- Types based on your backend response ---

export interface DashboardSummary {
    wordsToday: number;
    currentStreak: number;
    longestStreak: number;
}

export interface RecordSnapshotPayload {
    chapterId: string;
    novelId: string;
    wordCount: number;
}

export interface CreateGoalPayload {
    type: 'daily' | 'weekly' | 'novel_total';
    targetWords: number;
    novelId?: string;
    deadline?: string;
}

// NEW: Goal Interface to replace 'any'
export interface Goal {
    _id: string;
    type: 'daily' | 'weekly' | 'novel_total';
    targetWords: number;
    currentWords: number;
    novelId?: string;
    deadline?: string;
    createdAt: string;
    updatedAt: string;
}

// NEW: Types for the Profile Page
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
        stats: {
            totalWords: number;
            currentStreak: number;
            activeProjects: number;
        };
        recentDocuments: Project[];
    };
}

// --- API Definition ---

export const analyticsApi = createApi({
    reducerPath: 'analyticsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api',
        // Add this line so cookies are sent with every request!
        credentials: 'include', 
        prepareHeaders(headers, { getState }) {
            const state = getState() as StateWithAuth;
            const token = state.auth.accessToken;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Analytics', 'User'],

    endpoints: (builder) => ({

        // GET /api/analytics/dashboard
        getDashboardAnalytics: builder.query<DashboardSummary, void>({
            query: () => '/analytics/dashboard',
            providesTags: ['Analytics'],
        }),

        // GET /api/profile/dashboard
        getProfileDashboard: builder.query<ProfileDashboardResponse, void>({
            query: () => '/profile/dashboard',
            providesTags: ['Analytics', 'User'],
        }),

        // POST /api/analytics/snapshot
        recordSnapshot: builder.mutation<{ recorded: boolean }, RecordSnapshotPayload>({
            query: (body) => ({
                url: '/analytics/snapshot',
                method: 'POST',
                body,
            }),
            invalidatesTags: (result) => result?.recorded ? ['Analytics'] : [],
        }),

        // GET /api/analytics/goals
        getGoals: builder.query<Goal[], void>({
            query: () => '/analytics/goals',
            providesTags: ['Analytics'],
        }),

        // POST /api/analytics/goals
        createGoal: builder.mutation<Goal, CreateGoalPayload>({
            query: (body) => ({
                url: '/analytics/goals',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Analytics', 'User'],
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