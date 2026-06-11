import { apiSlice } from "../../api/apiSlice";

export interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

interface GoogleLoginRequest {
  idToken: string;
}

interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // POST: /api/auth/google-login
    // 🟢 UPDATE 1: Add invalidatesTags
    googleLogin: builder.mutation<LoginResponse, GoogleLoginRequest>({
      query: (credentials) => ({
        url: "/auth/google-login",
        method: "POST",
        body: credentials,
      }),
      // THIS IS THE MAGIC LINE. It forces useGetCurrentUserQuery to re-run after login.
      invalidatesTags: ["User"],
    }),

    // 🟢 UPDATE 2: Do it for testLogin as well
    testLogin: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: "/auth/test-login",
        method: "POST",
      }),
      invalidatesTags: ["User"], // Add it here too!
    }),

    // GET: /api/auth/me (Matches your getCurrentUser)
    getCurrentUser: builder.query<{ user: User }, void>({
      query: () => "/auth/me",
      providesTags: ["User"], // This tag gets cleared by the mutations above
    }),
  }),
});

export const {
  useGoogleLoginMutation,
  useTestLoginMutation,
  useGetCurrentUserQuery,
} = authApi;
