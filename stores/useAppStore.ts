import { create } from 'zustand'

interface StoreState {
  username: string | null
  setUsername: (name: string) => void
  roomToken: string | null
  setRoomToken: (token: string) => void
  stage: number
  setStage: (stage: number) => void
  round: number
  setRound: (round: number) => void
  phase: number
  setPhase: (phase: number) => void
  numRounds: number
  setNumRounds: (num: number) => void
  usedImages: string[]
  setUsedImages: (images: string[]) => void
  roundImage: string | null
  setRoundImage: (image: string | null) => void
}

export const useAppStore = create<StoreState>((set) => ({
  username: null,
  setUsername: (name: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('username', name)
    }
    set(() => ({ username: name }))
  },
  roomToken: null,
  setRoomToken: (token: string) => set(() => ({ roomToken: token })),
  stage: 0,
  setStage: (stage: number) => set(() => ({ stage })),
  round: 0,
  setRound: (round: number) => set(() => ({ round })),
  phase: 0,
  setPhase: (phase: number) => set(() => ({ phase })),
  numRounds: 0,
  setNumRounds: (num: number) => set(() => ({ numRounds: num })),
  usedImages: [],
  setUsedImages: (images: string[]) => set(() => ({ usedImages: images })),
  roundImage: null,
  setRoundImage: (image: string | null) => set(() => ({ roundImage: image })),
}))
