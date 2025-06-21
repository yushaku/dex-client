import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useNFTCollections } from '@/hooks/NFTs'
import { CollectionCard } from './components/CollectionCard'
import { CollectionNFTsModal } from './components/CollectionNFTsModal'
import { EmptyState } from './components/EmptyState'
import { Button } from '@/components/ui/button'
import { LoadingPage } from '@/components/ui/LoadingPage'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { NFTContract } from '@/apis/alchemy'

export const UserCollection = () => {
  const { address: userAddress } = useAccount()
  const {
    collections,
    loading,
    error,
    totalCount,
    hasMore,
    loadMore,
    refetch,
    isRefetching,
    isFetchingNextPage,
  } = useNFTCollections(userAddress)

  const [selectedCollection, setSelectedCollection] =
    useState<NFTContract | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCollectionClick = (collection: NFTContract) => {
    setSelectedCollection(collection)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCollection(null)
  }

  if (!userAddress) {
    return (
      <section className="min-h-[85%]">
        <EmptyState type="no-wallet" />
      </section>
    )
  }

  if (loading && collections.length === 0) {
    return <LoadingPage />
  }

  return (
    <>
      <section className="min-h-[85%] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                My NFT Collections
              </h1>
              <p className="text-text-secondary mt-1">
                {totalCount > 0
                  ? `${totalCount} collections found`
                  : 'No collections found'}
              </p>
            </div>
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

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Collections Grid */}
          {collections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection, index) => (
                <CollectionCard
                  key={`${collection.network}-${collection.address}-${index}`}
                  collection={collection}
                  onClick={() => handleCollectionClick(collection)}
                />
              ))}
            </div>
          ) : !loading ? (
            <EmptyState type="no-collections" />
          ) : null}

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-8">
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
                  'Load More Collections'
                )}
              </Button>
            </div>
          )}

          {/* Loading indicator for pagination */}
          {isFetchingNextPage && collections.length > 0 && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-600">
                  Loading more collections...
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Collection NFTs Modal */}
      <CollectionNFTsModal
        collection={selectedCollection}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}
