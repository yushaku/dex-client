import { useChainId } from 'wagmi'

export const useGetTx = () => {
  const chainId = useChainId()

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

  function transactionHref(hash: string) {
    return `${scanHref}/tx/${hash}`
  }

  return {
    transactionHref
  }
}
