/**
 * @file store.ts
 * @desc The master Redux store. Combines the unified apiSlice engine 
 * with all local domain-specific UI slices.
 */
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";

// Local UI Slices
import settingsReducer from "./features/settings/settingsSlice";
import documentReducer from "./features/documents/documentSlice";
import characterReducer from "./features/characters/characterSlice";
import analyticsReducer from "./features/analytics/analyticsSlice";
import userReducer from "./features/users/userSlice";
import profileReducer from "./features/profile/profileSlice";
import exportReducer from "./features/exports/exportSlice";
import noteReducer from "./features/notes/noteSlice";
import searchReducer from "./features/search/searchSlice";

export const store = configureStore({
  reducer: {
    // 1. The Single Source of Truth for Server Data
    [apiSlice.reducerPath]: apiSlice.reducer,

    // 2. Client-Side UI State Slices
    settings: settingsReducer,
    documents: documentReducer,
    characters: characterReducer,
    analytics: analyticsReducer,
    user: userReducer,
    profile: profileReducer,
    export: exportReducer,
    notes: noteReducer,
    search: searchReducer,
  },
  
  // 3. RTK Query middleware enables automatic caching, polling, and refetching
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
    
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;