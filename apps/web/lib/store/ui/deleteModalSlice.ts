import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface DeleteModalState {
  isOpen: boolean;
  questionId: string | null;
  isDeleting: boolean;
  error: string;
}

const initialState: DeleteModalState = {
  isOpen: false,
  questionId: null,
  isDeleting: false,
  error: "",
};

const deleteModalSlice = createSlice({
  name: "deleteModal",
  initialState,
  reducers: {
    openDeleteModal: (state, action: PayloadAction<string>) => {
      state.isOpen = true;
      state.questionId = action.payload;
      state.error = "";
    },
    closeDeleteModal: (state) => {
      state.isOpen = false;
      state.questionId = null;
      state.error = "";
      state.isDeleting = false;
    },
    setDeleteLoading: (state, action: PayloadAction<boolean>) => {
      state.isDeleting = action.payload;
    },
    setDeleteError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  openDeleteModal,
  closeDeleteModal,
  setDeleteLoading,
  setDeleteError,
} = deleteModalSlice.actions;

// Memoized selector for delete modal state
const selectDeleteModalState = (state: RootState) => state.deleteModal;

export const selectDeleteModal = createSelector(
  [selectDeleteModalState],
  (deleteModal) => deleteModal,
);

export default deleteModalSlice.reducer;
