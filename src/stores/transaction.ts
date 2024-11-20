/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'

type State = {
  key: string | null
  popup: boolean
  title: string
  transactions: Record<
    string,
    {
      hash: string | null
      status: string
      desc: string
    }
  >
  final: string | null
  link: string | null
  retryModalIsOpen: boolean
  retryParams: any | null
}

export type Action = {
  openTransaction: (_payload: {
    title: string
    transactions: Record<
      string,
      { hash: string | null; status: string; desc: string }
    >
    key: string
  }) => void

  updateTransaction: (_payload: {
    key: string
    uuid: string
    hash?: string | null
    status: string
  }) => void

  completeTransaction: (_payload: {
    final: string
    link?: string
    key: string
  }) => void

  openRetryTransactionModal: (_payload: {
    params: any
    resolver: (_value: boolean) => void
  }) => void

  retryResolver: ((_value: boolean) => void) | null
  closeTransaction: () => void
  closeRetryTransactionModal: () => void
  clearRetryParams: () => void
  closeTransactionPopup: () => void
}

export const useTransactionStore = create<State & Action>((set) => ({
  key: null,
  popup: false,
  title: '',
  transactions: {},
  final: null,
  link: null,
  retryModalIsOpen: false,
  retryParams: null,
  retryResolver: null,

  openTransaction: ({ title, transactions, key }) =>
    set(() => ({
      key,
      popup: true,
      title,
      transactions,
      final: null,
      link: null,
    })),

  updateTransaction: ({ key, uuid, hash = null, status }) =>
    set((state) => {
      if (state.key === key) {
        return {
          transactions: {
            ...state.transactions,
            [uuid]: {
              ...state.transactions[uuid],
              hash,
              status,
            },
          },
        }
      }
      return {}
    }),

  completeTransaction: ({ final, link, key }) =>
    set((state) => {
      if (state.key === key) {
        return { final, link }
      }
      return {}
    }),

  closeTransaction: () =>
    set((state) => {
      if (state.retryResolver) {
        state.retryResolver(false)
      }

      return {
        key: null,
        popup: false,
        title: '',
        transactions: {},
        final: null,
        link: null,
        retryModalIsOpen: false,
        retryParams: null,
        retryResolver: null,
      }
    }),

  openRetryTransactionModal: ({ params, resolver }) =>
    set(() => ({
      retryModalIsOpen: true,
      retryParams: params,
      retryResolver: resolver,
    })),

  closeRetryTransactionModal: () => set(() => ({ retryModalIsOpen: false })),

  clearRetryParams: () =>
    set((state) => {
      if (state.retryResolver) {
        state.retryResolver(false)
      }
      return { retryParams: null, retryResolver: null }
    }),

  closeTransactionPopup: () => set(() => ({ popup: false })),
}))
