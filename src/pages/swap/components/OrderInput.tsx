import { useTokenPrice } from '@/hooks'
import { WrapAsset } from '@/stores/addictionTokens'
import { Asset, cn, formatNumber } from '@/utils'
import { formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { OrderToken } from './OrderToken'
import { TokensDialog } from './TokensDialog'

type Props<T> = {
  type: T
  asset: Asset | null
  amount: string
  balance: bigint | undefined
  listAssets?: WrapAsset[]
  setToAmount: (_amount: string) => void
  setFromAmount: (_amount: string) => void
  handleSetToken: (_type: T, _asset: Asset) => void
}

export const OrderInput = <T,>({
  type,
  amount,
  asset,
  balance,
  listAssets,
  setToAmount,
  setFromAmount,
  handleSetToken,
}: Props<T>) => {
  const { chainId = 1 } = useAccount()
  const { data: price } = useTokenPrice({
    token: asset?.address ?? '',
    chainId,
  })

  return (
    <div
      id="TOKEN-INPUT"
      className={cn(
        'mt-5 space-y-1 rounded-xl border border-focus bg-background p-4',
        'focus-within:border-lighterAccent hover:border-lighterAccent',
      )}
    >
      <div className="flex justify-between">
        <input
          placeholder="0.0"
          type="number"
          disabled={type === 'to'}
          value={amount}
          onChange={(e) => {
            const value = e.target.value
            setFromAmount(Number(value).toString())
            if (Number(value) === 0) {
              setToAmount('0')
            }
          }}
          className="no-spinner w-3/4 flex-1 bg-transparent text-lg focus:outline-none lg:text-2xl"
          style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
        />

        {listAssets ? (
          <TokensDialog
            handleSetToken={(asset) => {
              handleSetToken(type, asset)
              setToAmount('0')
            }}
            asset={asset}
            listAssets={listAssets}
          />
        ) : (
          <OrderToken
            handleSetToken={(asset) => {
              handleSetToken(type, asset)
              setToAmount('0')
            }}
            asset={asset}
          />
        )}
      </div>

      <div className="flex justify-between text-sm lg:text-lg">
        <p className="text-textSecondary">
          ${Number(Number(price) * Number(amount)).toFixed(4)}
        </p>
        <p className="space-x-2 text-textSecondary">
          <span>Balance:</span>

          {balance !== undefined ? (
            <span>
              <strong className="mr-1">
                {formatNumber(formatUnits(balance, asset?.decimals ?? 18))}
              </strong>
              {asset?.symbol}
            </span>
          ) : (
            <span>0 {asset?.symbol}</span>
          )}
        </p>
      </div>
    </div>
  )
}
