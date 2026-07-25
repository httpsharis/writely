/**
 * @file analyticsSlice.ts
 * @desc Manages the local UI state for the Analytics & Dashboard views.
 * Handles timeframe filters, modal visibility, and active goal selections.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AnalyticsUIState {
  timeRange: "7d" | "30d" | "all_time";
  isCreateGoalModalOpen: boolean;
  selectedGoalId: string | null; // Useful for opening an "Edit Goal" view
}

const initialState: AnalyticsUIState = {
  timeRange: "30d",
  isCreateGoalModalOpen: false,
  selectedGoalId: null,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    /** Changes the active timeframe filter for charts/graphs */
    setTimeRange: (state, action: PayloadAction<AnalyticsUIState["timeRange"]>) => {
      state.timeRange = action.payload;
    },
    
    /** Toggles the Create Goal popup modal */
    setCreateGoalModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateGoalModalOpen = action.payload;
      if (!action.payload) state.selectedGoalId = null; // Clear selection on close
    },
    
    /** Sets a specific goal for editing/viewing */
    setSelectedGoalId: (state, action: PayloadAction<string | null>) => {
      state.selectedGoalId = action.payload;
    },
  },
});

export const { setTimeRange, setCreateGoalModalOpen, setSelectedGoalId } = analyticsSlice.actions;

export default analyticsSlice.reducer;