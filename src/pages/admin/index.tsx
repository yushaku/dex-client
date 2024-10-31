import { useGetAllOrders } from '@/apis'
import { NativeBalance } from '@/components/common/NativeTokenBalance'
import { Tab } from '@/components/layout/tab'
import { SHOP_PAYMENT_ADDRESS, env } from '@/utils'
import { useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { OnlyAdmin } from './components/OnlyAdmin'
import { OrderItem } from './components/OrderItem'
import { EmptyBox } from '@/components/common/EmptyBox'

const listFeature = ['Paid', 'Shipping', 'Deliverd'] as const

export const AdminPage = () => {
  // GLOBAL STATE
  const { address } = useAccount()

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

  if (address !== env.VITE_OWNER_ADDRESS) {
    return <OnlyAdmin />
  }

  return (
    <div className="min-h-dvh">
      <h3 className="mb-5 flex gap-2 text-xl">
        <span>Shop Balance</span>
        <NativeBalance address={SHOP_PAYMENT_ADDRESS} />
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
