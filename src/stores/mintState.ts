import { Asset } from '@/utils'
import { FeeAmount } from '@uniswap/v3-sdk'
import { create } from 'zustand'

export type FullRange = true

export const Field = {
  CURRENCY_A: 'CURRENCY_A',
  CURRENCY_B: 'CURRENCY_B',
} as const

export enum Bound {
  LOWER = 'LOWER',
  UPPER = 'UPPER',
}

// export const Bound = {
//   LOWER: 'LOWER',
//   UPPER: 'UPPER',
// } as const

export const listRanges = [
  {
    type: 'FULL',
    title: 'Full Range',
    min: 0,
    max: Infinity,
  },
  {
    type: 'SAFE',
    title: 'Safe',
    min: 0.8,
    max: 1.2,
  },
  {
    type: 'NORMAL',
    title: 'Common',
    min: 0.9,
    max: 1.1,
  },
  {
    type: 'RISK',
    title: 'Expert',
    min: 0.95,
    max: 1.05,
  },
] as const

type State = {
  fee: FeeAmount
  initialPrice: string
  typedValue: string
  independentField: keyof typeof Field
  leftRangeInput: string | FullRange
  rightRangeInput: string | FullRange
  preset: (typeof listRanges)[number]
  asset0: Asset | null
  asset1: Asset | null
}

type Action = {
  updateFee: (_fee: number) => void
  handleSetToken: (_type: 'asset0' | 'asset1', _asset: Asset | null) => void
  selectPreset: (_preset: (typeof listRanges)[number]) => void
  updateLeftRangeInput: (_amount: string) => void
  updateRightRangeInput: (_amount: string) => void
  setFullRange: () => void
  updateTypedValue: (
    _typedValue: string,
    _independentField: keyof typeof Field,
  ) => void
}

export const useMintState = create<State & Action>()((set) => ({
  fee: FeeAmount.MEDIUM,
  leftRangeInput: '',
  rightRangeInput: '',
  typedValue: '',
  independentField: Field.CURRENCY_A,
  preset: listRanges[1],
  initialPrice: '0',
  asset0: null,
  asset1: null,

  updateFee: (fee: FeeAmount) => {
    set((state) => {
      return {
        ...state,
        fee: fee,
      }
    })
  },

  handleSetToken: (type: 'asset0' | 'asset1', asset: Asset | null) => {
    set((state) => {
      return {
        ...state,
        [type]: asset,
      }
    })
  },

  selectPreset: (preset: (typeof listRanges)[number]) => {
    set((state) => {
      return {
        ...state,
        preset: preset,
      }
    })
  },

  updateLeftRangeInput: (amount: string) => {
    set((state) => {
      return {
        ...state,
        leftRangeInput: amount,
      }
    })
  },

  updateRightRangeInput: (amount: string) => {
    set((state) => {
      return {
        ...state,
        rightRangeInput: amount,
      }
    })
  },

  setFullRange: () => {
    set((state) => {
      return {
        ...state,
        leftRangeInput: true,
        rightRangeInput: true,
      }
    })
  },

  updateTypedValue: (
    typedValue: string,
    independentField: keyof typeof Field,
  ) => {
    set((state) => {
      return {
        ...state,
        typedValue,
        independentField,
      }
    })
  },
}))
