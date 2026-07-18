import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { logOut } from "../features/auth/authSlice";

// 1. Create a local interface for the exact piece of state we need.
// This completely breaks the circular dependency with store.ts!
interface StateWithAuth {
  auth: {
    accessToken: string | null;
  };
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    // 2. Cast the state using our local interface instead of RootState
    const state = getState() as StateWithAuth;
    const token = state.auth.accessToken;

    console.log(
      "Attaching Token:",
      token ? "Token Found" : "No Token Found!",
    );

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // 🧠 Automatically log out the user if the token is expired/invalid!
    api.dispatch(logOut());
  }
  
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  // Added 'Trash' so our documentApi invalidations work perfectly
  tagTypes: ["User", "Chapter", "Project", "Note", "Document", "Trash"],
  endpoints: (builder) => ({}),
});
