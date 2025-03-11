import { Highlight } from '@/components/common/Highlight'
import { useTokenPrice } from '@/hooks'
import { AssetsContext } from '@/hooks/useAssets'
import { IconGroup } from '@/pages/pools/components/IconGroup'
import { UNKNOWN_TOKEN, cn } from '@/utils'
import { formatNumber } from '@/utils/odos'
import { Token } from '@uniswap/sdk-core'
import { LockIcon } from 'lucide-react'
import { useContext } from 'react'
import { formatUnits } from 'viem'
import { useAccount } from 'wagmi'

type Props = {
  title: string
  token?: Token | null
  value: string
  handleInput: (_amount: string) => void
  locked?: boolean
}

export const InputTokenAmount = ({
  token,
  value,
  handleInput,
  locked = false,
  title,
}: Props) => {
  const isDouble = false

  const { chainId = 1 } = useAccount()
  const { mappedToken } = useContext(AssetsContext)
  const asset = mappedToken[token?.address ?? '']
  const { data: price } = useTokenPrice({
    token: token?.address ?? '',
    chainId,
  })

  const handleSetAmount = (persent: number) => {
    if (!asset?.balance) return
    const balance = (asset.balance * BigInt(persent)) / BigInt(100)
    const formated = formatUnits(balance, asset.decimals ?? 0)
    handleInput(formated)
  }

  return (
    <div className="w-full">
      {locked ? (
        <div className="flex flex-col items-center gap-3 self-stretch rounded-xl border border-neutral-700 p-4">
          <Highlight>
            <LockIcon className="size-5" />
          </Highlight>
          <p>The market price is outside</p>
          <p>Single-asset deposit only</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="font-medium text-white">{title}</p>
            <ul className="flex justify-end gap-3">
              {[10, 20, 50, 100].map((number) => {
                return (
                  <li key={number}>
                    <button
                      onClick={() => handleSetAmount(number)}
                      className={cn(
                        'px-4 py-2 text-sm text-textSecondary rounded border border-focus hover:bg-focus',
                      )}
                    >
                      {number}%
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="flex flex-col gap-3 self-stretch rounded-xl border border-neutral-700 p-4">
            <div className="flex items-center justify-between gap-2">
              <input
                type="number"
                className="no-spinner w-full border-0 bg-transparent p-0 text-xl text-neutral-50 placeholder:text-neutral-400"
                style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                placeholder="0.0"
                value={value}
                disabled={locked}
                onChange={(e) => {
                  handleInput(Number(e.target.value) < 0 ? '' : e.target.value)
                }}
                min={0}
                lang="en"
              />
              <div
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl w-fit bg-focus py-2 px-4',
                )}
              >
                {isDouble ? (
                  <IconGroup
                    className={{
                      default: '-space-x-2',
                      image: 'size-6 outline-2',
                    }}
                    logo1="https://cdn.thena.fi/assets/BSC.png"
                    logo2="https://cdn.thena.fi/assets/BNB.png"
                  />
                ) : (
                  <img
                    className={cn('size-8 rounded-full')}
                    src={asset?.logoURI ?? UNKNOWN_TOKEN}
                    alt="First Logo"
                  />
                )}
                <span className="text-nowrap">
                  {isDouble ? 'BNB + WBNB' : token?.symbol}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 text-textSecondary">
              <p>${formatNumber(Number(value) * Number(price ?? 0))}</p>
              <h3>Balance: {formatNumber(asset?.formatted)}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
