import { SHOP_PAYMENT_ABI } from '@/abi/shopPayment'
import { orderKeyAdmin, useGetAllOrders } from '@/apis'
import { EmptyBox } from '@/components/common/EmptyBox'
import {
  NativeBalance,
  NativeToken
} from '@/components/common/NativeTokenBalance'
import { Tab } from '@/components/layout/tab'
import { useGetTx } from '@/hooks/useGetTx'
import { SHOP_PAYMENT_ADDRESS, TOPICS, ZERO_ADDRESS, env } from '@/utils'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useAccount, useReadContracts, useWatchContractEvent } from 'wagmi'
import { OnlyAdmin } from './components/OnlyAdmin'
import { OrderItem } from './components/OrderItem'
import { formatEther } from 'viem'

const listFeature = ['Paid', 'Shipping', 'Deliverd'] as const

export const AdminPage = () => {
  // GLOBAL STATE
  const { address } = useAccount()
  const queryClient = useQueryClient()
  const { transactionHref } = useGetTx()

  // LOCAL STATE
  const [type, setType] = useState<(typeof listFeature)[number]>('Paid')
  // const [selectToDiliver, setSelectToDiliver] = useState<Array<number>>([])

  // API
  const { data: orders } = useGetAllOrders({
    params: {
      page: 1,
      perPage: 50
    },
    options: {
      enabled: address === env.VITE_OWNER_ADDRESS
    }
  })

  const paiedOrders = useMemo(
    () => orders?.data.filter((item) => item.status === 'paid'),
    [orders]
  )

  const shippingOrders = useMemo(
    () => orders?.data.filter((item) => item.status === 'delivering'),
    [orders]
  )

  const shippedOrder = useMemo(
    () => orders?.data.filter((item) => item.status === 'shipped'),
    [orders]
  )

  const { data: withdrawable } = useReadContracts({
    contracts: [
      {
        address: SHOP_PAYMENT_ADDRESS,
        abi: SHOP_PAYMENT_ABI,
        functionName: 'withdrawable',
        args: [ZERO_ADDRESS]
      }
      // {
      //   address: SHOP_PAYMENT_ADDRESS,
      //   abi: SHOP_PAYMENT_ABI,
      //   functionName: 'withdrawable',
      //   args: ['0x6b175474e89094c44da98b954eedeac495271d0f']
      // }
    ]
  })

  console.log(withdrawable)

  useWatchContractEvent({
    address: SHOP_PAYMENT_ADDRESS,
    abi: SHOP_PAYMENT_ABI,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async onLogs(logs: any) {
      // const args = logs[0].args
      console.log('New logs!', logs)

      switch (logs[0].topics[0]) {
        case TOPICS.ORDER_DELIVERED:
          toast.info(
            <a href={transactionHref(logs[0].transactionHash)}>
              Deliver success. Click here to view.
            </a>
          )
          await queryClient.invalidateQueries({ queryKey: [orderKeyAdmin] })
          break

        default:
          break
      }
    }
  })

  if (address !== env.VITE_OWNER_ADDRESS) {
    return <OnlyAdmin />
  }

  return (
    <div className="min-h-dvh">
      <h3 className="mb-5 flex gap-10 text-xl">
        <p className="flex gap-2">
          <span>Shop Balance:</span>
          <NativeBalance address={SHOP_PAYMENT_ADDRESS} />
        </p>
        |
        <p className="flex content-center justify-between">
          <span>
            Withdrawable: {formatEther(withdrawable?.[0].result as bigint)}
          </span>
          <NativeToken />
        </p>
      </h3>

      <div className="flex w-fit rounded-lg border-4 border-layer bg-layer">
        {listFeature.map((feat) => {
          const pickedStyle = type === feat && 'bg-background'
          return (
            <button
              key={feat}
              className={`${pickedStyle} rounded-lg px-8 py-3 `}
              onClick={() => setType(feat)}
            >
              {feat}
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex h-1/2">
        <Tab isOpen={type === 'Paid'}>
          <ul className="grid grid-cols-2 gap-4">
            {paiedOrders?.map((item) => {
              return <OrderItem key={item.order_id} item={item} />
            })}
          </ul>
          <EmptyBox isShow={paiedOrders?.length === 0} />
        </Tab>

        <Tab isOpen={type === 'Shipping'}>
          <ul className="grid grid-cols-2 gap-4">
            {shippingOrders?.map((item) => {
              return <OrderItem key={item.order_id} item={item} />
            })}
          </ul>
          <EmptyBox isShow={shippingOrders?.length === 0} />
        </Tab>

        <Tab isOpen={type === 'Deliverd'}>
          <ul className="grid grid-cols-2 gap-4">
            {shippedOrder?.map((item) => {
              return <OrderItem key={item.order_id} item={item} />
            })}
          </ul>
          <EmptyBox isShow={shippedOrder?.length === 0} />
        </Tab>
      </div>
    </div>
  )
}
