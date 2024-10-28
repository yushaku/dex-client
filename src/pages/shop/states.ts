import { Products } from '@/apis'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Cart = Omit<Products, 'description' | 'image_urls'> & {
  quantity: number
}

type State = {
  itemList: Array<Cart>
}

type Action = {
  add: (_cart: Cart) => void
  remove: (_id: number) => void
  clearCart: () => void
  increase: (_id: number) => void
  decrease: (_id: number) => void
  setAmount: (_id: number, _quantity: number) => void
}

export const useCartState = create<State & Action>()(
  persist(
    (set) => ({
      itemList: [],
      idsList: {},

      add: (cart: Cart) =>
        set((state) => {
          return {
            itemList: [...state.itemList, cart]
          }
        }),

      remove: (id: number) =>
        set(({ itemList }) => {
          return {
            itemList: itemList.filter((item) => item.product_id !== id)
          }
        }),

      clearCart: () =>
        set({
          itemList: []
        }),

      increase: (id: number) =>
        set(({ itemList }) => ({
          itemList: itemList.map((item) =>
            item.product_id === id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        })),

      decrease: (id: number) =>
        set(({ itemList }) => ({
          itemList: itemList.map((item) =>
            item.product_id === id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        })),

      setAmount: (id: number, quantity: number) =>
        set(({ itemList }) => ({
          itemList: itemList.map((item) =>
            item.product_id === id ? { ...item, quantity } : item
          )
        }))
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        itemList: state.itemList
      })
    }
  )
)
