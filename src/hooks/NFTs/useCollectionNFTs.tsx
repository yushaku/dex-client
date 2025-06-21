import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { getNFTs, GetNFTsParams, GetNFTsResponse } from '@/apis/alchemy'

export const useCollectionNFTs = (
  userAddress?: string,
  contractAddress?: string,
) => {
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
  } = useInfiniteQuery<GetNFTsResponse>({
    queryKey: ['collection-nfts', userAddress, contractAddress],
    queryFn: async ({ pageParam }) => {
      if (!userAddress || !contractAddress) {
        throw new Error('User address and contract address are required')
      }

      const baseParams: GetNFTsParams = {
        owner: userAddress,
        contractAddresses: [contractAddress],
        withMetadata: true,
        pageSize: 20,
        tokenUriTimeoutInMs: 5000,
      }

      const params = pageParam
        ? { ...baseParams, pageKey: pageParam as string }
        : baseParams

      const response = await getNFTs(params)
      return response
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.pageKey,
    enabled: !!userAddress && !!contractAddress,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // Flatten all pages into a single array of NFTs
  const nfts = data?.pages.flatMap((page) => page.ownedNfts) ?? []

  // Calculate total count from all pages
  const totalCount = data?.pages[0]?.totalCount ?? '0'

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: ['collection-nfts', userAddress, contractAddress],
    })
  }

  return {
    nfts,
    loading: isLoading,
    error: isError ? (error as Error)?.message || 'Failed to fetch NFTs' : null,
    totalCount: parseInt(totalCount, 10),
    hasMore: !!hasNextPage,
    loadMore,
    refetch: refresh,
    isRefetching,
    isFetchingNextPage,
  }
}
