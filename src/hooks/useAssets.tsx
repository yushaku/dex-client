import { WrapAsset, useTokensState } from '@/stores/addictionTokens'
import React, { createContext, useContext, useMemo } from 'react'
import { Address, erc20Abi, formatUnits, zeroAddress } from 'viem'
import { useAccount, useBalance, useReadContracts } from 'wagmi'
import { useFetchTokenList } from './useGetTokenMetadata'

export const AssetsContext = createContext<{
  mappedToken: Record<string, WrapAsset>
  listTokens: Array<WrapAsset>
}>({
  mappedToken: {},
  listTokens: [],
})

export const AssetsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { tokenList: storageTokens } = useTokensState()

  const { address: account, chainId = 1 } = useAccount()
  const { data: assets = [] } = useFetchTokenList(chainId)
  const allTokens = useMemo(
    () => storageTokens.concat(assets as unknown as WrapAsset),
    [assets, storageTokens],
  )

  const { data: nativeBalance } = useBalance({
    address: account,
    query: { enabled: Boolean(account) },
  })

  const { data: balanceOfs } = useReadContracts({
    contracts: allTokens.map((token) => ({
      abi: erc20Abi,
      functionName: 'balanceOf',
      address: token.address as Address,
      args: [account],
      chainId,
    })),
    query: {
      refetchInterval: 100_000,
      enabled: !!account,
    },
  })

  const { mappedToken, listTokens } = useMemo(() => {
    const mapped: Record<string, WrapAsset> = {}
    const list: Array<WrapAsset> = []

    allTokens.forEach((token, index) => {
      const balanceOf =
        token.address === zeroAddress
          ? nativeBalance?.value ?? 0n
          : ((balanceOfs?.at(index)?.result ?? 0n) as bigint)

      const asset = {
        ...token,
        formatted: formatUnits(balanceOf, token.decimals),
        balance: balanceOf,
      }

      list.push(asset)
      mapped[token.address] = asset
    })

    return {
      mappedToken: mapped,
      listTokens: list.sort((a, b) => Number(b.balance - a.balance)),
    }
  }, [allTokens, balanceOfs, nativeBalance?.value])

  return (
    <AssetsContext.Provider value={{ mappedToken, listTokens }}>
      {children}
    </AssetsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGetAsset(tokenAddress?: Address | string | null) {
  const { mappedToken } = useContext(AssetsContext)

  return useMemo(() => {
    if (!tokenAddress) return undefined
    return mappedToken[tokenAddress]
  }, [mappedToken, tokenAddress])
}
