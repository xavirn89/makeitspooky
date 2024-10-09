import { create } from 'zustand'

interface StoreState {
  username: string | null
  setUsername: (name: string) => void
  roomToken: string | null
  setRoomToken: (token: string) => void
}

export const useStore = create<StoreState>((set) => ({
  username: null,
  setUsername: (name) => set(() => ({ username: name })),
  roomToken: null,
  setRoomToken: (token) => set(() => ({ roomToken: token }))
}))
