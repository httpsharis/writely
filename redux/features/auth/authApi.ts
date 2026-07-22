// api/authApi.ts
import { apiSlice } from "../../api/apiSlice";
import { User } from "../../../types";
import { setCredentials, setAccessToken, setUser, logOut } from "../auth/authSlice";

// --- Strict Payload Types (No more 'any') ---
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  accessToken: string;
  user: User;
}

interface UpdateProfilePayload {
  name?: string;
  username?: string;
  bio?: string;
}

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true, // Prevents hot-reload crashes in Next.js
  endpoints: (builder) => ({
    
    /** Authenticates a user with email/password */
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
      invalidatesTags: ["User"],
    }),

    /** Registers a new user */
    register: builder.mutation<LoginResponse, RegisterPayload>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error) {
          console.error("Registration failed:", error);
        }
      },
      invalidatesTags: ["User"],
    }),

    /** Authenticates a user via Google OAuth ID token */
    googleLogin: builder.mutation<LoginResponse, { idToken: string }>({
      query: (credentials) => ({
        url: "/auth/google-login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error) {
          console.error("Google login failed:", error);
        }
      },
      invalidatesTags: ["User"],
    }),

    /** Refreshes the expired access token using the httpOnly refresh cookie */
    refreshAccessToken: builder.mutation<{ accessToken: string }, void>({
      query: () => ({ url: "/auth/refresh", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAccessToken(data.accessToken));
        } catch (error) {
          console.error("Token refresh failed:", error);
        }
      },
    }),

    /** Fetches the currently authenticated user */
    getCurrentUser: builder.query<{ user: User }, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    /** Logs the user out and clears all RTK Query cache */
    logout: builder.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut()); // Clear Redux state
          dispatch(apiSlice.util.resetApiState()); // CRITICAL: Wipes all cached API data
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),

    /** Updates the authenticated user's profile */
    updateProfile: builder.mutation<{ user: User }, UpdateProfilePayload>({
      query: (data) => ({
        url: "/auth/profile",
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user)); 
        } catch (error) {
          console.error("Profile update failed:", error);
        }
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleLoginMutation,
  useRefreshAccessTokenMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useUpdateProfileMutation,
} = authApi;