import { formatUnits } from 'viem/utils'
import { WrapAsset } from '@/stores/addictionTokens'
import BigNumber from 'bignumber.js'

export const quoteUrl = 'https://api.odos.xyz/sor/quote/v2'

export const isInvalidAmount = (amount?: string | number | null) =>
  !amount || Number.isNaN(Number(amount)) || Number(amount) <= 0

export const findAsset = (token: string | null, assets: Array<WrapAsset>) =>
  token
    ? assets.find(
        (asset) => asset.address.toLowerCase() === token.toLowerCase(),
      )
    : null

export const formatAmount = ({
  amount = 0n,
  decimals = 18,
  shorted = false,
}: {
  amount: bigint | string | number | null | undefined
  decimals?: number
  shorted?: boolean
}) => {
  if (!amount || BigInt(amount) === BigInt(0)) return '0'

  const bigAmount = BigInt(amount)

  // Define thresholds for comparison
  const thousand = BigInt(1e3)
  const million = BigInt(1e6)
  const billion = BigInt(1e9)
  const trillion = BigInt(1e12)

  const formattedAmount = parseFloat(formatUnits(bigAmount, decimals))

  if (shorted) {
    if (bigAmount >= trillion) {
      return `${(formattedAmount / 1e12).toFixed(2)}T`
    } else if (bigAmount >= billion) {
      return `${(formattedAmount / 1e9).toFixed(2)}B`
    } else if (bigAmount >= million) {
      return `${(formattedAmount / 1e6).toFixed(2)}M`
    } else if (bigAmount >= thousand) {
      return `${(formattedAmount / 1e3).toFixed(2)}K`
    }
  }

  return formattedAmount.toFixed(6)
}

export const formatNumber = (
  amount: number | string | null | undefined = null,
  shorted = false,
  fixed = 3,
  hideNegative = true,
) => {
  if (!amount || BigNumber(amount).isZero()) return '0'
  const bigAmount = BigNumber(amount)
  if (
    hideNegative &&
    bigAmount.lt(BigNumber(1).div(BigNumber(10).pow(fixed)))
  ) {
    return `< ${BigNumber(1).div(BigNumber(10).pow(fixed)).toString(10)}`
  }

  if (bigAmount.gt(1) && bigAmount.lt(1000)) {
    return bigAmount.dp(2).toFormat()
  }

  if (shorted) {
    if (bigAmount.gte(1e12)) {
      return `${bigAmount.div(1e12).dp(2).toFormat()}T`
    }

    if (bigAmount.gte(1e9)) {
      return `${bigAmount.div(1e9).dp(2).toFormat()}B`
    }

    if (bigAmount.gte(1e6)) {
      return `${bigAmount.div(1e6).dp(2).toFormat()}M`
    }

    if (bigAmount.gte(1e3)) {
      return `${bigAmount.div(1e3).dp(2).toFormat()}K`
    }
  }

  if (bigAmount.gte(1e3)) {
    return bigAmount.dp(0).toFormat()
  }

  return bigAmount.dp(fixed).toFormat()
}
