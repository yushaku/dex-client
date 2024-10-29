import { SHOP_PAYMENT_ABI } from '@/abi/shopPayment'
import { useGetOrders } from '@/apis'
import { LoadingModal } from '@/components/Modal'
import { useGetTx } from '@/hooks/useGetTx'
import { SHOP_PAYMENT_ADDRESS, TOPICS } from '@/utils'
import { toast } from 'react-toastify'
import { useAccount, useWatchContractEvent, useWriteContract } from 'wagmi'
import { HistoryItem } from './components/HistoryItem'

export const HistoryPage = () => {
  const { address } = useAccount()
  const { transactionHref } = useGetTx()
  const { writeContract, isPending } = useWriteContract()

  const { data: orderHistory } = useGetOrders({
    params: { page: 1, perPage: 10 }
  })

  const handleCancel = (orderId: string) => {
    writeContract({
      address: SHOP_PAYMENT_ADDRESS,
      abi: SHOP_PAYMENT_ABI,
      functionName: 'cancelOrder',
      args: [orderId]
    })
  }

  useWatchContractEvent({
    address: SHOP_PAYMENT_ADDRESS,
    abi: SHOP_PAYMENT_ABI,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onLogs(logs: any) {
      const args = logs[0].args
      console.log('New logs!', logs)

      if (args.buyer === address) {
        switch (logs[0].topics[0]) {
          case TOPICS.ORDER_PAID:
            toast.info(
              <a href={transactionHref(logs[0].transactionHash)}>
                Payment success. Click here to view.
              </a>
            )
            break

          case TOPICS.ORDER_CANCELLED: {
            toast.info(
              <a href={transactionHref(logs[0].transactionHash)}>
                Order canceled. Click here to view.
              </a>
            )
            break
          }

          default:
            break
        }
      }
    }
  })

  return (
    <div className="min-h-dvh">
      <h3 className="mb-5 text-xl">Your Order History</h3>

      <ul className="grid grid-cols-2 gap-4">
        {orderHistory?.data?.map((item) => {
          return (
            <HistoryItem
              key={item.order_id}
              item={item}
              handleCancel={handleCancel}
            />
          )
        })}
      </ul>

      <LoadingModal
        title="Waiting you sign in your wallet..."
        isShow={isPending}
      />
    </div>
  )
}
