import { Bound, FIELD, useMintState } from '@/stores'
import { Asset } from '@/utils'
import { CurrencyAmount, Price } from '@uniswap/sdk-core'
import {
  Position,
  TICK_SPACINGS,
  TickMath,
  nearestUsableTick,
} from '@uniswap/v3-sdk'
import JSBI from 'jsbi'
import { useMemo } from 'react'
import { useGetPool } from './usePoolV3'
import { getTickToPrice, tryParseAmount, tryParseTick } from './util'

const BIG_INT_ZERO = JSBI.BigInt(0)

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
  const {
    pool: _pool,
    poolAddress,
    tokenA,
    tokenB,
  } = useGetPool({
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
            ? tryParseTick(sortedB, sortedA, fee, rightRangeInput.toString())
            : tryParseTick(sortedA, sortedB, fee, leftRangeInput.toString()),
      [Bound.UPPER]:
        (!isInvert && typeof rightRangeInput === 'boolean') ||
        (isInvert && typeof leftRangeInput === 'boolean')
          ? tickSpaceLimits[Bound.UPPER]
          : isInvert
            ? tryParseTick(sortedB, sortedA, fee, leftRangeInput.toString())
            : tryParseTick(sortedA, sortedB, fee, rightRangeInput.toString()),
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
    if (_pool) return sortedA ? _pool.priceOf(sortedA) : undefined
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
  }, [_pool, sortedA, sortedB, initialPrice, isInvert])

  // const mockPool = useMemo(() => {
  //   if (tokenA && tokenB && fee && price && !_pool) {
  //     const currentTick = priceToClosestTick(price)
  //     const currentSqrt = TickMath.getSqrtRatioAtTick(currentTick)
  //     return new Pool(
  //       tokenA,
  //       tokenB,
  //       fee,
  //       currentSqrt,
  //       JSBI.BigInt(0),
  //       currentTick,
  //       [],
  //     )
  //   }
  //   return undefined
  // }, [fee, _pool, price, tokenA, tokenB])
  const pool = _pool

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

  // MARK: Estimate position
  const deposit0Disabled = Boolean(
    typeof tickUpper === 'number' && pool && pool.tickCurrent >= tickUpper,
  )
  const deposit1Disabled = Boolean(
    typeof tickLower === 'number' && pool && pool.tickCurrent <= tickLower,
  )

  const position = useMemo(() => {
    if (
      !pool ||
      !tokenA ||
      !tokenB ||
      typeof tickLower !== 'number' ||
      typeof tickUpper !== 'number' ||
      invalidRange
    ) {
      return undefined
    }

    // mark as 0 if disabled because out of range
    const amount0 = !deposit0Disabled
      ? parsedAmounts?.[
          tokenA.equals(pool.token0) ? FIELD.CURRENCY_A : FIELD.CURRENCY_B
        ]?.quotient
      : BIG_INT_ZERO
    const amount1 = !deposit1Disabled
      ? parsedAmounts?.[
          tokenA.equals(pool.token0) ? FIELD.CURRENCY_B : FIELD.CURRENCY_A
        ]?.quotient
      : BIG_INT_ZERO

    if (amount0 === undefined || amount1 === undefined) return undefined

    return Position.fromAmounts({
      pool,
      tickLower,
      tickUpper,
      amount0,
      amount1,
      useFullPrecision: true, // we want full precision for the theoretical position
    })
  }, [
    pool,
    tokenA,
    tokenB,
    tickLower,
    tickUpper,
    invalidRange,
    parsedAmounts,
    deposit0Disabled,
    deposit1Disabled,
  ])

  return {
    pool: _pool,
    position,
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
    deposit0Disabled,
    deposit1Disabled,
  }
}
