import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../types";

/**
 * Represents the authentication state of the application.
 * Note: We do not persist this to localStorage directly. 
 * Access tokens are kept in memory, and refresh tokens are handled 
 * via httpOnly cookies by the backend.
 */
interface AuthState {
  user: User | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** Sets both the user and access token (used on login/register) */
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    /** Updates just the user object (used on profile update) */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    /** Updates just the access token (used on token refresh) */
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    /** Clears all auth state (used on logout) */
    logOut: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setCredentials, setAccessToken, setUser, logOut } = authSlice.actions;
export default authSlice.reducer;