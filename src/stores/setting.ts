import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Setting = {
  slippage: number
  deadline: number
}

type State = {
  setting: Setting
}

type Action = {
  updateSetting: (_data: Setting) => void
}

export const useSettingState = create<State & Action>()(
  persist(
    (set) => ({
      setting: {
        slippage: 0.5,
        deadline: 30
      },
      updateSetting: ({ slippage, deadline }: Setting) => {
        set({
          setting: {
            slippage,
            deadline
          }
        })
      }
    }),
    {
      name: 'setting-storage',
      partialize: (state) => ({
        itemList: state.setting
      })
    }
  )
)
