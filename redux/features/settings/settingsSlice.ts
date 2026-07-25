/**
 * @file settingsSlice.ts
 * @desc Manages user preferences like focus mode and fonts.
 * Safely handles Next.js SSR by deferring localStorage reads to the client.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SettingsState {
  isFocusMode: boolean;
  dailyGoal: number;
  editorFont: "sans" | "serif";
  _hasHydrated: boolean; // 🟢 Tracks if localStorage has been loaded yet
}

// 1. SSR-Safe Initial State (NO localStorage here!)
const initialState: SettingsState = {
  isFocusMode: false,
  dailyGoal: 2000,
  editorFont: "serif",
  _hasHydrated: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    
    /** 🟢 Safely loads user preferences from the browser's localStorage */
    hydrateSettings: (state) => {
      if (typeof window !== "undefined") {
        state.isFocusMode = JSON.parse(localStorage.getItem("isFocusMode") || "false");
        state.dailyGoal = JSON.parse(localStorage.getItem("dailyGoal") || "2000");
        state.editorFont = (localStorage.getItem("editorFont") as "sans" | "serif") || "serif";
      }
      state._hasHydrated = true;
    },

    /** Toggles focus mode and saves to localStorage */
    toggleFocusMode: (state) => {
      state.isFocusMode = !state.isFocusMode;
      if (typeof window !== "undefined") {
        localStorage.setItem("isFocusMode", JSON.stringify(state.isFocusMode));
      }
    },

    /** Updates the daily word goal and saves to localStorage */
    setDailyGoal: (state, action: PayloadAction<number>) => {
      state.dailyGoal = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("dailyGoal", JSON.stringify(state.dailyGoal));
      }
    },

    /** Updates the editor font and saves to localStorage */
    setEditorFont: (state, action: PayloadAction<"sans" | "serif">) => {
      state.editorFont = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("editorFont", action.payload);
      }
    },
  },
});

export const { hydrateSettings, toggleFocusMode, setDailyGoal, setEditorFont } = settingsSlice.actions;
export default settingsSlice.reducer;