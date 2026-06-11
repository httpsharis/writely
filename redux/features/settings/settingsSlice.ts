import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Helper to pull from local storage
const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(key);
    if (stored !== null) {
      return JSON.parse(stored) as T;
    }
  }
  return defaultValue;
};

interface SettingsState {
  isFocusMode: boolean;
  dailyGoal: number;
  editorFont: "sans" | "serif";
}

const initialState: SettingsState = {
  isFocusMode: getLocalStorage("isFocusMode", false),
  dailyGoal: getLocalStorage("dailyGoal", 2000),
  editorFont: getLocalStorage("editorFont", "serif"),
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleFocusMode: (state) => {
      state.isFocusMode = !state.isFocusMode;
      if (typeof window !== "undefined")
        window.localStorage.setItem(
          "isFocusMode",
          JSON.stringify(state.isFocusMode),
        );
    },
    setDailyGoal: (state, action: PayloadAction<number>) => {
      state.dailyGoal = action.payload;
      if (typeof window !== "undefined")
        window.localStorage.setItem(
          "dailyGoal",
          JSON.stringify(state.dailyGoal),
        );
    },
    setEditorFont: (state, action: PayloadAction<"sans" | "serif">) => {
      state.editorFont = action.payload;
      if (typeof window !== "undefined")
        window.localStorage.setItem(
          "editorFont",
          JSON.stringify(state.editorFont),
        );
    },
  },
});

export const { toggleFocusMode, setDailyGoal, setEditorFont } =
  settingsSlice.actions;
export default settingsSlice.reducer;
