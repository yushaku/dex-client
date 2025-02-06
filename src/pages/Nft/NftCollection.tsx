import { NativeToken } from '@/components/common/NativeTokenBalance'
import { useGetNfts } from '@/hooks'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { useNavigate, useParams } from 'react-router-dom'
import { isAddress } from 'viem'
import { useAccount } from 'wagmi'

export const CollectionNFTs = () => {
  const { id: address = '' } = useParams()
  const navigate = useNavigate()
  const { chainId = 1 } = useAccount()

  const { data: nftList } = useGetNfts({
    collection: address,
    enabled: isAddress(address),
    chainId,
  })

  return (
    <section>
      <h4
        className="mb-5 flex items-center gap-2 text-2xl"
        onClick={() => navigate(-1)}
      >
        <ArrowLeftIcon className="size-5" />
        <p>{nftList?.at(0)?.token?.collection.name}</p>
      </h4>

      <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-6 lg:gap-5">
        {nftList?.map((item, index) => {
          return (
            <li
              key={index}
              className="group relative cursor-pointer overflow-hidden rounded-lg"
            >
              <img
                className="animate group-hover:scale-110"
                src={item.token.image}
                width="100%"
              />
              <h3 className="animate absolute bottom-2 left-2 z-10 delay-100">
                <strong className="mb-2">{item.token.name}</strong>
                <p>
                  Price: {item.market.floorAsk.price.amount.native}{' '}
                  <NativeToken className="inline-block size-5" />
                </p>
              </h3>

              {/* <Button */}
              {/*   variant={value[key] ? 'outline' : 'filled'} */}
              {/*   // onClick={() => handleToggleCart({ address, ...item. })} */}
              {/*   icon={value[key] ? CheckCircleIcon : ShoppingCartIcon} */}
              {/*   className={`${styleBtn} animate absolute bottom-3 z-10 w-4/5 delay-100`} */}
              {/* /> */}

              <article
                className="absolute inset-0 w-full bg-gradient-to-t from-[rgba(0,0,0,0.7)] to-[rgba(255,255,255,0.01)] group-hover:-bottom-5"
                onClick={() =>
                  navigate(`/nfts/${address}/${item.token.tokenId}`)
                }
              />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
