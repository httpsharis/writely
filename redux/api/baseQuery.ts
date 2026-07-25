import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { setAccessToken, logOut } from "../features/auth/authSlice";
import { Mutex } from "async-mutex";

interface StateWithAuth {
  auth: { accessToken: string | null };
}

// Create a single lock instance for token refreshing
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as StateWithAuth).auth.accessToken;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

export const sharedBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // 1. Wait for the initial request to resolve
  let result = await baseQuery(args, api, extraOptions);

  // 2. Intercept 401 errors, but ignore if the failing request WAS the refresh endpoint itself
  const isRefreshRequest =
    typeof args === "object" && args.url === "/auth/refresh";

  if (result.error && result.error.status === 401 && !isRefreshRequest) {
    // Check if another request is already refreshing the token right now
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery(
          { url: "/auth/refresh", method: "POST" },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          const { accessToken } = refreshResult.data as { accessToken: string };
          api.dispatch(setAccessToken(accessToken));

          // Retry the original request immediately for the one that initiated the refresh
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logOut());
        }
      } finally {
        release(); // Unlock the door for pending requests
      }
    } else {
      // If locked, wait in line until the ongoing refresh finishes
      await mutex.waitForUnlock();
      // Retry the original request using the brand new token fetched by the other request
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
