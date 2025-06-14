import { OrderInfo, useDeleteOrders } from '@/apis'
import { ConfirmModal } from '@/components/Modal'
import { Button } from '@/components/ui/button'
import { BSC, USDT } from '@/components/icons'
import { Card } from '@/components/common'
import { cn } from '@/utils'
import { BanknotesIcon, CheckIcon, TrashIcon } from '@heroicons/react/16/solid'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { toast } from 'react-toastify'

type Props = {
  item: OrderInfo
  selected: boolean
  handleCancel: (_orderId: string) => void
  toggleSelected: (_value: string) => void
}

export const HistoryItem = ({
  item,
  selected,
  handleCancel,
  toggleSelected,
}: Props) => {
  const { mutate: deleteOrders } = useDeleteOrders()
  const [payin] = useState<'usdt' | 'native'>('native')

  return (
    <li key={item.order_id} className="group">
      <Card className={selected ? 'border-focus' : ''}>
        <div onClick={() => toggleSelected(item.order_id)}>
          <i className="text-sm text-text-secondary">
            {selected ? (
              <CheckIcon className="mr-2 inline size-5 stroke-green-500" />
            ) : (
              'ID: '
            )}
            {item.order_id}
          </i>
          <p className="flex justify-between gap-1">
            <span>
              Order Date:{' '}
              {DateTime.fromISO(item.order_date).toFormat('yyyy-MM-dd')}
            </span>
            <span>status: {item.status}</span>
          </p>
          <p className="mt-2 flex gap-5">
            <span className="flex items-center gap-2">
              Amount:
              {payin === 'usdt' ? (
                <span className="flex items-center gap-2">
                  <strong>{item.total_amount}</strong>
                  <USDT className="size-5" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <strong>{item.price_in_token}</strong>
                  <BSC className="size-5" />
                </span>
              )}
            </span>
          </p>
        </div>

        <div onClick={() => toggleSelected(item.order_id)} className="mt-4">
          <ul className="flex flex-wrap gap-4 ">
            {item?.order_items?.map((order) => {
              return (
                <div key={order.product_id} className="space-y-1">
                  <img
                    src={order?.product?.banner}
                    alt={order.total_price}
                    className="w-32 rounded-lg"
                  />
                  <p className="text-sm text-text-secondary">
                    {order.product.name}
                  </p>
                  <p className="flex gap-5">
                    {payin === 'usdt' ? (
                      <span className="flex items-center gap-2">
                        Price: <strong>{order.total_price}</strong>
                        <USDT className="size-5" />
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Price: <strong>{order.price_in_token}</strong>
                        <BSC className="size-5" />
                      </span>
                    )}
                  </p>
                </div>
              )
            })}
          </ul>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            className={cn(
              'w-full',
              item.status === 'pending' ? 'block' : 'hidden',
            )}
          >
            <TrashIcon className="size-5" /> Perchase
          </Button>

          <ConfirmModal
            isPending={false}
            icon={TrashIcon}
            handleSubmit={() => {
              deleteOrders([item.order_id], {
                onSuccess: async () => {
                  toast.info('Deleted successfully')
                },
              })
            }}
            isDisabled={item.status !== 'pending'}
          />

          <Button
            variant="outline"
            className={cn(
              'w-full hover:bg-red-400',
              item.status === 'paid' ? 'block' : 'hidden',
            )}
            onClick={() => handleCancel(item.order_id)}
          >
            <BanknotesIcon className="size-5" /> Cancel and refund
          </Button>

          <Button
            variant="outline"
            className={cn(
              'w-full',
              item.status === 'cancelled' ? 'block' : 'hidden',
            )}
            onClick={() => deleteOrders([item.order_id])}
          >
            <TrashIcon className="size-5" /> Remove
          </Button>

          {/* <Button */}
          {/*   title="Buy again <3" */}
          {/*   variant="filled" */}
          {/*   className={cn( */}
          {/*     'w-full', */}
          {/*     item.status === 'cancelled' ? 'block' : 'hidden' */}
          {/*   )} */}
          {/*   onClick={() => handleCancel(item.order_id)} */}
          {/* /> */}
        </div>
      </Card>
    </li>
  )
}
