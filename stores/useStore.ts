import { create } from 'zustand'

interface StoreState {
  username: string | null
  setUsername: (name: string) => void
  roomToken: string | null
  setRoomToken: (token: string) => void
}

export const useStore = create<StoreState>((set) => ({
  username: null,
  setUsername: (name: string) => {
    // Guardar el nombre en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('username', name)
    }
    set(() => ({ username: name }))
  },
  roomToken: null,
  setRoomToken: (token: string) => set(() => ({ roomToken: token }))
}))
