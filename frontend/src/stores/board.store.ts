import { create } from 'zustand';

interface BoardStore {
  title: string;
  content: string;
  boardImageFileList: File[];
  existingBoardImages: string[];
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setBoardImageFileList: (boardImageFileList: File[]) => void;
  setExistingBoardImages: (images: string[]) => void;
  resetBoard: () => void;
}

const useBoardStore = create<BoardStore>((set) => ({
  title: '',
  content: '',
  boardImageFileList: [],
  existingBoardImages: [],
  setTitle: (title) => set((state) => ({ ...state, title })),
  setContent: (content) => set((state) => ({ ...state, content })),
  setBoardImageFileList: (boardImageFileList) =>
    set((state) => ({ ...state, boardImageFileList })),
  setExistingBoardImages: (images) =>
    set((state) => ({ ...state, existingBoardImages: images })),
  resetBoard: () =>
    set((state) => ({
      ...state,
      title: '',
      content: '',
      boardImageFileList: [],
      existingBoardImages: [],
    })),
}));

export default useBoardStore;
