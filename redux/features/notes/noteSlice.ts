/**
 * @file noteSlice.ts
 * @desc Manages the local UI state for the Notes/Inbox system.
 * Tracks search queries, active category filters, and which note is currently selected.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Note } from "./noteApi";

export interface NoteUIState {
  searchQuery: string;
  activeTypeFilter: Note["type"] | "all"; // e.g., 'lore', 'plot', or 'all'
  selectedNoteId: string | null;          // The note currently open in the editor panel
  isCreateModalOpen: boolean;
}

const initialState: NoteUIState = {
  searchQuery: "",
  activeTypeFilter: "all",
  selectedNoteId: null,
  isCreateModalOpen: false,
};

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    /** Updates the search bar text for filtering notes */
    setNoteSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    /** Filters the notes list by a specific tag (e.g., 'worldbuilding') */
    setNoteTypeFilter: (state, action: PayloadAction<NoteUIState["activeTypeFilter"]>) => {
      state.activeTypeFilter = action.payload;
    },
    
    /** Sets the currently viewed note to render in the reading/editing pane */
    setSelectedNoteId: (state, action: PayloadAction<string | null>) => {
      state.selectedNoteId = action.payload;
    },
    
    /** Toggles the visibility of the "New Note" modal */
    setNoteCreateModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateModalOpen = action.payload;
    },

    /** Resets the UI state when navigating away from the notes page */
    resetNoteUI: (state) => {
      state.searchQuery = "";
      state.activeTypeFilter = "all";
      state.selectedNoteId = null;
    }
  },
});

export const {
  setNoteSearchQuery,
  setNoteTypeFilter,
  setSelectedNoteId,
  setNoteCreateModalOpen,
  resetNoteUI,
} = noteSlice.actions;

export default noteSlice.reducer;