import { ArrowPathIcon } from '@heroicons/react/16/solid'
import { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Address, formatUnits, isAddress, zeroAddress } from 'viem'
import { bsc } from 'viem/chains'
import { useAccount, useBalance, useSwitchChain } from 'wagmi'

import { DotLoader } from '@/components/common/Loading'
import { WalletButton } from '@/components/layout/header'
import { Card } from '@/components/warper'
import { useDebounce, useOdosQuoteSwap, useOdosSwap } from '@/hooks'
import { AssetsContext } from '@/hooks/useAssets'
import { useSettingState } from '@/stores'
import { Asset, cn, supportedChain } from '@/utils'
import { getTopAssets } from '@/utils/assets'
import { findAsset } from '@/utils/odos'
import { OrderChart } from './OrderChart'
import { OrderInput } from './OrderInput'
import { OrderRouting } from './OrderRouting'
import { OrderSetting } from './OrderSetting'

export const SwapPane = () => {
  // GLOBAL state
  const { address: account, chainId = 56 } = useAccount()
  const { listTokens } = useContext(AssetsContext)
  const { switchChain } = useSwitchChain()
  const { setting } = useSettingState()
  const [searchParams, setSearchParams] = useSearchParams()
  const [fromAsset, setFromAsset] = useState<Asset | null>(null)
  const [toAsset, setToAsset] = useState<Asset | null>(null)
  const topAssets = getTopAssets(chainId)
  const isSupport = Boolean(supportedChain.find((c) => c.id === chainId))

  const fromToken = searchParams.get('from') ?? ''
  const toToken = searchParams.get('to') ?? ''

  // CALL API
  const { data: tokenFromBalance } = useBalance({
    token: fromToken === zeroAddress ? undefined : (fromToken as Address),
    address: account,
    query: {
      enabled: isAddress(fromToken) && Boolean(account),
    },
  })

  const { data: tokenToBalance } = useBalance({
    token: toToken === zeroAddress ? undefined : (toToken as Address),
    address: account,
    query: {
      enabled: isAddress(toToken) && Boolean(account),
    },
  })

  // LOCAL STATE
  const [fromAmount, setFromAmount] = useState('0')
  const [toAmount, setToAmount] = useState('0')
  const amountA = useDebounce(fromAmount)

  useEffect(() => {
    if (!fromToken) {
      setSearchParams({
        from: zeroAddress,
        to: topAssets.at(-1)?.address ?? '',
      })
    }
  }, [fromToken, setSearchParams, topAssets])

  useEffect(() => {
    const tokenA = findAsset(fromToken, listTokens)
    if (tokenA) {
      setFromAsset(tokenA)
    }
  }, [fromToken, listTokens])

  useEffect(() => {
    const tokenB = findAsset(toToken, listTokens)
    if (tokenB) {
      setToAsset(tokenB)
    }
  }, [listTokens, toToken])

  // CALL API ODOS
  const { onOdosSwap, pending: isSwapping } = useOdosSwap(true)
  const { data: bestTrade, isLoading: isLoadingOdos } = useOdosQuoteSwap({
    fromAsset,
    toAsset,
    account: account,
    amount: amountA,
    chainId,
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

    setFromAmount('0')
    setToAmount('0')
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
    <div className="grid w-full grid-cols-5">
      <Card className="col-span-5 border-focus lg:col-span-2">
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
          <OrderInput
            type="from"
            amount={fromAmount}
            asset={fromAsset}
            balance={tokenFromBalance?.value}
            setToAmount={setToAmount}
            setFromAmount={setFromAmount}
            handleSetToken={handleSetToken}
          />

          <button
            onClick={handleSwapPosition}
            id="SWAP-PANE-A-TO-B"
            className="group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-focus bg-focus p-3 hover:bg-focus"
          >
            <ArrowPathIcon className="animate size-5 hover:stroke-lighterAccent group-hover:rotate-180" />
          </button>

          <OrderInput
            type="to"
            amount={toAmount}
            asset={toAsset}
            balance={tokenToBalance?.value}
            setToAmount={setToAmount}
            setFromAmount={setFromAmount}
            handleSetToken={handleSetToken}
          />
        </article>

        <article id="BUTTON_GROUP">
          <button
            className={cn(
              'mt-5 h-10 w-full rounded-lg bg-accent hover:bg-lighterAccent',
              isSupport ? 'flex-center' : 'hidden',
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
                hidden: !chainId || isSupport,
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
        className={cn('hidden lg:block lg:col-span-3', {
          hidden: !fromAsset || !toAsset,
        })}
        symbol={'BNBUSDT'}
      />

      <OrderRouting
        className={cn('col-span-5 border-focus')}
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
