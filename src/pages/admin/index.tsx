import { useGetAllOrders } from '@/apis'
import { SHOP_PAYMENT_ADDRESS, env } from '@/utils'
import { useAccount } from 'wagmi'
import { OnlyAdmin } from './components/OnlyAdmin'
import { OrderItem } from './components/OrderItem'
import { NativeBalance } from '@/components/common/NativeTokenBalance'
import { Tab } from '@/components/layout/tab'
import { useMemo, useState } from 'react'

const listFeature = ['Paid', 'Shipping', 'Deliverd'] as const

export const AdminPage = () => {
  const [type, setType] = useState<(typeof listFeature)[number]>('Paid')
  const { address } = useAccount()

  const { data: orders } = useGetAllOrders({})

  const paiedOrders = useMemo(
    () => orders?.data.filter((item) => item.status === 'processing'),
    [orders]
  )

  const shippingOrders = useMemo(
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
          <ul className="grid grid-cols-3 gap-4">
            {paiedOrders?.map((item) => {
              return (
                <OrderItem
                  key={item.order_id}
                  item={item}
                  handleCancel={() => {}}
                />
              )
            })}
          </ul>
        </Tab>

        <Tab isOpen={type === 'Shipping'}>
          <ul className="grid grid-cols-3 gap-4">
            {shippingOrders?.map((item) => {
              return (
                <OrderItem
                  key={item.order_id}
                  item={item}
                  handleCancel={() => {}}
                />
              )
            })}
          </ul>
        </Tab>
      </div>
    </div>
  )
}
