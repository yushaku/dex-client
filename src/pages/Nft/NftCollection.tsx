import { ERC721_ABI } from '@/abi/erc721.ts'
import { Button } from '@/components/common/Button'
import { DotLoader } from '@/components/common/Loading'
import { NativeToken } from '@/components/common/NativeTokenBalance'
import { GATEWAY_URL, ItemNft, LOCAL_STORAGE, NftCart, fakeNFTs } from '@/utils'
import { CheckCircleIcon, ShoppingCartIcon } from '@heroicons/react/16/solid'
import { useNavigate, useParams } from 'react-router-dom'
import useLocalStorage from 'use-local-storage'
import { Address } from 'viem'
import { useReadContracts } from 'wagmi'

export const CollectionNFTs = () => {
  const { id: address = '' } = useParams()
  const navigate = useNavigate()
  const [value, setValue] = useLocalStorage<NftCart>(LOCAL_STORAGE.SHOP_NFT, {})

  const config = { abi: ERC721_ABI, address: address as Address } as const

  const { data, isLoading } = useReadContracts({
    contracts: [
      { ...config, functionName: 'name' },
      { ...config, functionName: 'symbol' },
      { ...config, functionName: 'baseTokenURI' }
    ]
  })

  function handleToggleCart(data: ItemNft) {
    const { cip } = data
    const key = `${address}-${cip}`

    if (value[key]) {
      delete value[key]
      setValue(value)
    } else {
      console.log('add', key)
      setValue({
        ...value,
        [key]: data
      })
    }
  }

  return (
    <section>
      <h4 className="mb-5 text-2xl">
        {isLoading ? (
          <DotLoader />
        ) : (
          <p>
            {String(data?.at(1)?.result)} - {String(data?.at(0)?.result)}
          </p>
        )}
      </h4>

      <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-6 lg:gap-5">
        {fakeNFTs.map((item, index) => {
          const key = `${address}-${item.cip}`
          const styleBtn =
            index % 2 === 0
              ? '-right-full group-hover:right-1/2 group-hover:translate-x-1/2'
              : '-left-full group-hover:left-1/2 group-hover:-translate-x-1/2'

          return (
            <li
              key={index}
              className="group relative cursor-pointer overflow-hidden rounded-lg"
            >
              <video
                className="animate group-hover:scale-110"
                src={`${GATEWAY_URL}${item.url}`}
                width="100%"
              />
              <h3 className="animate absolute bottom-5 left-5 z-10 delay-100 group-hover:bottom-16">
                <strong className="mb-2">{item.name}</strong>
                <p>
                  Price: {item.price}{' '}
                  <NativeToken className="inline-block size-5" />
                </p>
              </h3>

              <Button
                variant={value[key] ? 'outline' : 'filled'}
                onClick={() => handleToggleCart({ address, ...item })}
                icon={value[key] ? CheckCircleIcon : ShoppingCartIcon}
                className={`${styleBtn} animate absolute bottom-3 z-10 w-4/5 delay-100`}
              />

              <article
                onClick={() => navigate(`/nfts/${address}/${item.cip}`)}
                className="absolute inset-0 w-full bg-gradient-to-t from-[rgba(0,0,0,0.7)] to-[rgba(255,255,255,0.01)] group-hover:-bottom-5"
              />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
