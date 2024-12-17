import { env } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const BASE_URL = 'https://deep-index.moralis.io/api/v2.2'

const getChainName = (chainId = 1) => {
  switch (chainId) {
    case 1:
      return 'eth'
    case 56:
    default:
      return 'bsc'
  }
}

type TokenMetadata = {
  name: string
  symbol: string
  decimals: number
  logo: string
}

type UseTokenMetadataParams = {
  token: string
  enabled?: boolean
  chainId: 1 | 56
}

export const useTokenMetadata = ({
  token,
  enabled = true,
  chainId = 56,
}: UseTokenMetadataParams) => {
  return useQuery<TokenMetadata[]>({
    queryKey: ['tokenMetadata', token, chainId],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/erc20/metadata`, {
        headers: {
          accept: 'application/json',
          'X-API-Key': env.VITE_MORALIS_API_KEY,
        },
        params: {
          chain: getChainName(chainId),
          addresses: [token],
        },
      })

      return response.data // Moralis returns an array of metadata
    },
    enabled: !!token && enabled,
  })
}

interface TokenPriceData {
  usdPrice: number
  nativePrice: {
    value: string
    decimals: number
    name: string
    symbol: string
  }
  percentChange24h: number
}

export const useTokenPrice = ({
  token,
  enabled = true,
  chainId = 56,
}: UseTokenMetadataParams) => {
  return useQuery<TokenPriceData>({
    queryKey: ['tokenPrice', token, chainId],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/erc20/${token}/price`, {
        headers: {
          accept: 'application/json',
          'X-API-Key': env.VITE_MORALIS_API_KEY,
        },
        params: {
          chain: getChainName(chainId),
          include: 'percent_change',
        },
      })

      return response.data
    },
    enabled: !!token && enabled,
  })
}
