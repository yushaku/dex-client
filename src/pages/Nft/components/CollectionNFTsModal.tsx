import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useCollectionNFTs } from '@/hooks/NFTs'
import { NFTCard } from './NFTCard'
import { NFTContract } from '@/apis/alchemy'
import { Button } from '@/components/ui/button'
import { LoadingPage } from '@/components/ui/LoadingPage'
import { RefreshCw, AlertCircle, X } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EmptyState } from './EmptyState'

interface CollectionNFTsModalProps {
  collection: NFTContract | null
  isOpen: boolean
  onClose: () => void
}

export const CollectionNFTsModal = ({
  collection,
  isOpen,
  onClose,
}: CollectionNFTsModalProps) => {
  const { address: userAddress } = useAccount()
  const {
    nfts,
    loading,
    error,
    totalCount,
    hasMore,
    loadMore,
    refetch,
    isRefetching,
    isFetchingNextPage,
  } = useCollectionNFTs(userAddress, collection?.contract.address)

  const [selectedNFT, setSelectedNFT] = useState<string | null>(null)

  if (!collection) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              {collection.contract.name || 'Collection'}
            </DialogTitle>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {totalCount} NFTs in this collection
            </p>
            <Button
              onClick={refetch}
              disabled={isRefetching}
              variant="outline"
              size="sm"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading && nfts.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <LoadingPage />
            </div>
          )}

          {/* NFTs Grid */}
          {nfts.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto">
                {nfts.map((nft, index) => (
                  <NFTCard
                    key={`${nft.contract.address}-${nft.contract.tokenId}-${index}`}
                    nft={nft}
                    onClick={() => setSelectedNFT(nft.contract.tokenId)}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={loadMore}
                    disabled={isFetchingNextPage}
                    variant="outline"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More NFTs'
                    )}
                  </Button>
                </div>
              )}

              {/* Loading indicator for pagination */}
              {isFetchingNextPage && nfts.length > 0 && (
                <div className="flex justify-center pt-4">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-600">
                      Loading more NFTs...
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : !loading ? (
            <div className="flex items-center justify-center h-64">
              <EmptyState type="no-collections" />
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
