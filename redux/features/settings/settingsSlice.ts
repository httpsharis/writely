import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SettingsState {
  isFocusMode: boolean;
  dailyGoal: number;
  editorFont: "sans" | "serif";
}

// Read from local storage ONCE during initialization
const initialState: SettingsState = {
  isFocusMode: JSON.parse(localStorage.getItem("isFocusMode") || "false"),
  dailyGoal: JSON.parse(localStorage.getItem("dailyGoal") || "2000"),
  editorFont: (localStorage.getItem("editorFont") as "sans" | "serif") || "serif",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleFocusMode: (state) => {
      state.isFocusMode = !state.isFocusMode;
    },
    setDailyGoal: (state, action: PayloadAction<number>) => {
      state.dailyGoal = action.payload;
    },
    setEditorFont: (state, action: PayloadAction<"sans" | "serif">) => {
      state.editorFont = action.payload;
    },
  },
});

export const { toggleFocusMode, setDailyGoal, setEditorFont } = settingsSlice.actions;
export default settingsSlice.reducer;