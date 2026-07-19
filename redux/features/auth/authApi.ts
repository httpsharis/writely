// api/authApi.ts
import { apiSlice } from "../../api/apiSlice";
import { User } from "../../../types";
import { setCredentials, setAccessToken, setUser, logOut } from "../auth/authSlice";

interface LoginResponse {
  message: string;
  accessToken: string;
  user: User;
}

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true, // ✅ Prevents hot-reload crashes in Next.js
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, any>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {}
      },
      invalidatesTags: ["User"],
    }),

    register: builder.mutation<LoginResponse, any>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {}
      },
      invalidatesTags: ["User"],
    }),

    googleLogin: builder.mutation<LoginResponse, { idToken: string }>({
      query: (credentials) => ({
        url: "/auth/google-login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data)); // ✅ Just dispatch, no localStorage
        } catch {}
      },
      invalidatesTags: ["User"], // ✅ CRITICAL: Update cache
    }),

    devLogin: builder.mutation<LoginResponse, void>({
      query: () => ({ url: "/auth/dev-login", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {}
      },
      invalidatesTags: ["User"], // ✅ CRITICAL: Update cache
    }),

    refreshAccessToken: builder.mutation<{ accessToken: string }, void>({
      query: () => ({ url: "/auth/refresh", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAccessToken(data.accessToken)); // ✅ Just dispatch
        } catch {}
      },
    }),

    getCurrentUser: builder.query<{ user: User }, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut()); // ✅ Clear Redux state
          // ✅ No need to manually clear localStorage anymore!
        } catch {}
      },
      invalidatesTags: ["User"], // ✅ CRITICAL: Clear cache
    }),

    updateProfile: builder.mutation<{ user: User }, { name?: string; username?: string; bio?: string }>({
      query: (data) => ({
        url: "/auth/profile",
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user)); 
        } catch {}
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleLoginMutation,
  useDevLoginMutation,
  useRefreshAccessTokenMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useUpdateProfileMutation,
} = authApi;