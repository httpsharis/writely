import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../types";

// Safely pull data from the hard drive if it exists
const getLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  }
  return null;
};

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

// Start the app by checking the hard drive first
const initialState: AuthState = {
  user: getLocalStorage("user"),
  accessToken: getLocalStorage("accessToken"),
  refreshToken: getLocalStorage("refreshToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken?: string;
      }>,
    ) => {
      // 1. Save to short-term memory
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      
      // 2. Save backup to the hard drive
      window.localStorage.setItem("user", JSON.stringify(action.payload.user));
      window.localStorage.setItem("accessToken", JSON.stringify(action.payload.accessToken));

      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
        window.localStorage.setItem("refreshToken", JSON.stringify(action.payload.refreshToken));
      }
    },
    logOut: (state) => {
      // 1. Clear short-term memory
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      
      // 2. Erase the hard drive backup
      window.localStorage.removeItem("user");
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("refreshToken");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;