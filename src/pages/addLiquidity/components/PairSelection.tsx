import { AssetsContext } from '@/hooks/useAssets'
import { OrderToken } from '@/pages/swap/components/OrderToken'
import { useMintState } from '@/stores'
import { findAsset } from '@/utils'
import { useContext, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export const PairSelection = () => {
  const { listTokens } = useContext(AssetsContext)

  const [searchParams] = useSearchParams()
  const token1 = searchParams.get('token0') ?? ''
  const token2 = searchParams.get('token1') ?? ''

  const { asset0, asset1, handleSetToken } = useMintState()

  useEffect(() => {
    const tokenA = findAsset(token1, listTokens)
    if (tokenA) {
      handleSetToken('asset0', tokenA)
    }
  }, [token1, listTokens, handleSetToken])

  useEffect(() => {
    const tokenB = findAsset(token2, listTokens)
    if (tokenB) {
      handleSetToken('asset1', tokenB)
    }
  }, [handleSetToken, listTokens, token2])

  return (
    <article>
      <h2 className="text-lg font-semibold">Select pair</h2>
      <p className="text-sm font-light text-textSecondary">
        Choose the tokens you want to provide liquidity for. You can select
        tokens on all supported networks.
      </p>

      <div className="mt-4 flex gap-4">
        <OrderToken
          className="w-full rounded-lg"
          asset={asset0}
          handleSetToken={(asset) => {
            handleSetToken('asset0', asset)
          }}
        />

        <OrderToken
          className="w-full rounded-lg"
          asset={asset1}
          handleSetToken={(asset) => {
            handleSetToken('asset1', asset)
          }}
        />
      </div>
    </article>
  )
}
