import { IconGroup } from '@/components/common/IconGroup'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card } from '@/components/common'
import { useGetAsset } from '@/hooks/useAssets'
import { formatNumber } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getAddress } from 'viem'
import { useAccount } from 'wagmi'
import { UniPools, fetchPools } from './api'
import { TablePool } from './components/table'

export const Pools = () => {
  const { chainId = 1 } = useAccount()

  const { data } = useQuery({
    queryKey: ['top_uniswap_pools', chainId],
    queryFn: async () => {
      const fetchedData = await fetchPools({
        version: 3,
        chainId,
        first: 10,
      })
      return fetchedData
    },
    refetchOnWindowFocus: false,
  })

  return (
    <article className="space-y-8">
      <h3 className="my-5 text-xl">Top Pools</h3>
      <div className="px-5">
        <Carousel>
          <CarouselContent>
            {data?.pools?.map((pool) => <PoolItem pool={pool} key={pool.id} />)}
          </CarouselContent>

          <CarouselPrevious className="" />
          <CarouselNext />
        </Carousel>
      </div>

      <h3 className="my-5 text-xl">Pools List</h3>

      <TablePool />
    </article>
  )
}

function PoolItem({ pool }: { pool: UniPools }) {
  const navigate = useNavigate()
  const token0 = useGetAsset(getAddress(pool.token0.id))
  const token1 = useGetAsset(getAddress(pool.token1.id))

  return (
    <CarouselItem className="cursor-pointer md:basis-1/2 lg:basis-1/5">
      <Card
        onClick={() =>
          navigate(
            `/pools/add-liquidity?token0=${pool.token0.id}&token1=${pool.token1.id}`,
          )
        }
        className="group p-4"
      >
        <div className="space-y-2 text-textSecondary">
          <p className="flex items-center gap-2 pb-2">
            <IconGroup logo1={token0?.logoURI} logo2={token1?.logoURI} />
            <span className="text-primary group-hover:text-accent">
              {pool.token0?.symbol}/{pool.token1?.symbol}
            </span>
          </p>
          <p>fees: ${formatNumber(pool.feesUSD)}</p>
          <p>volume: ${formatNumber(pool.volumeUSD)}</p>
          <p>TVL: ${formatNumber(pool.totalValueLockedUSD)}</p>
        </div>
      </Card>
    </CarouselItem>
  )
}
