import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../types";

// Safely pull data from the hard drive if it exists
const getLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(key);
    if (stored) {
      // Only parse the 'user' object. The tokens are raw strings.
      if (key === "user") return JSON.parse(stored);
      return stored; 
    }
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
      }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      
      // Stringify the object
      window.localStorage.setItem("user", JSON.stringify(action.payload.user));
      
      // Save the tokens as raw strings! Do not stringify them.
      window.localStorage.setItem("accessToken", action.payload.accessToken);

      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
        window.localStorage.setItem("refreshToken", action.payload.refreshToken);
      }
    },
    logOut: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      
      window.localStorage.removeItem("user");
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("refreshToken");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;