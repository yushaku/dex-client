import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/common'
import { useAddLiquidity, useGetGetMintInfo, useToken } from '@/hooks'
import { Field, useMintState } from '@/stores'
import { cn, isInvalidAmount } from '@/utils'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { TriangleAlert } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'
import { FeeSelection } from './components/FeeSelection'
import { InputTokenAmount } from './components/InputTokenAmount'
import { PairSelection } from './components/PairSelection'
import { PresetRanges } from './components/PresetRanges'
import { RangeSelector } from './components/RangeSelector'

export const AddLiquidity = () => {
  const { address: account } = useAccount()
  const {
    asset0,
    asset1,
    preset,
    independentField,
    typedValue,
    updateLeftRangeInput,
    updateRightRangeInput,
    updateTypedValue,
  } = useMintState()

  const baseCurrency = useToken(asset0?.address)
  const quoteCurrency = useToken(asset1?.address)

  const mintInfo = useGetGetMintInfo({
    currencyA: baseCurrency,
    currencyB: quoteCurrency,
    baseCurrency,
  })
  const { addLiquidity } = useAddLiquidity()
  const { pool, tokenB, tokenA, poolAddress, price, isInvert } = mintInfo

  const currentPrice = useMemo(() => {
    if (!price) return
    return isInvert ? price.invert().toSignificant(5) : price.toSignificant(5)
  }, [isInvert, price])

  useEffect(() => {
    if (!currentPrice) return
    updateLeftRangeInput(
      preset ? String(Number(currentPrice) * preset.min) : '',
    )

    updateRightRangeInput(
      preset ? String(Number(currentPrice) * preset.max) : '',
    )
  }, [preset, currentPrice, updateLeftRangeInput, updateRightRangeInput])

  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
      [mintInfo.dependentField]:
        mintInfo.parsedAmounts[mintInfo.dependentField]?.toExact() ?? '',
    }),
    [
      independentField,
      mintInfo.dependentField,
      mintInfo.parsedAmounts,
      typedValue,
    ],
  )

  const amountA = formattedAmounts[Field.CURRENCY_A]
  const amountB = formattedAmounts[Field.CURRENCY_B]
  function handleAddLiquidity() {
    if (!account || !tokenA || !tokenB) {
      toast.error('Please connect wallet')
      return
    }

    addLiquidity({
      tokenA,
      tokenB,
      amountA,
      amountB,
      mintInfo,
      callback: () => {
        toast.info('Success')
      },
    })
  }

  return (
    <div className="container mx-auto flex min-h-[80dvh] flex-col justify-center p-4">
      <div className="flex flex-col justify-center gap-6 lg:flex-row">
        <Card
          className={cn('w-full lg:w-1/2 space-y-4 rounded-lg bg-layer p-6')}
        >
          <Button className="rounded-md px-4 py-2">
            V3 position
            <ChevronDownIcon className="size-5" />
          </Button>

          <PairSelection />
          <FeeSelection />

          <Alert
            variant="warning"
            className={cn('space-y-2', pool && 'hidden')}
          >
            <TriangleAlert className="size-8 stroke-yellow-500" />
            <AlertTitle className="ml-3">Creating new pool</AlertTitle>
            <AlertDescription className="ml-3">
              Your selections will create a new liquidity pool which may result
              in lower initial liquidity and increased volatility. Consider
              adding to an existing pool to minimize these risks.
            </AlertDescription>
          </Alert>
        </Card>

        <Card
          className={cn(
            'space-y-4 w-full lg:w-1/2 rounded-lg p-6',
            !poolAddress && 'hidden',
          )}
        >
          <PresetRanges />

          <div className="rounded-lg">
            <RangeSelector pool={pool} mintInfo={mintInfo} />

            <div className="flex flex-col gap-2">
              <InputTokenAmount
                title="Asset 1"
                token={tokenA}
                value={formattedAmounts[Field.CURRENCY_A]}
                handleInput={(amount) =>
                  updateTypedValue(amount, Field.CURRENCY_A)
                }
                // locked={mintInfo.depositADisabled}
              />
              <InputTokenAmount
                title="Asset 2"
                token={tokenB}
                value={formattedAmounts[Field.CURRENCY_B]}
                handleInput={(amount) =>
                  updateTypedValue(amount, Field.CURRENCY_B)
                }
                // locked={mintInfo.depositBDisabled}
              />
            </div>

            <div className="mt-5">
              {account ? (
                <Button
                  onClick={handleAddLiquidity}
                  className="w-full text-white"
                  disabled={
                    isInvalidAmount(amountA) || isInvalidAmount(amountB)
                  }
                >
                  {pool ? 'Add Liquidity' : 'Create new Pool & add liquidity'}
                </Button>
              ) : (
                <Button className="w-full text-white">Connect Wallet</Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
