import { SHOP_PAYMENT_ABI } from '@/abi/shopPayment'
import { orderKey, useDeleteOrders, useGetOrders } from '@/apis'
import { LoadingModal } from '@/components/Modal'
import { Button } from '@/components/common/Button'
import { EmptyBox } from '@/components/common/EmptyBox'
import { useGetTx } from '@/hooks/useGetTx'
import { useNotificationsState } from '@/stores'
import { SHOP_PAYMENT_ADDRESS, TOPICS, cn } from '@/utils'
import { TrashIcon } from '@heroicons/react/16/solid'

import { useState } from 'react'
import { toast } from 'react-toastify'
import { useWatchContractEvent, useWriteContract } from 'wagmi'
import { HistoryItem } from './components/HistoryItem'
import { useQueryClient } from '@tanstack/react-query'

export const HistoryPage = () => {
  const { transactionHref } = useGetTx()
  const { writeContract, isPending } = useWriteContract()
  const queryClient = useQueryClient()
  const { mutate: deleteOrders, isPending: isDeleting } = useDeleteOrders()
  const { add: addNoti } = useNotificationsState()
  const [selected, setSelected] = useState<Array<string>>([])

  const { data: orderHistory } = useGetOrders({
    params: { page: 1, perPage: 10 }
  })

  const handleCancel = (orderId: string) => {
    writeContract(
      {
        address: SHOP_PAYMENT_ADDRESS,
        abi: SHOP_PAYMENT_ABI,
        functionName: 'cancelOrder',
        args: [orderId]
      },
      {
        onError: async (e) => {
          const msg = e.message.includes('User rejected')
            ? 'User denied transaction signature'
            : 'Error: Transaction failed'
          toast.error(msg)
        }
      }
    )
  }

  const toggleSelected = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value))
    } else {
      if (selected.length > 20) return
      setSelected([...selected, value])
    }
  }

  useWatchContractEvent({
    address: SHOP_PAYMENT_ADDRESS,
    abi: SHOP_PAYMENT_ABI,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async onLogs(logs: any) {
      // const args = logs[0].args
      console.log('New logs!', logs)

      switch (logs[0].topics[0]) {
        case TOPICS.ORDER_PAID:
          addNoti({
            txHash: logs[0].transactionHash,
            title: 'Payment success',
            description: 'Thanks for your purchase',
            link: transactionHref(logs[0].transactionHash)
          })
          toast.info(
            <a href={transactionHref(logs[0].transactionHash)}>
              Payment success. Click here to view.
            </a>
          )
          await queryClient.invalidateQueries({ queryKey: [orderKey] })
          break

        case TOPICS.ORDER_CANCELLED: {
          addNoti({
            txHash: logs[0].transactionHash,
            title: 'Canceled order success',
            description: 'You canceled order successfully',
            link: transactionHref(logs[0].transactionHash)
          })
          toast.info(
            <a href={transactionHref(logs[0].transactionHash)}>
              Order canceled. Click here to view.
            </a>
          )
          await queryClient.invalidateQueries({ queryKey: [orderKey] })
          break
        }

        default:
          break
      }
    }
  })

  return (
    <div className="min-h-dvh">
      <div className="mb-5 flex justify-between text-xl">
        <span>Your Order History</span>

        <div>
          <span
            className={cn(
              'text-sm text-textSecondary mr-2',
              selected.length === 0 && 'hidden'
            )}
          >
            Selected to delete {selected.length}/20
          </span>

          <Button
            variant="outline"
            className={cn(
              'inline p-1 px-2 hover:bg-red-400',
              selected.length === 0 && 'hidden'
            )}
            onClick={() => deleteOrders(selected)}
            icon={TrashIcon}
          />
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-4">
        {orderHistory?.data?.map((item) => {
          return (
            <HistoryItem
              key={item.order_id}
              selected={selected.includes(item.order_id)}
              item={item}
              handleCancel={handleCancel}
              toggleSelected={toggleSelected}
            />
          )
        })}
      </ul>

      <EmptyBox isShow={orderHistory?.data.length === 0} />

      <LoadingModal
        title="Waiting you sign in your wallet..."
        isShow={isPending || isDeleting}
      />
    </div>
  )
}
