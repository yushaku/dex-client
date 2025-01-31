import { useTokenPrice } from '@/hooks'
import { Asset, cn } from '@/utils'
import { formatAmount } from '@/utils/odos'
import { useAccount } from 'wagmi'
import { OrderToken } from './OrderToken'

type Props = {
  type: 'from' | 'to'
  asset: Asset | null
  amount: string
  balance: bigint | undefined
  setToAmount: (_amount: string) => void
  setFromAmount: (_amount: string) => void
  handleSetToken: (_type: 'from' | 'to', _asset: Asset) => void
}

export const OrderInput = ({
  type,
  amount,
  asset,
  balance,
  setToAmount,
  setFromAmount,
  handleSetToken,
}: Props) => {
  const { chainId = 56 } = useAccount()
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
          className="no-spinner flex-1 bg-transparent text-lg focus:outline-none lg:text-2xl"
          style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
        />

        <OrderToken
          handleSetToken={(asset) => {
            handleSetToken(type, asset)
            setToAmount('0')
          }}
          asset={asset}
        />
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
                {formatAmount({
                  amount: balance,
                  decimals: asset?.decimals,
                })}
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
