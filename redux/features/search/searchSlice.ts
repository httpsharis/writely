/**
 * @file searchSlice.ts
 * @desc Manages the local UI state for the Global Command Palette / Search Modal.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchableEntityType } from "./searchApi";

export interface SearchUIState {
  isSearchModalOpen: boolean;
  searchQuery: string;
  activeFilters: SearchableEntityType[]; // Empty array means "search everything"
}

const initialState: SearchUIState = {
  isSearchModalOpen: false,
  searchQuery: "",
  activeFilters: [], 
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    /** Toggles the Global Command Palette (Cmd + K) */
    setSearchModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchModalOpen = action.payload;
      // Clear the query when they close the modal so it's fresh next time
      if (!action.payload) state.searchQuery = ""; 
    },
    
    /** Updates the search text in the input bar */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    /** Updates the types of content the user is looking for (e.g., just 'novels') */
    setActiveFilters: (state, action: PayloadAction<SearchableEntityType[]>) => {
      state.activeFilters = action.payload;
    },
    
    /** Completely resets the search UI */
    resetSearchUI: (state) => {
      state.searchQuery = "";
      state.activeFilters = [];
      state.isSearchModalOpen = false;
    }
  },
});

export const { 
  setSearchModalOpen, 
  setSearchQuery, 
  setActiveFilters, 
  resetSearchUI 
} = searchSlice.actions;

export default searchSlice.reducer;