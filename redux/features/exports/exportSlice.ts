/**
 * @file exportSlice.ts
 * @desc Manages the local UI state for the Export/Download Modal.
 * Tracks modal visibility, the selected file format, and the target novel ID.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ExportUIState {
  isExportModalOpen: boolean;
  selectedFormat: "pdf" | "docx" | "md";
  targetNovelId: string | null;
}

const initialState: ExportUIState = {
  isExportModalOpen: false,
  selectedFormat: "pdf",
  targetNovelId: null,
};

const exportSlice = createSlice({
  name: "export",
  initialState,
  reducers: {
    /** Opens or closes the Export options modal */
    setExportModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isExportModalOpen = action.payload;
      // Auto-clear the target ID when the modal closes so it doesn't leak into the next export
      if (!action.payload) state.targetNovelId = null; 
    },
    
    /** Sets the user's preferred download format */
    setSelectedFormat: (state, action: PayloadAction<ExportUIState["selectedFormat"]>) => {
      state.selectedFormat = action.payload;
    },

    /** Stores the ID of the novel currently being targeted for export */
    setTargetNovelId: (state, action: PayloadAction<string | null>) => {
      state.targetNovelId = action.payload;
    },
  },
});

export const { setExportModalOpen, setSelectedFormat, setTargetNovelId } = exportSlice.actions;

export default exportSlice.reducer;