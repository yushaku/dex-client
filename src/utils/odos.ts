import { formatUnits } from 'viem/utils'
import { WrapAsset } from '@/stores/addictionTokens'

export const routers = {
  1: '0xCf5540fFFCdC3d510B18bFcA6d2b9987b0772559',
  56: '0x89b8AA89FDd0507a99d334CBe3C808fAFC7d850E',
}

export const executors = {
  1: '0xB28Ca7e465C452cE4252598e0Bc96Aeba553CF82',
  56: '0x9b57DcA972Db5D8866c630554AcdbDfE58b2659c',
}

export const quoteUrl = 'https://api.odos.xyz/sor/quote/v2'

export const SWAP_TYPES = {
  SWAP: '1',
  TWAP: '2',
  LIMIT: '3',
}

export const SWAP_TYPES_ITEMS = [
  { key: SWAP_TYPES.SWAP, label: 'Swap' },
  { key: SWAP_TYPES.TWAP, label: 'TWAP' },
  { key: SWAP_TYPES.LIMIT, label: 'Limit' },
]

export const percents = [
  {
    label: '10%',
    value: 0.1,
  },
  {
    label: '25%',
    value: 0.25,
  },
  {
    label: '50%',
    value: 0.5,
  },
  {
    label: 'Max',
    value: 1,
  },
]

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
  amount: bigint | string | null
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
