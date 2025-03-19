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
  chainId: number
}

export const useTokenMetadata = ({
  token,
  enabled = true,
  chainId = 1,
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
  chainId = 1,
}: UseTokenMetadataParams) => {
  return useQuery<TokenPriceData>({
    queryKey: ['tokenPrice', token, chainId],
    queryFn: async () => {
      const response = await axios.get(
        `https://api.odos.xyz/pricing/token/${chainId}`,
        {
          headers: {
            accept: 'application/json',
          },
          params: {
            token_addresses: token,
          },
        },
      )

      return response.data?.tokenPrices?.[token] ?? 0
    },
    enabled: !!token && enabled,
  })
}

export const useFetchTokenList = (chainId: number = 56) => {
  return useQuery({
    queryKey: ['assets', chainId],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.odos.xyz/info/tokens/${chainId}`,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      )

      const data = res.data.tokenMap as Record<
        string,
        { name: string; symbol: string; decimals: number }
      >

      return Object.entries(data).map(
        ([address, { name, symbol, decimals }]) => ({
          address,
          name,
          symbol,
          decimals,
          logoURI: `https://assets.odos.xyz/tokens/${symbol}.webp`,
        }),
      )
    },
    staleTime: Infinity,
  })
}
