/**
 * @file profileSlice.ts
 * @desc Manages local UI states for the user profile & portfolio pages.
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProfileUIState {
  isEditModalOpen: boolean;
  activeTab: "works" | "about";
}

const initialState: ProfileUIState = {
  isEditModalOpen: false,
  activeTab: "works",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setEditModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isEditModalOpen = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<ProfileUIState["activeTab"]>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setEditModalOpen, setActiveTab } = profileSlice.actions;
export default profileSlice.reducer;