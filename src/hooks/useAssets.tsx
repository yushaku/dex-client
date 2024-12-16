import React, { createContext, useContext, useMemo } from 'react'
import { ERC20_ABI } from '@/abi/erc20'
import { WrapAsset, useTokensState } from '@/stores/addictionTokens'
import { assets } from '@/utils/assets'
import { formatUnits } from 'viem'
import { useAccount, useReadContracts } from 'wagmi'

// Create context for assets
const AssetsContext = createContext<{
  mappedToken: Record<string, WrapAsset>
  tokenList: Array<WrapAsset>
}>({
  mappedToken: {},
  tokenList: [],
})

// Provider component
export const AssetsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { tokenList: storageTokens } = useTokensState()
  const { address: account, chainId } = useAccount()
  const allTokens = useMemo(
    () => storageTokens.concat(assets as unknown as WrapAsset),
    [storageTokens],
  )

  const { data: balanceOfs } = useReadContracts({
    contracts: allTokens.map((token) => ({
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      address: token.address,
      args: [account],
      chainId,
    })),
    query: {
      refetchInterval: 100_000,
      enabled: !!account,
    },
  })

  const { mappedToken, tokenList } = useMemo(() => {
    const mapped: Record<string, WrapAsset> = {}
    const list: Array<WrapAsset> = []

    allTokens.forEach((token, index) => {
      const balanceOf = (balanceOfs?.at(index)?.result ?? 0n) as bigint

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
      tokenList: list.sort((a, b) => Number(b.balance - a.balance)),
    }
  }, [allTokens, balanceOfs])

  return (
    <AssetsContext.Provider value={{ mappedToken, tokenList }}>
      {children}
    </AssetsContext.Provider>
  )
}

// Custom hook to use the assets context
export const useAssets = () => {
  const context = useContext(AssetsContext)
  if (!context) {
    throw new Error('useAssets must be used within an AssetsProvider')
  }
  return context
}
