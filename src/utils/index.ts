import { BSC, ETH, Matic } from '@/components/icons'
import { WrapAsset } from '@/stores/addictionTokens.ts'
import BigNumber from 'bignumber.js'
import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export * from './constant'
export * from './gqlClient'
export * from './mocs.ts'
export * from './types'
export * from './wagmiConfig.ts'

export function getTransactionLink({
  hash,
  chainId = 1,
}: {
  hash?: string
  chainId: number
}) {
  if (!hash) return ''
  let scanHref = ''

  switch (chainId) {
    case 97:
      scanHref = 'https://testnet.bscscan.com'
      break
    case 56:
      scanHref = 'https://bscscan.com'
      break
    default:
      scanHref = 'https://bscscan.com'
      break
  }

  return `${scanHref}/tx/${hash}`
}

export const toWei = (number: number | string, decimals = 18) =>
  BigNumber(number)
    .decimalPlaces(decimals, BigNumber.ROUND_DOWN)
    .times(BigNumber(10).pow(decimals))

export const shortenAddress = (add: string | undefined) => {
  if (!add) return ''
  return add.slice(0, 6) + '...' + add.slice(-4)
}

export const getNativeToken = (chainId: number) => {
  switch (chainId) {
    case 1:
    case 5:
    case 11155111: {
      return ETH
    }
    case 97: {
      return BSC
    }
    case 80001: {
      return Matic
    }
  }
}

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
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

export const isInvalidAmount = (amount?: string | number | null) =>
  !amount || Number.isNaN(Number(amount)) || Number(amount) <= 0

export const findAsset = (token: string | null, assets: Array<WrapAsset>) =>
  token
    ? assets.find(
        (asset) => asset.address.toLowerCase() === token.toLowerCase(),
      )
    : null
