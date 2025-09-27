import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { USER_STORE } from '@/constants/store'
import { type IUserProfile } from '@/types/users'

export interface UserStore {
  user: IUserProfile | null
  token: string | null
  setToken: (token: string | null) => void
  setUser: (user: IUserProfile | null) => void
  logout: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () => {
        set({ user: null, token: null });
        window.location.href = '/login';
      },
    }),
    {
      name: USER_STORE,
      partialize: (state) => ({ user: state.user }),
    },
  ),
)
