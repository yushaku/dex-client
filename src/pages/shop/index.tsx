import { SHOP_PAYMENT_ABI } from '@/abi/shopPayment'
import { useGetProducts } from '@/apis'
import { useGetPrice } from '@/apis/price'
import { Button } from '@/components/common/Button'
import { BSC, USDT } from '@/components/icons'
import { useGetTx } from '@/hooks/useGetTx'
import { useCartState, useNotificationsState } from '@/stores'
import { SHOP_PAYMENT_ADDRESS, TOPICS, cn } from '@/utils'
import { ShoppingCartIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { toast } from 'react-toastify'
import { useWatchContractEvent } from 'wagmi'

export const ShopPage = () => {
  // const { address } = useAccount()
  const { add, remove, itemList } = useCartState()
  const { add: addNoti } = useNotificationsState()
  const idsList = new Set(itemList.map((item) => item.product_id))
  const { transactionHref } = useGetTx()

  const { data: price } = useGetPrice({ params: { symbol: 'BNB' } })
  const { data: products } = useGetProducts({
    params: { page: 1 },
    options: { enabled: true }
  })

  useWatchContractEvent({
    address: SHOP_PAYMENT_ADDRESS,
    abi: SHOP_PAYMENT_ABI,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onLogs(logs: any) {
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
          break
        }

        default:
          break
      }
    }
  })

  return (
    <div>
      <h3 className="text-lg">Buy some product to support us</h3>

      <ul className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
        {products &&
          products.data.map((item, index) => {
            const isAdded = idsList.has(item.product_id)

            return (
              <li
                key={index}
                className={cn(
                  'group relative overflow-hidden rounded-lg',
                  isAdded ? 'border border-gray-500' : ''
                )}
              >
                <img
                  src={item.banner}
                  alt={item.name}
                  className="w-full bg-cover object-cover"
                />
                <div className="animate absolute -bottom-11 left-5 z-10 group-hover:bottom-5">
                  <p className="mb-2 text-xl font-bold text-lighterAccent">
                    {item.name}
                  </p>
                  <ol className="grid gap-1 text-sm text-white">
                    <li className="flex items-center gap-2 pr-2">
                      <USDT className="inline-block size-5" />
                      {item.price}
                    </li>

                    <li className="flex items-center gap-2 pr-2">
                      <BSC className="inline-block size-5" />
                      {(Number(item.price) / (price ?? 1)).toFixed(5)}
                    </li>
                  </ol>
                </div>

                <Button
                  icon={isAdded ? XMarkIcon : ShoppingCartIcon}
                  className={cn(
                    'animate absolute -bottom-6 right-5 z-50 opacity-0 delay-100 group-hover:bottom-5 group-hover:opacity-100',
                    isAdded ? 'bg-gray-500' : ''
                  )}
                  onClick={() => {
                    if (isAdded) {
                      remove(item.product_id)
                    } else {
                      add({ ...item, quantity: 1 })
                    }
                  }}
                />

                <article className="absolute inset-0 w-full bg-gradient-to-t from-[rgba(0,0,0,0.9)] to-[rgba(255,255,255,0.01)] group-hover:-bottom-5" />
              </li>
            )
          })}
      </ul>
    </div>
  )
}
