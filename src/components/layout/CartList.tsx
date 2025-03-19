import { ItemNft, LOCAL_STORAGE, NftCart, cn } from '@/utils'
import { ShoppingBagIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { useState } from 'react'
import useLocalStorage from 'use-local-storage'
import { ImgLoading, NativeToken } from '../common'
import { Button } from '../ui/button'

export const NFTCartList = () => {
  const [value, setValue] = useLocalStorage<NftCart>(LOCAL_STORAGE.SHOP_NFT, {})
  const [toggle, setToggle] = useState(false)
  const styled = toggle ? 'right-0 top-0' : '-right-full top-0'

  function handleCart(cart: ItemNft) {
    const { cip, address } = cart
    const key = `${address}-${cip}`

    if (value[key]) {
      delete value[key]
      setValue(value)
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setToggle(!toggle)}>
        <ShoppingBagIcon className="size-5" />
        {Object.keys(value).length.toString()}
      </Button>

      <div
        onClick={() => setToggle(false)}
        className={cn(
          'animate delay-50 duration-100 fixed top-0 -right-full z-30 h-screen w-screen bg-gray-500/20',
          toggle && 'right-0',
        )}
      />

      <div
        className={cn('animate fixed h-screen p-5 z-50 w-96 bg-layer', styled)}
      >
        <h3 className="mt-5 flex justify-between">
          <span className="text-2xl font-bold text-lighterAccent">
            Your cart
          </span>

          <XMarkIcon className="size-6" onClick={() => setToggle(false)} />
        </h3>

        <ul className="no-scrollbar mt-5 max-h-[70vh] space-y-3 overflow-y-scroll">
          {Object.values(value).map((item, index) => (
            <li
              key={index}
              className="group relative flex items-center gap-3 rounded-lg p-2 hover:bg-focus"
            >
              {/* <img src={item.url} alt="nft" className="size-10 rounded-lg" /> */}
              <ImgLoading />
              <article>
                <h3>{item.name}</h3>
                <p>{item.price}</p>
              </article>

              <article className={`absolute right-0 hidden group-hover:block`}>
                <Button
                  variant="outline"
                  title="Remove"
                  onClick={() => handleCart(item)}
                />
              </article>
            </li>
          ))}
        </ul>

        <article className="absolute bottom-0 left-0 w-full bg-focus p-5">
          <h3 className="mb-5 flex justify-between">
            <span>Total:</span>
            <span className="text-xl font-bold text-lighterAccent">
              123 <NativeToken />
            </span>
          </h3>
          <Button className="w-full" title="Buy" />
        </article>
      </div>
    </>
  )
}
