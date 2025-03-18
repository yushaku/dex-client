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
function truncateValue(value: string, decimals: number): string {
  const parts = value.split(/[.,]/)
  const symbol = value.includes('.') ? '.' : ','
  if (parts.length > 1 && parts[1].length > decimals) {
    return parts[0] + symbol + parts[1].slice(0, decimals)
  }
  return value
}

/**
 * Parses a CurrencyAmount from the passed string.
 * Returns the CurrencyAmount, or undefined if parsing fails.
 */
export default function tryParseCurrencyAmount<T extends Currency>(
  value?: string,
  currency?: T,
): CurrencyAmount<T> | undefined {
  if (!value || !currency || isNaN(parseFloat(value))) {
    return undefined
  }
  try {
    const typedValueParsed = parseUnits(
      truncateValue(value, currency.decimals),
      currency.decimals,
    ).toString()
    if (typedValueParsed !== '0') {
      return CurrencyAmount.fromRawAmount(
        currency,
        JSBI.BigInt(typedValueParsed),
      )
    }
  } catch (error) {
    // fails if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(
      'tryParseCurrencyAmount',
      'tryParseCurrencyAmount',
      `Failed to parse input amount: "${value}"`,
      error,
    )
  }
  return undefined
}
