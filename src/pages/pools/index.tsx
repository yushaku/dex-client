/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from '@/components/warper'
import { useUniswapPositions } from '@/hooks/uni/usePositionV3'
import { ManualPosition } from './components/ManualPosition'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { uniswapClient, formatNumber } from '@/utils'
import { useGetAsset } from '@/hooks/useAssets'
import { getAddress } from 'viem'
import { IconGroup } from './components/IconGroup'

export const Pools = () => {
  const positions = useUniswapPositions()
  const { chainId = 1 } = useAccount()

  const uni = uniswapClient(3, chainId)
  const { data } = useQuery({
    queryKey: ['uniswapPools', 3, chainId],
    queryFn: async () => {
      const query = `{
        pools(first: 12, orderBy: volumeUSD, orderDirection: desc) {
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
      }`

      return uni.request(query) as Promise<any>
    },
    refetchInterval: 1000 * 60 * 60,
    staleTime: Infinity,
    refetchIntervalInBackground: true,
  })

  return (
    <article className="space-y-8">
      <div className="flex-1">
        <h4 className="mb-5 text-xl">Your Positions</h4>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {positions.map((position) => {
            return (
              <li key={position.tokenId}>
                <ManualPosition position={position} />
              </li>
            )
          })}
        </ul>
      </div>

      <div className="flex-1">
        <h4 className="text-xl">Top Pools</h4>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {data?.pools.map((pool: any) => {
            return <PoolItem pool={pool} key={pool.id} />
          })}
        </ul>
      </div>
    </article>
  )
}

function PoolItem({ pool }: { pool: any }) {
  const token0 = useGetAsset(getAddress(pool.token0.id))
  const token1 = useGetAsset(getAddress(pool.token1.id))

  return (
    <li>
      <Card className="p-4">
        <div className="space-y-2">
          <p className="flex items-center gap-2">
            <IconGroup logo1={token0?.logoURI} logo2={token1?.logoURI} />
            {pool.token0?.symbol}/{pool.token1?.symbol}
          </p>
          <p>fees: ${formatNumber(pool.feesUSD)}</p>
          <p>volume: ${formatNumber(pool.volumeUSD)}</p>
          <p>TVL: ${formatNumber(pool.totalValueLockedUSD)}</p>
        </div>
      </Card>
    </li>
  )
}
