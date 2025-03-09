import { Currency, CurrencyAmount, Price, Token } from '@uniswap/sdk-core'
import {
  FeeAmount,
  TICK_SPACINGS,
  TickMath,
  encodeSqrtRatioX96,
  nearestUsableTick,
  priceToClosestTick,
  tickToPrice,
} from '@uniswap/v3-sdk'
import JSBI from 'jsbi'
import { parseUnits } from 'viem'

export function tryParseAmount(value?: string, token?: Token | null) {
  if (!value || !token) return undefined

  try {
    const typedValueParsed = parseUnits(value, token.decimals).toString()
    return CurrencyAmount.fromRawAmount(token, typedValueParsed)
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return undefined
}

export function tryParseTick(
  baseToken?: Token,
  quoteToken?: Token,
  feeAmount?: FeeAmount,
  value?: string,
): number | undefined {
  if (!baseToken || !quoteToken || !feeAmount || !value) return undefined
  const price = tryParsePrice(baseToken, quoteToken, value)
  if (!price) return undefined

  // check price is within min/max bounds, if outside return min/max
  const sqrtRatioX96 = encodeSqrtRatioX96(price.numerator, price.denominator)

  let tick: number
  if (JSBI.greaterThanOrEqual(sqrtRatioX96, TickMath.MAX_SQRT_RATIO)) {
    tick = TickMath.MAX_TICK
  } else if (JSBI.lessThanOrEqual(sqrtRatioX96, TickMath.MIN_SQRT_RATIO)) {
    tick = TickMath.MIN_TICK
  } else {
    // this function is agnostic to the base, will always return the correct tick
    tick = priceToClosestTick(price)
  }

  return nearestUsableTick(tick, TICK_SPACINGS[feeAmount])
}

export function getTickToPrice(
  baseToken?: Token | null,
  quoteToken?: Token | null,
  tick?: number | null,
) {
  if (!baseToken || !quoteToken || typeof tick !== 'number') return undefined
  return tickToPrice(baseToken, quoteToken, tick)
}

export function tryParsePrice<T extends Currency>(
  baseToken?: T,
  quoteToken?: T,
  value?: string,
) {
  if (!baseToken || !quoteToken || !value) return undefined
  if (!value.match(/^\d*\.?\d+$/)) return undefined

  const [whole, fraction] = value.split('.')
  const decimals = fraction?.length ?? 0
  const withoutDecimals = JSBI.BigInt((whole ?? '') + (fraction ?? ''))

  let price = null
  try {
    const num1 = JSBI.multiply(
      JSBI.BigInt(10 ** decimals),
      JSBI.BigInt(10 ** baseToken.decimals),
    )
    const num2 = JSBI.multiply(
      withoutDecimals,
      JSBI.BigInt(10 ** quoteToken.decimals),
    )

    price = new Price(baseToken, quoteToken, num1, num2)
  } catch (error) {
    console.log(error)
  }

  return price
}

// export function getV3PriceRangeInfo({
//   state,
//   positionState,
//   derivedPositionInfo,
// }: {
//   state: PriceRangeState
//   positionState: PositionState
//   derivedPositionInfo: CreateV3PositionInfo
// }): V3PriceRangeInfo {
//   const { fee } = positionState
//   const { protocolVersion, currencies } = derivedPositionInfo
//   const pool = derivedPositionInfo.pool
//
//   const tokenA = getCurrencyWithWrap(currencies[0], protocolVersion)
//   const tokenB = getCurrencyWithWrap(currencies[1], protocolVersion)
//   const sortedTokens = getSortedCurrenciesTuple(tokenA, tokenB)
//   const [sortedToken0, sortedToken1] = sortedTokens
//
//   const [baseCurrency, quoteCurrency] = getInvertedTuple(
//     currencies,
//     state.priceInverted,
//   )
//   const [baseToken, quoteToken] = [
//     getCurrencyWithWrap(baseCurrency, protocolVersion),
//     getCurrencyWithWrap(quoteCurrency, protocolVersion),
//   ]
//
//   const initialPriceTokens = getInvertedTuple(
//     [
//       getCurrencyWithWrap(currencies[0], protocolVersion),
//       getCurrencyWithWrap(currencies[1], protocolVersion),
//     ],
//     state.priceInverted,
//   )
//
//   const price = derivedPositionInfo.creatingPoolOrPair
//     ? getInitialPrice({
//         baseCurrency: initialPriceTokens[0],
//         sortedCurrencies: sortedTokens,
//         initialPrice: state.initialPrice,
//       })
//     : getPrice({
//         type: ProtocolVersion.V3,
//         pool,
//         currency0: sortedToken0,
//       })
//   const invalidPrice = isInvalidPrice(price)
//   const mockPool = createMockV3Pool({
//     baseToken,
//     quoteToken,
//     fee: fee.feeAmount,
//     price,
//     invalidPrice,
//   })
//
//   const poolForPosition = pool ?? mockPool
//   const tickSpaceLimits: [number, number] = [
//     nearestUsableTick(TickMath.MIN_TICK, fee.tickSpacing),
//     nearestUsableTick(TickMath.MAX_TICK, fee.tickSpacing),
//   ]
//
//   const invertPrice = Boolean(
//     baseToken && sortedToken0 && !baseToken.equals(sortedToken0),
//   )
//   const [baseRangeInput, quoteRangeInput] = invertPrice
//     ? [state.maxPrice, state.minPrice]
//     : [state.minPrice, state.maxPrice]
//
//   const lowerTick =
//     baseRangeInput === ''
//       ? tickSpaceLimits[0]
//       : invertPrice
//         ? tryParseTick(
//             sortedToken1,
//             sortedToken0,
//             fee.feeAmount,
//             state.maxPrice,
//           )
//         : tryParseTick(
//             sortedToken0,
//             sortedToken1,
//             fee.feeAmount,
//             state.minPrice,
//           )
//   const upperTick =
//     quoteRangeInput === ''
//       ? tickSpaceLimits[1]
//       : invertPrice
//         ? tryParseTick(
//             sortedToken1,
//             sortedToken0,
//             fee.feeAmount,
//             state.minPrice,
//           )
//         : tryParseTick(
//             sortedToken0,
//             sortedToken1,
//             fee.feeAmount,
//             state.maxPrice,
//           )
//
//   const ticks: [OptionalNumber, OptionalNumber] = [lowerTick, upperTick]
//   const invalidRange = Boolean(
//     lowerTick !== undefined &&
//       upperTick !== undefined &&
//       lowerTick >= upperTick,
//   )
//
//   const ticksAtLimit: [boolean, boolean] = state.fullRange
//     ? [true, true]
//     : [lowerTick === tickSpaceLimits[0], upperTick === tickSpaceLimits[1]]
//
//   const pricesAtLimit: [OptionalCurrencyPrice, OptionalCurrencyPrice] = [
//     getTickToPrice(sortedToken0, sortedToken1, tickSpaceLimits[0]),
//     getTickToPrice(sortedToken0, sortedToken1, tickSpaceLimits[1]),
//   ]
//
//   const pricesAtTicks: [OptionalCurrencyPrice, OptionalCurrencyPrice] = [
//     getTickToPrice(sortedToken0, sortedToken1, ticks[0]),
//     getTickToPrice(sortedToken0, sortedToken1, ticks[1]),
//   ]
//
//   const isSorted = areCurrenciesEqual(baseToken, sortedToken0)
//   const prices = getPrices({
//     baseCurrency: baseToken,
//     quoteCurrency: quoteToken,
//     pricesAtLimit,
//     pricesAtTicks,
//     state,
//   })
//
//   const outOfRange = Boolean(
//     !invalidRange &&
//       price &&
//       prices[0] &&
//       prices[1] &&
//       (price.lessThan(prices[0]) || price.greaterThan(prices[1])),
//   )
//
//   // This is in terms of the sorted tokens
//   const deposit0Disabled = Boolean(
//     upperTick !== undefined &&
//       poolForPosition &&
//       poolForPosition.tickCurrent >= upperTick,
//   )
//   const deposit1Disabled = Boolean(
//     lowerTick !== undefined &&
//       poolForPosition &&
//       poolForPosition.tickCurrent <= lowerTick,
//   )
//
//   const depositADisabled =
//     invalidRange ||
//     Boolean(
//       (deposit0Disabled &&
//         poolForPosition &&
//         tokenA &&
//         poolForPosition.token0.equals(tokenA)) ||
//         (deposit1Disabled &&
//           poolForPosition &&
//           tokenA &&
//           poolForPosition.token1.equals(tokenA)),
//     )
//
//   const depositBDisabled =
//     invalidRange ||
//     Boolean(
//       (deposit0Disabled &&
//         poolForPosition &&
//         tokenB &&
//         poolForPosition.token0.equals(tokenB)) ||
//         (deposit1Disabled &&
//           poolForPosition &&
//           tokenB &&
//           poolForPosition.token1.equals(tokenB)),
//     )
//
//   return {
//     protocolVersion,
//     ticks,
//     ticksAtLimit,
//     isSorted,
//     price,
//     prices,
//     pricesAtTicks,
//     pricesAtLimit,
//     tickSpaceLimits,
//     invertPrice,
//     invalidPrice,
//     invalidRange,
//     outOfRange,
//     deposit0Disabled: depositADisabled,
//     deposit1Disabled: depositBDisabled,
//     mockPool,
//   } satisfies V3PriceRangeInfo
// }
