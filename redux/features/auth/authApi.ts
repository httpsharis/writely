// api/authApi.ts
import { apiSlice } from "../../api/apiSlice";
import { User } from "../../../types";

export interface UpdateProfilePayload {
  name?: string;
  username?: string;
  bio?: string;
}

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true, 
  endpoints: (builder) => ({
    /** * Fetches the currently authenticated user based on the active session token. */
    getCurrentUser: builder.query<{ user: User }, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    /** * Updates the authenticated user's profile information. */
    updateProfile: builder.mutation<{ user: User }, UpdateProfilePayload>({
      query: (data) => ({
        url: "/users/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
} = authApi;
