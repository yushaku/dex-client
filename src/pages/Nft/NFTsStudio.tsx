import { CreateCollectionTab } from '@/components/common/nfts/CreateCollectionTab'
import { CreateNftTab } from '@/components/common/nfts/CreateNftTab'
import { useLocation, useNavigate } from 'react-router-dom'

const listFeature = ['create_nft', 'create_collection']

export const NFTsStudio = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)

  const type = queryParams.get('type') ?? 'create_nft'
  const collection = queryParams.get('collection') ?? ''

  return (
    <section className="min-h-[80dvh]">
      <div className="flex w-fit rounded-lg border-4 border-layer bg-layer">
        {listFeature.map((feat) => {
          const pickedStyle = type === feat && 'bg-background'
          return (
            <button
              key={feat}
              className={`${pickedStyle} rounded-lg px-8 py-3`}
              onClick={() =>
                navigate(`/nfts/studio?type=${feat}&collection=${collection}`)
              }
            >
              {feat === 'create_nft' && 'Create NFT'}
              {feat === 'create_collection' && 'Create Collection'}
            </button>
          )
        })}
      </div>

      {type === 'create_nft' && <CreateNftTab collectionAddress={collection} />}
      {type === 'create_collection' && <CreateCollectionTab />}
    </section>
  )
}
