import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

declare global {
  interface Window {
    Clerk: any;
  }
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000/api",
  credentials: "include",
  prepareHeaders: async (headers) => {
    // 1. Check if we are in the browser
    if (typeof window !== "undefined" && window.Clerk && window.Clerk.session) {
      try {
        // 2. Fetch the active JWT from Clerk
        const token = await window.Clerk.session.getToken();
        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
      } catch (err) {
        console.error("Failed to get Clerk token", err);
      }
    }
    return headers;
  },
});

export const sharedBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Pass directly to baseQuery without custom refresh logic, because Clerk handles its own token refreshes automatically.
  return await baseQuery(args, api, extraOptions);
};
