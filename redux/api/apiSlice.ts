import { createApi } from "@reduxjs/toolkit/query/react";
import { sharedBaseQuery } from "./baseQuery";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: sharedBaseQuery, 
  tagTypes: [
    "User",
    "Chapter",
    "Project",
    "Note",
    "Document",
    "Trash",
    "Character",
    "Analytics",
    "Profile",
    "Likes"
  ],
  endpoints: () => ({}),
});
