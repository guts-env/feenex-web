import { create } from 'zustand'
import { type IUserProfile } from '@/types/users'
export interface UserStore {
  user: IUserProfile | null
  token: string | null
  setToken: (token: string | null) => void
  setUser: (user: IUserProfile | null) => void
  logout: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  token: null,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, token: null }),
}))
