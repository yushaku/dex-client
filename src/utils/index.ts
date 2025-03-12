export * from './theme'
export * from './constant'
export * from './wagmiConfig.ts'
export * from './types'
export * from './address'
export * from './tailwind'
export * from './mocs.ts'
export * from './gqlClient'

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
