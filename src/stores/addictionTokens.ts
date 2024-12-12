import { Asset } from '@/utils'
import { Address, getAddress } from 'viem'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type WrapAsset = Asset & {
  balance?: string
  isCustom?: boolean
  isLocal?: boolean
}

type State = {
  tokenList: Array<WrapAsset>
}

type Action = {
  add: (_item: WrapAsset) => void
  remove: (_address: Address) => void
}

export const useTokensState = create<State & Action>()(
  persist(
    (set) => ({
      tokenList: [],
      idsList: {},

      add: (token: WrapAsset) =>
        set((state) => {
          return {
            tokenList: [...state.tokenList, token],
          }
        }),

      remove: (address: Address) =>
        set(({ tokenList }) => {
          return {
            tokenList: tokenList.filter(
              (item) => getAddress(item.address) !== getAddress(address),
            ),
          }
        }),
    }),
    {
      name: 'tokens-storage',
      partialize: (state) => ({
        tokenList: state.tokenList,
      }),
    },
  ),
)
