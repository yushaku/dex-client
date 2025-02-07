import { formatUnits } from 'viem/utils'
import { WrapAsset } from '@/stores/addictionTokens'

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
  amount: bigint | string | null | undefined
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
