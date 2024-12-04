import { ArrowPathIcon } from '@heroicons/react/16/solid'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { formatUnits } from 'viem'
import { bsc } from 'viem/chains'
import { useAccount, useBalance, useSwitchChain } from 'wagmi'

import { DotLoader } from '@/components/common/Loading'
import { Card } from '@/components/warper'
import { useDebounce, useOdosQuoteSwap, useOdosSwap } from '@/hooks'
import { useSettingState } from '@/stores'
import { Asset, cn } from '@/utils'
import { findAsset } from '@/utils/odos'
import { OrderChart } from './OrderChart'
import { OrderRouting } from './OrderRouting'
import { OrderSetting } from './OrderSetting'
import { OrderToken } from './OrderToken'
import { WalletButton } from '@/components/layout/header'

export const SwapPane = () => {
  // GLOBAL state
  const { address, chainId } = useAccount()
  const { switchChain } = useSwitchChain()
  const { setting } = useSettingState()
  const [searchParams, setSearchParams] = useSearchParams()
  const [fromAsset, setFromAsset] = useState<Asset | null>(null)
  const [toAsset, setToAsset] = useState<Asset | null>(null)

  const fromToken = searchParams.get('from')
  const toToken = searchParams.get('to')

  // CALL API
  const { data: tokenFromBalance } = useBalance({
    token: fromToken ?? '',
    address,
    chainId: bsc.id,
    query: {
      enabled: Boolean(fromToken && address),
    },
  })

  console.log(chainId !== bsc.id)

  const { data: tokenToBalance } = useBalance({
    token: toToken ?? '',
    chainId: bsc.id,
    address,
    query: {
      enabled: Boolean(fromToken && address),
    },
  })

  // LOCAL STATE
  const [fromAmount, setFromAmount] = useState('0')
  const [toAmount, setToAmount] = useState('0')
  const amountA = useDebounce(fromAmount)

  useEffect(() => {
    if (!fromToken) {
      setSearchParams({
        from: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
        to: '0x55d398326f99059ff775485246999027b3197955', //USDT
      })
    }
  }, [fromToken, setSearchParams])

  useEffect(() => {
    const tokenA = findAsset(fromToken)
    if (tokenA) {
      setFromAsset(tokenA)
    }
  }, [fromToken])

  useEffect(() => {
    const tokenB = findAsset(toToken)
    if (tokenB) {
      setToAsset(tokenB)
    }
  }, [toToken])

  // CALL API ODOS
  const { onOdosSwap, pending: isSwapping } = useOdosSwap(true)
  const { data: bestTrade, isLoading: isLoadingOdos } = useOdosQuoteSwap({
    fromAsset,
    toAsset,
    account: address,
    amount: amountA,
    networkId: bsc.id,
    slippage: setting.slippage,
  })

  const handleSwapPosition = () => {
    const [tokenA, tokenB] = [toAsset, fromAsset]

    setFromAsset(tokenA)
    setToAsset(tokenB)

    setSearchParams({
      from: tokenA?.address ?? '',
      to: tokenB?.address ?? '',
    })

    if (bestTrade && toAsset) {
      const amountSwaped = formatUnits(
        BigInt(bestTrade.outAmounts[0]),
        toAsset.decimals,
      )
      setFromAmount(amountSwaped)
    }
  }

  const handleSetAmount = (persent: number) => {
    if (!tokenFromBalance?.value) return

    const balance = (tokenFromBalance.value * BigInt(persent)) / BigInt(100)
    const formated = formatUnits(balance, fromAsset?.decimals ?? 0)

    setFromAmount(formated)
  }

  const handleSetToken = (type: 'from' | 'to', asset: Asset) => {
    if (type === 'from') {
      setFromAmount('0')
      setToAmount('0')

      const newParams = new URLSearchParams(searchParams)
      newParams.set('from', asset.address)
      setSearchParams(newParams)

      setFromAsset(asset)
    } else {
      const newParams = new URLSearchParams(searchParams)
      newParams.set('to', asset.address)
      setSearchParams(newParams)

      setToAsset(asset)
    }
  }

  useEffect(() => {
    if (bestTrade) {
      setToAmount(bestTrade.outValues[0].toString())
    }
  }, [bestTrade])

  return (
    <div className="grid w-full grid-cols-2">
      <Card className="col-span-2 border-focus lg:col-span-1">
        <h4 className="flex items-center justify-between">
          <strong className="text-lighterAccent">Swap</strong>

          <ul className="flex justify-end gap-3">
            {[10, 20, 50, 100].map((number) => {
              return (
                <li key={number}>
                  <button
                    onClick={() => handleSetAmount(number)}
                    className={cn(
                      'px-4 py-2 text-sm rounded border border-focus hover:bg-focus',
                    )}
                  >
                    {number}%
                  </button>
                </li>
              )
            })}
            <OrderSetting />
          </ul>
        </h4>

        <article className="relative mt-10">
          <div
            id="TOKEN-A"
            className={cn(
              'mt-5 space-y-1 rounded-lg border border-focus bg-background p-4',
              'focus-within:border-lighterAccent hover:border-lighterAccent',
            )}
          >
            <div className="flex justify-between">
              <input
                placeholder="0.0"
                type="number"
                value={fromAmount}
                onChange={(e) => {
                  const value = e.target.value
                  setFromAmount(Number(value).toString())
                  if (Number(value) === 0) {
                    setToAmount('0')
                  }
                }}
                className="no-spinner flex-1 bg-transparent text-2xl focus:outline-none"
                style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
              />

              <OrderToken
                handleSetToken={(asset) => handleSetToken('from', asset)}
                asset={fromAsset}
              />
            </div>

            <div className="flex justify-between">
              <p className="text-textSecondary">$0</p>
              <p className="space-x-2 text-textSecondary">
                <span>Balance:</span>

                {tokenFromBalance?.value !== undefined ? (
                  <span>
                    <strong className="mr-1">
                      {formatUnits(
                        tokenFromBalance.value,
                        fromAsset?.decimals ?? 18,
                      )}
                    </strong>
                    {fromAsset?.symbol}
                  </span>
                ) : (
                  <span>--</span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={handleSwapPosition}
            id="SWAP-PANE-A-TO-B"
            className="group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-focus bg-focus p-3 hover:bg-focus"
          >
            <ArrowPathIcon className="animate size-5 hover:stroke-lighterAccent group-hover:rotate-180" />
          </button>

          <div
            id="TOKEN-B"
            className={cn(
              'mt-5 space-y-1 rounded-lg border border-focus bg-background p-4',
              'focus-within:border-lighterAccent hover:border-lighterAccent',
            )}
          >
            <div className="flex justify-between">
              <input
                value={toAmount}
                disabled
                placeholder="0.0"
                type="number"
                className="no-spinner flex-1 bg-transparent text-2xl focus:outline-none"
                style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
              />

              <OrderToken
                handleSetToken={(asset) => handleSetToken('to', asset)}
                asset={toAsset}
              />
            </div>

            <div className="flex justify-between">
              <p className="text-textSecondary">$0</p>
              <p className="space-x-2 text-textSecondary">
                <span>Balance:</span>

                {tokenToBalance?.value !== undefined ? (
                  <span>
                    <strong className="mr-1">
                      {formatUnits(
                        tokenToBalance.value ?? 0n,
                        toAsset?.decimals ?? 18,
                      )}
                    </strong>
                    {toAsset?.symbol}
                  </span>
                ) : (
                  <span>--</span>
                )}
              </p>
            </div>
          </div>
        </article>

        <article id="BUTTON_GROUP">
          <button
            className={cn(
              'mt-5 h-10 w-full rounded-lg bg-accent hover:bg-lighterAccent',
              chainId !== bsc.id ? 'hidden' : 'flex-center',
              {
                'bg-focus': isSwapping || !bestTrade,
              },
            )}
            onClick={() => {
              if (!fromAsset || !toAsset || !bestTrade) return

              onOdosSwap({
                fromAsset,
                toAsset,
                fromAmount,
                quote: bestTrade,
              })
            }}
            disabled={!bestTrade || isSwapping}
          >
            {isSwapping || isLoadingOdos ? (
              <DotLoader className="bg-accent" />
            ) : (
              'Swap'
            )}
          </button>

          <WalletButton className={cn('w-full mt-5', chainId && 'hidden')} />

          <button
            onClick={() => {
              switchChain({ chainId: bsc.id })
            }}
            className={cn(
              'mt-5 h-10 w-full rounded-lg bg-accent hover:bg-lighterAccent',
              {
                hidden: !chainId || chainId === bsc.id,
              },
            )}
          >
            Connect to BSC
          </button>
        </article>

        {bestTrade && (
          <ul className="mt-5 space-y-3 text-sm text-textSecondary">
            <li className="flex justify-between">
              <span>Rate</span>
              <span>
                {Number(
                  BigInt(bestTrade.outAmounts[0] ?? 0n) /
                    BigInt(bestTrade.inAmounts[0] ?? 0n),
                )}{' '}
                {toAsset?.symbol} per {fromAsset?.symbol}
              </span>
            </li>

            <li className="flex justify-between">
              <span>Network cost</span>
              <span>{bestTrade.gasEstimate} gwei</span>
            </li>

            <li className="flex justify-between">
              <span>Order routing</span>
              <a
                className="text-lighterAccent underline"
                href="https://www.odos.xyz/"
              >
                Odos
              </a>
            </li>

            <li className="flex justify-between">
              <span>Price impact</span>
              <span>
                {Number(bestTrade.priceImpact ?? 0) > 0.001
                  ? bestTrade?.priceImpact
                  : '< 0.001%'}
              </span>
            </li>
          </ul>
        )}
      </Card>

      <OrderChart
        fromAsset={fromAsset}
        toAsset={toAsset}
        className={cn('hidden lg:block lg:col-span-1', {
          hidden: !fromAsset || !toAsset,
        })}
        symbol={'BNBUSDT'}
      />

      <OrderRouting
        fromAmount={fromAmount}
        toAmount={toAmount}
        fromAsset={fromAsset}
        toAsset={toAsset}
        bestTrade={bestTrade}
        isLoadingOdos={isLoadingOdos}
      />
    </div>
  )
}
