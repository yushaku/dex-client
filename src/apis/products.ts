import {
  QueryClient,
  useMutation,
  useQuery,
  UseQueryOptions
} from '@tanstack/react-query'
import instance from './client'
import { ApiResponce } from '@/types'
import { toast } from 'react-toastify'

type Pagination = {
  page?: number
  perPage?: number
}

type GetProductsProps = {
  params?: Pagination
  options?: Omit<UseQueryOptions<ApiResponce<Products>>, 'queryKey' | 'queryFn'>
}

export type Products = {
  product_id: number
  name: string
  description: string
  price: string
  stock_quantity: number
  banner: string
  image_urls: string[]
  created_at: Date
  updated_at: Date
}

export const useGetProducts = ({ params, options }: GetProductsProps) => {
  return useQuery({
    queryKey: ['products', JSON.stringify(params)],
    queryFn: async () => {
      const res = await instance.get('/products', {
        params: {
          page: params?.page || 1,
          perPage: params?.perPage || 10
        }
      })
      return res.data
    },
    ...options
  })
}

export type CreateAddress = {
  recipient_name: string
  street: string
  city: string
  phone_number: string
}

const addressKey = '/users/address'
export const useCreateAddress = () => {
  const queryClient = new QueryClient()

  return useMutation({
    mutationFn: (data: CreateAddress) => {
      return instance.post(addressKey, data)
    },
    onSuccess: async () => {
      toast.info('Created successfully')
      await queryClient.invalidateQueries({ queryKey: [addressKey] })
    }
  })
}

export type StreetAddress = {
  address_id: number
  user_wallet: string
  recipient_name: string
  phone_number: string
  street: string
  city: string
}

type GetAddressProps = {
  params?: Pagination
  options?: Omit<UseQueryOptions<StreetAddress[]>, 'queryKey' | 'queryFn'>
}

export const useGetAddresses = ({ params, options }: GetAddressProps) => {
  return useQuery({
    queryKey: [addressKey, JSON.stringify(params)],
    queryFn: async () => {
      const res = await instance.get(addressKey, {
        params: {
          page: params?.page || 1,
          perPage: params?.perPage || 10
        }
      })
      return res.data
    },
    ...options
  })
}

export type CreateOrder = {
  address_id: number
  token_address: string
  products: Array<{
    product_id: number
    quantity: number
  }>
}

export type Order = {
  order_id: string
  price_in_token: string
}

export type OrderList = {
  order_id: string
  product_id: number
  quantity: number
  unit_price: string
  total_price: string
  price_in_token: string
}

export type OrderResponse = {
  encodeData: string
  unit: string
  order: Order
  orderList: OrderList[]
}

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (data: CreateOrder) => {
      const res = await instance.post('order', data)
      return res.data as OrderResponse
    }
  })
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type OrderInfo = {
  order_id: string
  user_wallet: string
  order_date: string
  status: OrderStatus
  total_amount: string
  price_in_token: string
  order_items: Array<{
    product_id: string
    price_in_token: string
    quantity: number
    total_price: string
    product: {
      banner: string
      name: string
    }
  }>
  shipping_address_id: number
  created_at: Date
  updated_at: Date
}

type GetOrderProps = {
  params?: Pagination
  options?: Omit<
    UseQueryOptions<ApiResponce<OrderInfo>>,
    'queryKey' | 'queryFn'
  >
}

const orderKey = '/order'
export const useGetOrders = ({ params, options }: GetOrderProps) => {
  return useQuery({
    queryKey: [orderKey, JSON.stringify(params)],
    queryFn: async () => {
      const res = await instance.get(orderKey, {
        params: {
          page: params?.page || 1,
          perPage: params?.perPage || 10
        }
      })
      return res.data
    },
    ...options
  })
}

export const useDeleteOrders = () => {
  const queryClient = new QueryClient()

  return useMutation({
    mutationFn: async (order_ids: Array<string>) => {
      const res = await instance.delete(orderKey, {
        data: {
          order_ids
        }
      })
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [orderKey] })
    }
  })
}

const orderKeyAdmin = '/order/admin'
export const useGetAllOrders = ({ params, options }: GetOrderProps) => {
  return useQuery({
    queryKey: [orderKeyAdmin, JSON.stringify(params)],
    queryFn: async () => {
      const res = await instance.get(orderKeyAdmin, {
        params: {
          page: params?.page || 1,
          perPage: params?.perPage || 10
        }
      })
      return res.data
    },
    ...options
  })
}
