import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice";

import settingsReducer from "./features/settings/settingsSlice";

import { documentApi } from "./features/documents/documentApi";
import { characterApi } from "./features/characters/characterApi";
import { noteApi } from "./features/notes/noteApi";
import { analyticsApi } from "./features/analytics/analyticsApi";
import { likeApi } from "./features/likes/likeApi";
import { userApi } from "./features/users/userApi";
import { uploadApi } from "./features/uploads/uploadApi";
import { exportApi } from "./features/exports/exportApi";
import { searchApi } from "./features/search/searchApi";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,

    auth: authReducer,
    settings: settingsReducer,

    [documentApi.reducerPath]: documentApi.reducer,
    [characterApi.reducerPath]: characterApi.reducer,
    [noteApi.reducerPath]: noteApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [likeApi.reducerPath]: likeApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [exportApi.reducerPath]: exportApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      documentApi.middleware,
      characterApi.middleware,
      noteApi.middleware,
      analyticsApi.middleware,
      likeApi.middleware,
      userApi.middleware,
      uploadApi.middleware,
      exportApi.middleware,
      searchApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
