import { useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'

export const UserNfts = () => {
  const { address } = useAccount()
  const { id: nftAddress } = useParams()

  return (
    <div>
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-6 lg:gap-5">
        User nft
      </ul>
    </div>
  )
}
