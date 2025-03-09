import { UniPoolV3 } from '@/abi/uniPoolV3'
import { Bound, FIELD, useMintState } from '@/stores'
import { Asset } from '@/utils'
import { CurrencyAmount, Price, Rounding, Token } from '@uniswap/sdk-core'
import {
  FeeAmount,
  Pool,
  Position,
  TICK_SPACINGS,
  TickMath,
  nearestUsableTick,
  tickToPrice,
} from '@uniswap/v3-sdk'
import { useCallback, useMemo } from 'react'
import { Address, isAddress, zeroAddress } from 'viem'
import { useAccount, useReadContracts } from 'wagmi'
import { getTickToPrice, tryParseAmount, tryParseTick } from './util'

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
    // const price = tickToPrice(tokenA, tokenB, pool.tickCurrent)
    // console.log({
    //   price: price.toSignificant(5),
    // })
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

export type MintInfo = Awaited<ReturnType<typeof useGetGetMintInfo>>

export function useGetGetMintInfo({
  asset0,
  asset1,
}: {
  asset0: Asset | null
  asset1: Asset | null
}) {
  const {
    fee,
    typedValue,
    initialPrice,
    independentField,
    rightRangeInput,
    leftRangeInput,
  } = useMintState()
  const { pool, poolAddress, tokenA, tokenB } = useGetPool({
    asset0,
    asset1,
    fee,
  })

  const TICK_SPACING = TICK_SPACINGS[fee]
  const [sortedA, sortedB] = useMemo(() => {
    if (!tokenA || !tokenB) return [undefined, undefined]
    return tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
  }, [tokenA, tokenB])

  const dependentField =
    independentField === FIELD.CURRENCY_A ? FIELD.CURRENCY_B : FIELD.CURRENCY_A
  // const dependentToken = dependentField === FIELD.CURRENCY_B ? asset1 : asset0

  const isInvert = Boolean(
    tokenA && tokenB && sortedA && !tokenA.equals(sortedA),
  )

  // MARK: calculate ticks
  const tickSpaceLimits = useMemo(
    () => ({
      [Bound.LOWER]: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACING),
      [Bound.UPPER]: nearestUsableTick(TickMath.MAX_TICK, TICK_SPACING),
    }),
    [TICK_SPACING],
  )
  const ticks = useMemo(
    () => ({
      [Bound.LOWER]:
        (isInvert && typeof rightRangeInput === 'boolean') ||
        (!isInvert && typeof leftRangeInput === 'boolean')
          ? tickSpaceLimits[Bound.LOWER]
          : isInvert
            ? tryParseTick(sortedB, sortedA, fee, rightRangeInput)
            : tryParseTick(sortedA, sortedB, fee, leftRangeInput),
      [Bound.UPPER]:
        (!isInvert && typeof rightRangeInput === 'boolean') ||
        (isInvert && typeof leftRangeInput === 'boolean')
          ? tickSpaceLimits[Bound.UPPER]
          : isInvert
            ? tryParseTick(sortedB, sortedA, fee, leftRangeInput)
            : tryParseTick(sortedA, sortedB, fee, rightRangeInput),
    }),
    [
      isInvert,
      rightRangeInput,
      leftRangeInput,
      tickSpaceLimits,
      sortedB,
      sortedA,
      fee,
    ],
  )
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const ticksAtLimit = useMemo(
    () => ({
      [Bound.LOWER]: tickLower === tickSpaceLimits.LOWER,
      [Bound.UPPER]: tickUpper === tickSpaceLimits.UPPER,
    }),
    [tickSpaceLimits, tickLower, tickUpper],
  )

  // MARK: calculate price
  const price = useMemo(() => {
    if (pool) return sortedA ? pool.priceOf(sortedA) : undefined
    if (!sortedA || !sortedB) return undefined

    const quoteAmount = tryParseAmount(
      initialPrice,
      isInvert ? sortedA : sortedB,
    )

    if (quoteAmount && sortedA && sortedB) {
      const baseAmount = tryParseAmount('1', isInvert ? sortedB : sortedA)
      const baseprice =
        baseAmount && quoteAmount
          ? new Price(
              baseAmount.currency,
              quoteAmount.currency,
              baseAmount.quotient,
              quoteAmount.quotient,
            )
          : undefined
      return (isInvert ? baseprice?.invert() : baseprice) ?? undefined
    }
    return undefined
  }, [pool, sortedA, sortedB, initialPrice, isInvert])

  const pricesAtTicks = useMemo(
    () => ({
      [Bound.LOWER]: getTickToPrice(sortedA, sortedB, ticks[Bound.LOWER]),
      [Bound.UPPER]: getTickToPrice(sortedA, sortedB, ticks[Bound.UPPER]),
    }),
    [ticks, sortedA, sortedB],
  )
  const { [Bound.LOWER]: lowerPrice, [Bound.UPPER]: upperPrice } = pricesAtTicks
  const invalidRange = Boolean(
    typeof tickLower === 'number' &&
      typeof tickUpper === 'number' &&
      tickLower >= tickUpper,
  )
  const outOfRange = Boolean(
    !invalidRange &&
      price &&
      lowerPrice &&
      upperPrice &&
      (price.lessThan(lowerPrice) || price.greaterThan(upperPrice)),
  )

  // MARK: calculate dependent amount base on typed independent amount
  const currencies = useMemo(
    () => ({
      [FIELD.CURRENCY_A]: tokenA,
      [FIELD.CURRENCY_B]: tokenB,
    }),
    [tokenA, tokenB],
  )
  const independentToken = currencies[independentField]
  const independentAmount = tryParseAmount(typedValue, independentToken)
  const dependentAmount = useMemo(() => {
    const wrappedIndependentAmount = independentAmount?.wrapped
    const dependentCurrency =
      dependentField === FIELD.CURRENCY_B ? tokenB : tokenA

    if (
      independentAmount &&
      wrappedIndependentAmount &&
      typeof tickLower === 'number' &&
      typeof tickUpper === 'number' &&
      pool
    ) {
      if (outOfRange || invalidRange) return undefined

      const position = wrappedIndependentAmount.currency.equals(pool.token0)
        ? Position.fromAmount0({
            pool,
            tickLower,
            tickUpper,
            amount0: independentAmount.quotient,
            useFullPrecision: true, // we want full precision for the theoretical position
          })
        : Position.fromAmount1({
            pool,
            tickLower,
            tickUpper,
            amount1: independentAmount.quotient,
          })

      const dependentTokenAmount = wrappedIndependentAmount.currency.equals(
        pool.token0,
      )
        ? position.amount1
        : position.amount0
      return (
        dependentCurrency &&
        CurrencyAmount.fromRawAmount(
          dependentCurrency,
          dependentTokenAmount.quotient,
        )
      )
    }

    return undefined
  }, [
    dependentField,
    independentAmount,
    invalidRange,
    outOfRange,
    pool,
    tickLower,
    tickUpper,
    tokenA,
    tokenB,
  ])

  const parsedAmounts = useMemo(
    () => ({
      [FIELD.CURRENCY_A]:
        independentField === FIELD.CURRENCY_A
          ? independentAmount
          : dependentAmount,
      [FIELD.CURRENCY_B]:
        independentField === FIELD.CURRENCY_A
          ? dependentAmount
          : independentAmount,
    }),
    [dependentAmount, independentAmount, independentField],
  )

  return {
    pool,
    poolAddress,
    isInvert,
    pricesAtTicks,
    tokenA,
    tokenB,
    price,
    dependentField,
    parsedAmounts,
    ticks,
    ticksAtLimit,
  }
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
        baseToken &&
        quoteToken &&
        typeof tickLower === 'number' &&
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
