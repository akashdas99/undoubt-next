import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface DeleteModalState {
  isOpen: boolean;
  questionId: string | null;
  isDeleting: boolean;
  error: string;
}

interface UIState {
  deleteModal: DeleteModalState;
}

const initialState: UIState = {
  deleteModal: {
    isOpen: false,
    questionId: null,
    isDeleting: false,
    error: "",
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openDeleteModal: (state, action: PayloadAction<string>) => {
      state.deleteModal.isOpen = true;
      state.deleteModal.questionId = action.payload;
      state.deleteModal.error = "";
    },
    closeDeleteModal: (state) => {
      state.deleteModal.isOpen = false;
      state.deleteModal.questionId = null;
      state.deleteModal.error = "";
      state.deleteModal.isDeleting = false;
    },
    setDeleteLoading: (state, action: PayloadAction<boolean>) => {
      state.deleteModal.isDeleting = action.payload;
    },
    setDeleteError: (state, action: PayloadAction<string>) => {
      state.deleteModal.error = action.payload;
    },
  },
});

export const {
  openDeleteModal,
  closeDeleteModal,
  setDeleteLoading,
  setDeleteError,
} = uiSlice.actions;

// Memoized selector for delete modal state
const selectUI = (state: RootState) => state.ui;

export const selectDeleteModal = createSelector(
  [selectUI],
  (ui) => ui.deleteModal
);

export default uiSlice.reducer;
