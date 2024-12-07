import { User } from 'types/interface';
import { create } from 'zustand';

interface SignInUserStore {
  signInUser: User | null;
  setSignInUser: (loginUser: User) => void;
  resetSignInUser: () => void;
}

const useSignInUserStore = create<SignInUserStore>((set) => ({
  signInUser: null,
  setSignInUser: (signInUser) => set((state) => ({ ...state, signInUser })),
  resetSignInUser: () => set((state) => ({ ...state, signInUser: null })),
}));

export default useSignInUserStore;
