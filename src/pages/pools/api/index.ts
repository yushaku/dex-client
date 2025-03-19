import { uniswapClient } from '@/utils'
import { SortingState } from '@tanstack/react-table'
import { Address } from 'viem'

type Token = {
  symbol: string
  id: Address
}

export type UniPools = {
  id: Address
  feesUSD: string
  feeTier: string
  volumeUSD: string
  volumeToken1: string
  volumeToken0: string
  totalValueLockedUSD: string
  token0: Token
  token1: Token
}

export async function fetchPools({
  version,
  chainId,
  first = 12,
  skip = 0,
}: {
  version: 2 | 3 | 4
  chainId: number
  first?: number
  skip?: number
  sorting?: SortingState
}) {
  const uni = uniswapClient(version, chainId)
  return uni.request(
    `query($first: Int!, $skip: Int!) {
      pools(first: $first, skip: $skip, orderBy: volumeUSD, orderDirection: desc) {
        id
        feesUSD
        feeTier
        volumeUSD
        volumeToken1
        volumeToken0
        totalValueLockedUSD
        token0 {
          symbol
          id
        }
        token1 {
          id
          symbol
        }
      }
    }
  `,
    {
      first,
      skip,
    },
  ) as Promise<{ pools: UniPools[] }>
}
