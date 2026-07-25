/**
 * @file documentSlice.ts
 * @desc Manages the local UI state for the Library and Novel Editor.
 * Tracks active chapters, sidebar toggles, and auto-save indicators.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DocumentUIState {
  searchQuery: string;
  activeNovelId: string | null;
  activeChapterId: string | null;
  isSidebarOpen: boolean;
  saveStatus: "saved" | "saving" | "error" | "off";
}

const initialState: DocumentUIState = {
  searchQuery: "",
  activeNovelId: null,
  activeChapterId: null,
  isSidebarOpen: true, // Default open on desktop
  saveStatus: "saved",
};

const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    /** Updates the library search bar filter */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    /** Sets the currently active Novel Context */
    setActiveNovelId: (state, action: PayloadAction<string | null>) => {
      state.activeNovelId = action.payload;
    },

    /** Sets the currently active Chapter in the Editor */
    setActiveChapterId: (state, action: PayloadAction<string | null>) => {
      state.activeChapterId = action.payload;
    },

    /** Toggles the left-hand editor sidebar (chapters/lore list) */
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },

    /** Controls the UI indicator for background auto-saving */
    setSaveStatus: (state, action: PayloadAction<DocumentUIState["saveStatus"]>) => {
      state.saveStatus = action.payload;
    },

    /** Purges editor state when navigating back to the main lobby */
    resetEditorState: (state) => {
      state.activeChapterId = null;
      state.saveStatus = "saved";
    },
  },
});

export const {
  setSearchQuery,
  setActiveNovelId,
  setActiveChapterId,
  setSidebarOpen,
  setSaveStatus,
  resetEditorState,
} = documentSlice.actions;

export default documentSlice.reducer;