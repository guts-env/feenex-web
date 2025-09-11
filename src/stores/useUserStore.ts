import { create } from 'zustand';

export interface IStoreUser {
  id: string;
  email: string;
  organization: {
    id: string;
    name: string;
    type: 'business' | 'personal';
  };
  role: {
    id: string;
    name: 'business_admin' | 'personal_admin' | 'member';
  };
}

export interface UserStore {
  user: IStoreUser | null;
  token: string | null;
  setToken: (token: string | null) => void;
  setUser: (user: IStoreUser | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  token: null,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, token: null }),
}));
