import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type NotiInfo = {
  title: string
  description: string
  txHash: string
  link: string
}

type State = {
  itemList: Array<NotiInfo>
}

type Action = {
  add: (_noti: NotiInfo) => void
  remove: (_txHash: string) => void
  clearAll: () => void
}

export const useNotificationsState = create<State & Action>()(
  persist(
    (set) => ({
      itemList: [],
      idsList: {},

      add: (noti: NotiInfo) =>
        set((state) => {
          return {
            itemList: [...state.itemList, noti]
          }
        }),

      remove: (txHash: string) =>
        set(({ itemList }) => {
          return {
            itemList: itemList.filter((item) => item.txHash !== txHash)
          }
        }),

      clearAll: () =>
        set({
          itemList: []
        })
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({
        itemList: state.itemList
      })
    }
  )
)
