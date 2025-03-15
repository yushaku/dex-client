import { UniPoolV3 } from '@/abi/uniPoolV3'
import { Asset } from '@/utils'
import { Currency, Rounding, Token } from '@uniswap/sdk-core'
import {
  FeeAmount,
  Position,
  TICK_SPACINGS,
  Pool as V3Pool,
  nearestUsableTick,
  tickToPrice as tickToPriceV3,
} from '@uniswap/v3-sdk'
// import { Pool as V4Pool, tickToPrice as tickToPriceV4 } from '@uniswap/v4-sdk'
import { useCallback, useMemo } from 'react'
import { Address, isAddress, zeroAddress } from 'viem'
import { useAccount, useReadContracts } from 'wagmi'

// const tickSpaceLimits = [
//   nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[FeeAmount.MEDIUM]),
//   nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[FeeAmount.MEDIUM]),
// ]

export function getPoolAddress({
  chainId,
  asset0,
  asset1,
  fee = FeeAmount.MEDIUM,
}: {
  chainId: number
  asset0?: Asset | null
  asset1?: Asset | null
  fee?: number
}) {
  if (!asset0 || !asset1 || asset0.address === asset1.address)
    return {
      poolAddress: null,
      tokenA: null,
      tokenB: null,
    }

  const tokenA = new Token(
    chainId,
    asset0.address,
    asset0.decimals,
    asset0.symbol,
    asset0.name,
  )
  const tokenB = new Token(
    chainId,
    asset1.address,
    asset1.decimals,
    asset1.symbol,
    asset1.name,
  )

  const poolAddress = V3Pool.getAddress(tokenA, tokenB, fee)

  return {
    poolAddress,
    tokenA,
    tokenB,
  }
}

export function useGetPool({
  asset0,
  asset1,
  fee = 3000, // 0,3% fee
}: {
  asset0?: Asset | null
  asset1?: Asset | null
  fee?: number
}) {
  const { chainId = 1 } = useAccount()
  const { poolAddress, tokenA, tokenB } = getPoolAddress({
    asset0,
    asset1,
    fee,
    chainId,
  })

  const { data } = useReadContracts({
    contracts: [
      {
        abi: UniPoolV3,
        functionName: 'liquidity',
        address: poolAddress as Address,
      },
      {
        abi: UniPoolV3,
        functionName: 'slot0',
        address: poolAddress as Address,
      },
    ],
    query: {
      enabled: isAddress(poolAddress ?? zeroAddress),
    },
  })

  const liquidity = data?.[0]?.result
  const slot0 = data?.[1]?.result

  let pool = null
  if (tokenA && tokenB && slot0 && liquidity) {
    pool = new V3Pool(
      tokenA,
      tokenB,
      fee,
      slot0[0].toString(),
      liquidity.toString(),
      Number(slot0[1]),
    )
  }

  return {
    pool: pool,
    poolAddress,
    tokenA,
    tokenB,
  }
}

export function useGetPosition({
  pool,
  amount0,
  amount1,
}: {
  pool: V3Pool | null
  amount0: string
  amount1: string
}) {
  if (!pool) return null
  // prettier-ignore
  const position = Position.fromAmounts({
    pool,
    tickLower: nearestUsableTick(pool.tickCurrent, pool.tickSpacing) - pool.tickSpacing * 2,
    tickUpper: nearestUsableTick(pool.tickCurrent, pool.tickSpacing) + pool.tickSpacing * 2,
    amount0: amount0,
    amount1: amount1,
    useFullPrecision: true,
  })

  return position
}

type BaseUseRangeHopCallbacksProps = {
  baseCurrency?: Currency | null
  quoteCurrency?: Currency | null
  tickLower?: number
  tickUpper?: number
}

type V3UseRangeHopCallbacksProps = BaseUseRangeHopCallbacksProps & {
  feeAmount?: FeeAmount
  pool?: V3Pool | null
}

// type V4UseRangeHopCallbacksProps = BaseUseRangeHopCallbacksProps & {
//   fee?: FeeData
//   pool?: V4Pool
// }
export function useRangeHopCallbacks(props: V3UseRangeHopCallbacksProps) {
  const { baseCurrency, quoteCurrency, tickLower, tickUpper, pool } = props
  let tickSpacing: number | undefined
  let feeAmount: FeeAmount | number | undefined

  if ('feeAmount' in props) {
    feeAmount = props.feeAmount
    tickSpacing = props.feeAmount ? TICK_SPACINGS[props.feeAmount] : undefined
  }
  // else if ('fee' in props) {
  //   feeAmount = props.fee?.feeAmount
  //   tickSpacing = props.fee?.tickSpacing
  // }

  const baseToken = useMemo(() => baseCurrency?.wrapped, [baseCurrency])
  const quoteToken = useMemo(() => quoteCurrency?.wrapped, [quoteCurrency])

  const tickToPrice = useCallback(
    (tick: number) => {
      if ('feeAmount' in props) {
        if (!baseToken || !quoteToken) {
          return ''
        }

        const newPrice = tickToPriceV3(baseToken, quoteToken, tick)
        return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP)
      }

      if (!baseCurrency || !quoteCurrency) {
        return ''
      }

      // const newPrice = tickToPriceV4(baseCurrency, quoteCurrency, tick)
      // return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP)
      return ''
    },
    [baseCurrency, baseToken, props, quoteCurrency, quoteToken],
  )

  const getDecrementLower = useCallback(() => {
    if (typeof tickLower === 'number' && feeAmount && tickSpacing) {
      return tickToPrice(tickLower - tickSpacing)
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (!(typeof tickLower === 'number') && feeAmount && pool && tickSpacing) {
      return tickToPrice(pool.tickCurrent - tickSpacing)
    }
    return ''
  }, [tickLower, feeAmount, tickSpacing, pool, tickToPrice])

  const getIncrementLower = useCallback(() => {
    if (typeof tickLower === 'number' && feeAmount && tickSpacing) {
      return tickToPrice(tickLower + tickSpacing)
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (!(typeof tickLower === 'number') && feeAmount && pool && tickSpacing) {
      return tickToPrice(pool.tickCurrent + tickSpacing)
    }
    return ''
  }, [tickLower, feeAmount, tickSpacing, pool, tickToPrice])

  const getDecrementUpper = useCallback(() => {
    if (typeof tickUpper === 'number' && feeAmount && tickSpacing) {
      return tickToPrice(tickUpper - tickSpacing)
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (!(typeof tickUpper === 'number') && feeAmount && pool && tickSpacing) {
      return tickToPrice(pool.tickCurrent - tickSpacing)
    }
    return ''
  }, [tickUpper, feeAmount, tickSpacing, pool, tickToPrice])

  const getIncrementUpper = useCallback(() => {
    if (typeof tickUpper === 'number' && feeAmount && tickSpacing) {
      return tickToPrice(tickUpper + tickSpacing)
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (!(typeof tickUpper === 'number') && feeAmount && pool && tickSpacing) {
      return tickToPrice(pool.tickCurrent + tickSpacing)
    }
    return ''
  }, [tickUpper, feeAmount, tickSpacing, pool, tickToPrice])

  return {
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
  }
}
