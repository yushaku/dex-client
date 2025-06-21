import { NFT } from '@/apis/alchemy'
import { Card } from '@/components/common'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Image as ImageIcon } from 'lucide-react'

interface NFTCardProps {
  nft: NFT
  onClick?: () => void
}

export const NFTCard = ({ nft, onClick }: NFTCardProps) => {
  const { contract, metadata, media } = nft
  const imageUrl = media?.[0]?.gateway || metadata?.image || media?.[0]?.raw

  return (
    <Card
      className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="space-y-4">
        {/* NFT Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={metadata?.name || `NFT #${contract.tokenId}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.nextElementSibling?.classList.remove('hidden')
              }}
            />
          ) : null}
          <div className="hidden w-full h-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        {/* NFT Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {metadata?.name || `#${contract.tokenId}`}
            </h3>
            <Badge variant="secondary">{contract.tokenType}</Badge>
          </div>

          {metadata?.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {metadata.description}
            </p>
          )}

          {/* Token ID */}
          <p className="text-xs text-gray-500">Token ID: {contract.tokenId}</p>

          {/* Attributes */}
          {metadata?.attributes && metadata.attributes.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-700">Attributes:</p>
              <div className="flex flex-wrap gap-1">
                {metadata.attributes.slice(0, 3).map((attr, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {attr.trait_type}: {attr.value}
                  </Badge>
                ))}
                {metadata.attributes.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{metadata.attributes.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* External Link */}
          {metadata?.external_url && (
            <a
              href={metadata.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
              <span>View on OpenSea</span>
            </a>
          )}
        </div>
      </div>
    </Card>
  )
}
