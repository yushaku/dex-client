import { SHOP_PAYMENT_ABI } from '@/abi/shopPayment'
import { OrderInfo, useDeliverOrders } from '@/apis'
import { Button } from '@/components/ui/button'
import { BSC, USDT } from '@/components/icons'
import { Card } from '@/components/common'
import { SHOP_PAYMENT_ADDRESS, cn } from '@/utils'
import { toastContractError } from '@/utils/error'
import { CheckCircleIcon, GiftIcon, TrashIcon } from '@heroicons/react/16/solid'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { useWriteContract } from 'wagmi'

type Props = {
  item: OrderInfo
}

export const OrderItem = ({ item }: Props) => {
  const { writeContract, isPending: isCallContract } = useWriteContract()
  const { mutate: deliverOrders, isPending: isDelivering } = useDeliverOrders()

  const handleForceCancel = (orderIds: Array<string>) => {
    writeContract(
      {
        address: SHOP_PAYMENT_ADDRESS,
        abi: SHOP_PAYMENT_ABI,
        functionName: 'forceCancelOrder',
        args: [orderIds],
      },
      {
        onError: toastContractError,
      },
    )
  }

  const handleDelivered = (orderIds: Array<string>) => {
    writeContract(
      {
        address: SHOP_PAYMENT_ADDRESS,
        abi: SHOP_PAYMENT_ABI,
        functionName: 'deliverOrder',
        args: [orderIds],
      },
      {
        onError: toastContractError,
      },
    )
  }

  const [payin] = useState<'usdt' | 'native'>('native')

  return (
    <li key={item.order_id} className="group">
      <Card>
        <div>
          <i className="text-sm text-text-secondary">ID: {item.order_id}</i>
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

        <div className="mt-4">
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

          <div
            id="BUTTONS LIST FOR PAID ORDER"
            className={cn(
              'mt-4 hidden gap-2 ',
              item.status === 'paid' && 'flex',
            )}
          >
            <Button
              variant="outline"
              className={cn('w-full')}
              onClick={() => handleForceCancel([item.order_id])}
            >
              <TrashIcon className="size-5" /> Cancel and refund
            </Button>

            <Button
              className={cn('w-full')}
              onClick={() => deliverOrders([item.order_id])}
            >
              <GiftIcon className="size-5" /> Shipping
            </Button>
          </div>

          <div
            id="BUTTONS LIST FOR DELIVERING ORDER"
            className={cn(
              'mt-4 hidden gap-2 ',
              item.status === 'delivering' && 'flex',
            )}
          >
            <Button
              variant="outline"
              className={cn('w-full')}
              onClick={() => handleForceCancel([item.order_id])}
            >
              <TrashIcon className="size-5" /> Cancel and refund
            </Button>

            <Button
              className={cn('w-full')}
              onClick={() => handleDelivered([item.order_id])}
            >
              <CheckCircleIcon className="size-5" /> Delivered
            </Button>
          </div>
        </div>
      </Card>
    </li>
  )
}
