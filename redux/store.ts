import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authReducer from './features/auth/authSlice';

import { documentApi } from './features/documents/documentApi';
import { characterApi } from './features/characters/characterApi';
import { noteApi } from './features/notes/noteApi';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        [documentApi.reducerPath]: documentApi.reducer,
        [characterApi.reducerPath]: characterApi.reducer,
        [noteApi.reducerPath]: noteApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            apiSlice.middleware,
            documentApi.middleware,
            characterApi.middleware,
            noteApi.middleware
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;