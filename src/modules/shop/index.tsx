import { useGetProducts } from '@/apis'
import { useGetPrice } from '@/apis/price'
import { Button } from '@/components/common/Button'
import { BSC, USDT } from '@/components/icons'
import { ShoppingCartIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { useCartState } from './states'
import { cn } from '@/utils'

export const ShopPage = () => {
  const { add, remove, itemList } = useCartState()
  const idsList = new Set(itemList.map((item) => item.product_id))

  const { data: price } = useGetPrice({ params: { symbol: 'BNB' } })
  const { data: products } = useGetProducts({
    params: { page: 1 },
    options: { enabled: true }
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
                <h3 className="animate absolute -bottom-6 left-5 z-10 group-hover:bottom-5">
                  <p className="mb-2 text-xl font-bold text-lighterAccent">
                    {item.name}
                  </p>
                  <ol className="flex text-sm text-white">
                    <li className="pr-2 font-bold">Price:</li>
                    <li className="flex-center gap-2 pr-2">
                      {item.price}
                      <USDT className="inline-block size-5" />
                    </li>

                    <li className="flex-center gap-2 pr-2">
                      {(Number(item.price) / (price ?? 1)).toFixed(5)}
                      <BSC className="inline-block size-5" />
                    </li>
                  </ol>
                </h3>

                <Button
                  title={isAdded ? 'remove' : 'Add'}
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