import { create } from "zustand";
import { useMulti } from "./useMulti";

interface DeleteModalState {
  isOpen: boolean;
  questionId: string | null;
  slug: string | null;
  isDeleting: boolean;
  error: string;
}

interface UIStore {
  deleteModal: DeleteModalState;
  openDeleteModal: (questionId: string, slug: string) => void;
  closeDeleteModal: () => void;
  setDeleteLoading: (isDeleting: boolean) => void;
  setDeleteError: (error: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  deleteModal: {
    isOpen: false,
    questionId: null,
    slug: null,
    isDeleting: false,
    error: "",
  },
  openDeleteModal: (questionId, slug) =>
    set({
      deleteModal: {
        isOpen: true,
        questionId,
        slug,
        isDeleting: false,
        error: "",
      },
    }),
  closeDeleteModal: () =>
    set({
      deleteModal: {
        isOpen: false,
        questionId: null,
        slug: null,
        isDeleting: false,
        error: "",
      },
    }),
  setDeleteLoading: (isDeleting) =>
    set((state) => ({
      deleteModal: { ...state.deleteModal, isDeleting },
    })),
  setDeleteError: (error) =>
    set((state) => ({
      deleteModal: { ...state.deleteModal, error },
    })),
}));

// Helper hook for efficient store selection
export const useUIStoreSelector = <K extends keyof UIStore>(
  ...keys: K[]
): Pick<UIStore, K> => {
  return useMulti(useUIStore, ...keys);
};
