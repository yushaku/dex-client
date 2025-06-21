import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import {
  getNFTContractsByAddress,
  GetNFTContractsParams,
  NFTContractsResponse,
} from '@/apis/alchemy'

export const useNFTCollections = (userAddress?: string) => {
  const queryClient = useQueryClient()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useInfiniteQuery<NFTContractsResponse>({
    queryKey: ['nft-collections', userAddress],
    queryFn: async ({ pageParam }) => {
      if (!userAddress) throw new Error('No user address provided')

      const baseParams: GetNFTContractsParams = {
        addresses: [
          {
            address: userAddress,
            networks: ['eth-mainnet'],
          },
        ],
        withMetadata: true,
        pageSize: 20,
      }

      const params = pageParam
        ? { ...baseParams, pageKey: pageParam as string }
        : baseParams

      const response = await getNFTContractsByAddress(params)
      return response
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.data.pageKey,
    enabled: !!userAddress,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // Flatten all pages into a single array of collections
  const collections = data?.pages.flatMap((page) => page.data.contracts) ?? []

  // Calculate total count from all pages
  const totalCount = data?.pages[0]?.data.totalCount ?? 0

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: ['nft-collections', userAddress],
    })
  }

  return {
    collections,
    loading: isLoading,
    error: isError
      ? (error as Error)?.message || 'Failed to fetch NFT collections'
      : null,
    totalCount,
    hasMore: !!hasNextPage,
    loadMore,
    refetch: refresh,
    isRefetching,
    isFetchingNextPage,
  }
}
