import { Wallet, Package } from 'lucide-react'

interface EmptyStateProps {
  type: 'no-wallet' | 'no-collections'
}

export const EmptyState = ({ type }: EmptyStateProps) => {
  if (type === 'no-wallet') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Wallet className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-gray-600 max-w-md">
          Please connect your wallet to view your NFT collections across
          multiple networks.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-24 h-24 bg-foreground rounded-full flex items-center justify-center mb-6">
        <Package className="w-12 h-12 text-gray-300" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No Collections Found
      </h3>
      <p className="text-gray-400 max-w-md">
        You don't have any NFT collections in your wallet yet. Start collecting
        NFTs to see them here!
      </p>
    </div>
  )
}
