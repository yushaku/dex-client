import { NFTContract } from '@/apis/alchemy'
import { Card } from '@/components/common'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Image as ImageIcon } from 'lucide-react'

interface CollectionCardProps {
  collection: NFTContract
  onClick?: () => void
}

export const CollectionCard = ({
  collection,
  onClick,
}: CollectionCardProps) => {
  const { contract } = collection
  const metadata = contract.openSeaMetadata

  return (
    <Card
      className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <div className="w-full h-full flex items-center justify-center">
            {metadata?.imageUrl ? (
              <img
                src={metadata.imageUrl}
                alt={contract.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : (
              <NFTDefaultImage />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold truncate">
              {contract.name || 'Unnamed Collection'}
            </h3>
            <Badge variant={'accent'}>{contract.tokenType}</Badge>
            {contract.isSpam && <Badge variant={'destructive'}>Spam</Badge>}
          </div>

          {metadata?.floorPrice ? (
            <p className="text-sm mb-1">Floor: {metadata.floorPrice} ETH</p>
          ) : (
            <p className="text-sm mb-1">Floor: N/A</p>
          )}

          {metadata?.description && (
            <p className="text-sm line-clamp-2 mb-2">{metadata.description}</p>
          )}

          <div className="flex items-center space-x-4 text-xs">
            <span>Network: {collection.network}</span>
            {contract.totalSupply && (
              <span>Supply: {contract.totalSupply}</span>
            )}
          </div>

          {metadata?.externalUrl && (
            <a
              href={metadata.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 mt-2"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
              <span>View Collection</span>
            </a>
          )}
        </div>
      </div>
    </Card>
  )
}

const NFTDefaultImage = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M11 2.57735C11.6188 2.22008 12.3812 2.22008 13 2.57735L19.6603 6.42265C20.2791 6.77992 20.6603 7.44017 20.6603 8.1547V15.8453C20.6603 16.5598 20.2791 17.2201 19.6603 17.5774L13 21.4226C12.3812 21.7799 11.6188 21.7799 11 21.4226L4.33975 17.5774C3.72094 17.2201 3.33975 16.5598 3.33975 15.8453V8.1547C3.33975 7.44017 3.72094 6.77992 4.33975 6.42265L11 2.57735Z"
        fill="url(#paint0_linear_1582_23824)"
      />
      <path
        d="M15.6424 14.5C15.6024 14.5 15.5684 14.486 15.5404 14.458C15.5124 14.43 15.4984 14.396 15.4984 14.356V11.038H14.3884C14.3484 11.038 14.3144 11.024 14.2864 10.996C14.2584 10.968 14.2444 10.934 14.2444 10.894V10.45C14.2444 10.406 14.2584 10.37 14.2864 10.342C14.3144 10.314 14.3484 10.3 14.3884 10.3H17.4484C17.4924 10.3 17.5284 10.314 17.5564 10.342C17.5844 10.37 17.5984 10.406 17.5984 10.45V10.894C17.5984 10.934 17.5844 10.968 17.5564 10.996C17.5284 11.024 17.4924 11.038 17.4484 11.038H16.3444V14.356C16.3444 14.396 16.3304 14.43 16.3024 14.458C16.2744 14.486 16.2384 14.5 16.1944 14.5H15.6424Z"
        fill="#D96900"
      />
      <path
        d="M11.1149 14.5C11.0749 14.5 11.0409 14.486 11.0129 14.458C10.9849 14.43 10.9709 14.396 10.9709 14.356V10.45C10.9709 10.406 10.9849 10.37 11.0129 10.342C11.0409 10.314 11.0749 10.3 11.1149 10.3H13.7189C13.7629 10.3 13.7989 10.314 13.8269 10.342C13.8549 10.37 13.8689 10.406 13.8689 10.45V10.87C13.8689 10.914 13.8549 10.95 13.8269 10.978C13.7989 11.002 13.7629 11.014 13.7189 11.014H11.7929V12.154H13.5989C13.6429 12.154 13.6789 12.168 13.7069 12.196C13.7349 12.224 13.7489 12.26 13.7489 12.304V12.724C13.7489 12.764 13.7349 12.798 13.7069 12.826C13.6789 12.854 13.6429 12.868 13.5989 12.868H11.7929V14.356C11.7929 14.396 11.7789 14.43 11.7509 14.458C11.7229 14.486 11.6869 14.5 11.6429 14.5H11.1149Z"
        fill="#D96900"
      />
      <path
        d="M6.87274 14.5C6.83274 14.5 6.79874 14.486 6.77074 14.458C6.74274 14.43 6.72874 14.396 6.72874 14.356V10.45C6.72874 10.406 6.74274 10.37 6.77074 10.342C6.79874 10.314 6.83274 10.3 6.87274 10.3H7.33474C7.39074 10.3 7.43074 10.314 7.45474 10.342C7.48274 10.366 7.50074 10.384 7.50874 10.396L9.23674 13.084V10.45C9.23674 10.406 9.24874 10.37 9.27274 10.342C9.30074 10.314 9.33674 10.3 9.38074 10.3H9.88474C9.92874 10.3 9.96474 10.314 9.99274 10.342C10.0207 10.37 10.0347 10.406 10.0347 10.45V14.35C10.0347 14.394 10.0207 14.43 9.99274 14.458C9.96474 14.486 9.93074 14.5 9.89074 14.5H9.42274C9.36674 14.5 9.32674 14.486 9.30274 14.458C9.27874 14.43 9.26074 14.412 9.24874 14.404L7.52674 11.776V14.356C7.52674 14.396 7.51274 14.43 7.48474 14.458C7.45674 14.486 7.42074 14.5 7.37674 14.5H6.87274Z"
        fill="#D96900"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1582_23824"
          x1="12"
          y1="2"
          x2="12"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F8F4E6" />
          <stop offset="1" stopColor="#D3BBA5" />
        </linearGradient>
      </defs>
    </svg>
  )
}
