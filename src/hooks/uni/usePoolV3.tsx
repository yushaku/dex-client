import { UniPoolV3 } from '@/abi/uniPoolV3'
import { Asset } from '@/utils'
import { Rounding, Token } from '@uniswap/sdk-core'
import {
  FeeAmount,
  Pool,
  Position,
  TICK_SPACINGS,
  TickMath,
  nearestUsableTick,
  tickToPrice,
} from '@uniswap/v3-sdk'
import { useCallback } from 'react'
import { Address, isAddress, zeroAddress } from 'viem'
import { useAccount, useReadContracts } from 'wagmi'

// const tickSpaceLimits = [
//   nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[FeeAmount.MEDIUM]),
//   nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[FeeAmount.MEDIUM]),
// ]

export const getPoolAddress = ({
  chainId,
  asset0,
  asset1,
  fee = FeeAmount.MEDIUM,
}: {
  chainId: number
  asset0?: Asset | null
  asset1?: Asset | null
  fee?: number
}) => {
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

  const poolAddress = Pool.getAddress(tokenA, tokenB, fee)

  return {
    poolAddress,
    tokenA,
    tokenB,
  }
}

export const useGetPool = ({
  asset0,
  asset1,
  fee = 3000, // 0,3% fee
}: {
  asset0?: Asset | null
  asset1?: Asset | null
  fee?: number
}) => {
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
    pool = new Pool(
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
  pool: Pool | null
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

export function useRangeHopCallbacks({
  baseToken: _baseToken,
  quoteToken: _quoteToken,
  feeAmount,
  tickLower,
  tickUpper,
  pool,
}: {
  baseToken: Token | null
  quoteToken: Token | null
  feeAmount: FeeAmount
  tickLower?: number
  tickUpper?: number
  pool: Pool | null
}) {
  const TICK_SPACING = TICK_SPACINGS[feeAmount]
  const baseToken = _baseToken?.wrapped
  const quoteToken = _quoteToken?.wrapped

  const getDecrementLower = useCallback(
    (rate = 1) => {
      if (
        typeof tickLower === 'number' &&
        baseToken &&
        quoteToken &&
        feeAmount
      ) {
        const newPrice = tickToPrice(
          baseToken,
          quoteToken,
          tickLower - TICK_SPACING * rate,
        )
        return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP)
      }
      // use pool current tick as starting tick if we have pool but no tick input

      if (
        !(typeof tickLower === 'number') &&
        baseToken &&
        quoteToken &&
        feeAmount &&
        pool
      ) {
        const newPrice = tickToPrice(
          baseToken,
          quoteToken,
          pool.tickCurrent - TICK_SPACING * rate,
        )
        return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP)
      }
      return ''
    },
    [baseToken, quoteToken, tickLower, feeAmount, pool, TICK_SPACING],
  )

  const getIncrementLower = useCallback(
    (rate = 1) => {
      if (
        baseToken &&
        quoteToken &&
        typeof tickLower === 'number' &&
        feeAmount
      ) {
        const newPrice = tickToPrice(
          baseToken,
          quoteToken,
          tickLower + TICK_SPACING * rate,
        )
        return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP)
      }
      // use pool current tick as starting tick if we have pool but no tick input
      if (
        !(typeof tickLower === 'number') &&
        baseToken &&
        quoteToken &&
        feeAmount &&
        pool
      ) {
        const newPrice = tickToPrice(
          baseToken,
          quoteToken,
          pool.tickCurrent + TICK_SPACING * rate,
        )
        return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP)
      }
      return ''
    },
    [baseToken, quoteToken, tickLower, feeAmount, pool, TICK_SPACING],
  )

  const getDecrementUpper = useCallback(
    (rate = 1) => {
      if (
        baseToken &&
        quoteToken &&
        typeof tickUpper === 'number' &&
        feeAmount
      ) {
        const newPrice = tickToPrice(
          baseToken,
          quoteToken,
          tickUpper - TICK_SPACING * rate,
        )
        return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP)
      }
      // use pool current tick as starting tick if we have pool but no tick input
      if (
        !(typeof tickUpper === 'number') &&
        baseToken &&
        quoteToken &&
        feeAmount &&
        pool
      ) {
        const newPrice = tickToPrice(
          baseToken,
          quoteToken,
          pool.tickCurrent - TICK_SPACING * rate,
        )
        return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP)
      }
      return ''
    },
    [baseToken, quoteToken, tickUpper, feeAmount, pool, TICK_SPACING],
  )

  const getIncrementUpper = useCallback(
    (rate = 1) => {
      if (
        baseToken &&
        quoteToken &&
        typeof tickUpper === 'number' &&
        feeAmount
      ) {
        const newPrice = tickToPrice(
          baseToken,
          quoteToken,
          tickUpper + TICK_SPACING * rate,
        )
        return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP)
      }
      // use pool current tick as starting tick if we have pool but no tick input
      if (
        !(typeof tickUpper === 'number') &&
        baseToken &&
        quoteToken &&
        feeAmount &&
        pool
      ) {
        const newPrice = tickToPrice(
          baseToken,
          quoteToken,
          pool.tickCurrent + TICK_SPACING * rate,
        )
        return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP)
      }
      return ''
    },
    [baseToken, quoteToken, tickUpper, feeAmount, pool, TICK_SPACING],
  )

  const getSetRange = useCallback(
    (numTicks: number) => {
      if (baseToken && quoteToken && feeAmount && pool) {
        // calculate range around current price given `numTicks`
        const newPriceLower = tickToPrice(
          baseToken,
          quoteToken,
          Math.max(TickMath.MIN_TICK, pool.tickCurrent - numTicks),
        )
        const newPriceUpper = tickToPrice(
          baseToken,
          quoteToken,
          Math.min(TickMath.MAX_TICK, pool.tickCurrent + numTicks),
        )

        return [
          newPriceLower.toSignificant(5, undefined, Rounding.ROUND_UP),
          newPriceUpper.toSignificant(5, undefined, Rounding.ROUND_UP),
        ]
      }
      return ['', '']
    },
    [baseToken, quoteToken, feeAmount, pool],
  )

  const getSetFullRange = useCallback(() => {
    // dispatch(setFullRange())
  }, [])

  return {
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
    getSetRange,
    getSetFullRange,
  }
}
