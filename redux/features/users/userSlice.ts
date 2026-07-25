/**
 * @file userSlice.ts
 * @desc Manages the local UI state for the User Profile and Settings views.
 * Tracks active tabs and modal visibility to keep React components pure.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserUIState {
  activeProfileTab: "overview" | "settings" | "billing";
  isSettingsModalOpen: boolean;
}

const initialState: UserUIState = {
  activeProfileTab: "overview",
  isSettingsModalOpen: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /** Switches between Overview, Settings, and Billing tabs on the Profile page */
    setActiveProfileTab: (state, action: PayloadAction<UserUIState["activeProfileTab"]>) => {
      state.activeProfileTab = action.payload;
    },
    
    /** Toggles the global Settings/Preferences modal */
    setSettingsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isSettingsModalOpen = action.payload;
    },
    
    /** Resets the user UI state (useful on logout) */
    resetUserUI: (state) => {
      state.activeProfileTab = "overview";
      state.isSettingsModalOpen = false;
    }
  },
});

export const { setActiveProfileTab, setSettingsModalOpen, resetUserUI } = userSlice.actions;

export default userSlice.reducer;