import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
}

// ✅ STRICT NULLS - No localStorage reading!
const initialState: AuthState = {
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    logOut: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setCredentials, setAccessToken, setUser, logOut } = authSlice.actions;
export default authSlice.reducer;
