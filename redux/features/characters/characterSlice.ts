/**
 * @file characterSlice.ts
 * @description Manages the local UI state for the Character Roster.
 * (Search filters, active selections, and modal visibility).
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CharacterUIState {
  searchQuery: string;
  roleFilter: string | "all"; // e.g., 'Protagonist', 'Antagonist', 'Supporting', or 'all'
  activeCharacterId: string | null; // Used if you have a split-pane or detail modal
  isCreateModalOpen: boolean;
}

const initialState: CharacterUIState = {
  searchQuery: "",
  roleFilter: "all",
  activeCharacterId: null,
  isCreateModalOpen: false,
};

const characterSlice = createSlice({
  name: "characters",
  initialState,
  reducers: {
    /** Updates the search bar text for filtering characters */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    /** Filters the roster by a specific role (e.g., 'Protagonist') */
    setRoleFilter: (state, action: PayloadAction<string>) => {
      state.roleFilter = action.payload;
    },
    
    /** Sets the currently viewed character for a details panel */
    setActiveCharacterId: (state, action: PayloadAction<string | null>) => {
      state.activeCharacterId = action.payload;
    },
    
    /** Toggles the visibility of the Create/Edit Character Modal */
    setCreateModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateModalOpen = action.payload;
    },

    /** Resets all character UI filters back to default (useful when switching novels) */
    resetCharacterFilters: (state) => {
      state.searchQuery = "";
      state.roleFilter = "all";
      state.activeCharacterId = null;
    }
  },
});

export const {
  setSearchQuery,
  setRoleFilter,
  setActiveCharacterId,
  setCreateModalOpen,
  resetCharacterFilters,
} = characterSlice.actions;

export default characterSlice.reducer;