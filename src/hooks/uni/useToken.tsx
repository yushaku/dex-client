import { Token } from '@uniswap/sdk-core'
import { useMemo } from 'react'
import { isAddress } from 'viem'
import { useAccount } from 'wagmi'
import { useGetAsset } from '../useAssets'

export function useToken(tokenAddress: string = '') {
  const asset = useGetAsset(tokenAddress)
  const { chainId = 1 } = useAccount()

  return useMemo(() => {
    if (!asset || !isAddress(tokenAddress)) return undefined
    const token = new Token(
      chainId,
      asset.address,
      asset.decimals,
      asset.symbol,
      asset.name,
    )
    return token
  }, [asset, chainId, tokenAddress])
}
