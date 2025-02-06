import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { arbitrum, bsc, mainnet } from 'viem/chains'
import { CollectionNft, NftDetail } from './type'

const BASE_URL = 'https://stats-mainnet.magiceden.io'

export const getNameFromId = (chainId: number) => {
  switch (chainId) {
    case mainnet.id:
      return 'ethereum'
    case arbitrum.id:
      return 'arbitrum'
    case bsc.id:
    default:
      return 'bsc'
  }
}
export const useGetNftCollections = ({ enabled = true, chainId = 1 }) => {
  return useQuery<CollectionNft[]>({
    queryKey: ['collection_stats', chainId],
    queryFn: async () => {
      const response = await axios.get(
        `${BASE_URL}/collection_stats/search/${getNameFromId(chainId)}`,
        {
          params: {
            offset: 0,
            limit: 10,
            window: '1d',
            sort: 'volume',
            direction: 'desc',
            filter:
              '{ "qc" : { "isVerified" : true, "minOwnerCount" : 30, "minTxns" : 5 } }',
          },
        },
      )

      return response.data
    },
    enabled: enabled,
  })
}

export const useGetNfts = ({
  collection = '',
  enabled = true,
  chainId = 1,
}) => {
  return useQuery<NftDetail[]>({
    queryKey: ['rtp/tokens/v7', collection, chainId],
    queryFn: async () => {
      const response = await axios.get(
        `https://api-mainnet.magiceden.io/v3/rtp/${getNameFromId(chainId)}/tokens/v7`,
        {
          params: {
            collection,
            sortBy: 'floorAskPrice',
            sortDirection: 'asc',
            limit: 20,
          },
        },
      )

      return response.data?.tokens ?? []
    },
    enabled,
    staleTime: Infinity,
  })
}
