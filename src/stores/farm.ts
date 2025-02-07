import { create } from 'zustand'

type StakeType = 'ETH' | 'YSK' | null

type State = {
  data: StakeType
}

type Action = {
  toggleFarmin: (_data: StakeType) => void
}

export const useFarmState = create<State & Action>()((set) => ({
  data: null,
  toggleFarmin: (type: StakeType) => {
    set({
      data: type,
    })
  },
}))
