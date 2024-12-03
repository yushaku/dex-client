import { Skeleton } from '@/components/common/Loading'
import { NftItem } from '@/components/common/nfts/NftItem'
import { NFT_ADRESS, routes } from '@/utils'
import { useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import { Link, useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'

export const UserNfts = () => {
  const { address } = useAccount()
  const { id: nftAddress } = useParams()
  const { contract: nftCollection } = useContract(nftAddress)

  const { data: ownedNfts, isLoading: loadingOwnedNfts } = useOwnedNFTs(
    nftCollection,
    address
  )

  return (
    <div>
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-6 lg:gap-5">
        {loadingOwnedNfts &&
          [...Array(15)].map((_, index) => <Skeleton key={index} />)}

        {!ownedNfts && !loadingOwnedNfts && (
          <p>You don't own any NFTs yet from this collection.</p>
        )}

        {ownedNfts &&
          ownedNfts.length > 0 &&
          ownedNfts.map((nft) => {
            // if (index > 4) return <span />

            return (
              <Link
                key={nft.metadata.id}
                to={`${routes.myNFTs}/${NFT_ADRESS}/${nft.metadata.id}`}
              >
                <NftItem nft={nft} />
              </Link>
            )
          })}
      </ul>
    </div>
  )
}
