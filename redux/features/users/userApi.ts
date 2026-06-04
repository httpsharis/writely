import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface StateWithAuth {
    auth: {
        accessToken: string | null;
    };
}

// --- Types based on your backend ---
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
    _id: string; // The date string: 'YYYY-MM-DD'
    dailyMax: number;
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
    goals: any[]; // Assuming an array of writing goals
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

// --- API Slice ---
export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api',
        prepareHeaders(headers, { getState }) {
            const state = getState() as StateWithAuth;
            const token = state.auth.accessToken;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['User', 'Document', 'Analytics'],

    endpoints: (builder) => ({

        // GET /api/users/dashboard -> Lightweight fetch for the home screen
        getMinimalDashboard: builder.query<MinimalDashboardResponse, void>({
            query: () => '/users/dashboard',
            // Refetches if a document is updated or analytics change
            providesTags: ['User', 'Document', 'Analytics'],
        }),

        // GET /api/users/profile -> Heavy fetch for the Trophy Room / Settings screen
        getProfileDashboard: builder.query<UserProfileResponse, void>({
            query: () => '/users/profile',
            providesTags: ['User', 'Analytics'],
        }),

        // GET /api/users/public/:userId -> For readers visiting an author's page
        getPublicAuthorProfile: builder.query<PublicAuthorProfileResponse, string>({
            query: (userId) => `/users/public/${userId}`,
            // We don't add heavy tags here because public readers don't edit things.
        }),
    }),
});

export const {
    useGetMinimalDashboardQuery,
    useGetProfileDashboardQuery,
    useGetPublicAuthorProfileQuery, // <-- Successfully exported!
} = userApi;