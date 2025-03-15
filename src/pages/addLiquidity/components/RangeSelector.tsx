import { Button } from '@/components/ui/button'
import { MintInfo, useRangeHopCallbacks } from '@/hooks'
import { Bound, FIELD, useMintState } from '@/stores'
import { cn } from '@/utils'
import { FeeAmount, Pool } from '@uniswap/v3-sdk'
import { ArrowRightLeft, Minus, Plus } from 'lucide-react'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

type Props = {
  pool: Pool | null
  mintInfo: MintInfo
}
export const RangeSelector = ({ pool, mintInfo }: Props) => {
  const {
    fee,
    asset0,
    asset1,
    updateTypedValue,
    handleSetToken,
    updateLeftRangeInput: onLeftRangeInput,
    updateRightRangeInput: onRightRangeInput,
  } = useMintState()

  const { tokenA, tokenB, price, isInvert, ticksAtLimit } = mintInfo

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = useMemo(
    () => mintInfo.ticks,
    [mintInfo],
  )

  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = useMemo(
    () => mintInfo.pricesAtTicks,
    [mintInfo],
  )

  const currentPrice = useMemo(() => {
    if (!price) return
    try {
      return isInvert ? price.toSignificant(5) : price.invert().toSignificant(5)
    } catch (error) {
      console.log(error)
    }
  }, [isInvert, price])

  // const leftPrice = useMemo(
  //   () => (isInvert ? priceLower : priceUpper?.invert()),
  //   [isInvert, priceLower, priceUpper],
  // )
  //
  // const rightPrice = useMemo(
  //   () => (isInvert ? priceUpper : priceLower?.invert()),
  //   [isInvert, priceUpper, priceLower],
  // )

  // const tokenA = (currencyA ?? undefined)?.wrapped
  // const tokenB = (currencyB ?? undefined)?.wrapped
  // const isSorted = tokenA && tokenB && tokenA.sortsBefore(tokenB)

  const leftPrice = isInvert ? priceLower : priceUpper?.invert()
  const rightPrice = isInvert ? priceUpper : priceLower?.invert()

  const {
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
  } = useRangeHopCallbacks({
    baseCurrency: tokenA,
    quoteCurrency: tokenB,
    feeAmount: fee,
    tickLower,
    tickUpper,
    pool,
  })

  const handleSwap = () => {
    const _asset0 = asset0
    handleSetToken('asset0', asset1)
    handleSetToken('asset1', _asset0)
    updateTypedValue('0', FIELD.CURRENCY_A)
  }

  return (
    <article>
      <h2 className="mb-4 text-lg font-semibold">Price Range</h2>

      <div className="mb-4 flex gap-4">
        <StepCounter
          title="Min Price"
          value={
            ticksAtLimit[isInvert ? Bound.LOWER : Bound.UPPER]
              ? '0'
              : leftPrice?.toSignificant(8) ?? ''
          }
          onUserInput={onLeftRangeInput}
          decrement={isInvert ? getDecrementLower : getIncrementUpper}
          increment={isInvert ? getIncrementLower : getDecrementUpper}
          decrementDisabled={
            leftPrice === undefined ||
            ticksAtLimit[isInvert ? Bound.LOWER : Bound.UPPER]
          }
          incrementDisabled={
            leftPrice === undefined ||
            ticksAtLimit[isInvert ? Bound.LOWER : Bound.UPPER]
          }
          feeAmount={fee}
          label={leftPrice ? `${tokenB?.symbol}` : '-'}
          tokenA={tokenA?.symbol}
          tokenB={tokenB?.symbol}
        />

        <div
          onClick={handleSwap}
          className="flex items-center justify-center rounded-lg p-2 hover:bg-focus"
        >
          <ArrowRightLeft className="size-6" />
        </div>

        <StepCounter
          title="Max Price"
          value={
            ticksAtLimit[isInvert ? Bound.UPPER : Bound.LOWER]
              ? '∞'
              : rightPrice?.toSignificant(8) ?? ''
          }
          onUserInput={onRightRangeInput}
          decrement={isInvert ? getDecrementUpper : getIncrementLower}
          increment={isInvert ? getIncrementUpper : getDecrementLower}
          incrementDisabled={
            rightPrice === undefined ||
            ticksAtLimit[isInvert ? Bound.UPPER : Bound.LOWER]
          }
          decrementDisabled={
            rightPrice === undefined ||
            ticksAtLimit[isInvert ? Bound.UPPER : Bound.LOWER]
          }
          feeAmount={fee}
          label={rightPrice ? `${tokenB?.symbol}` : '-'}
          tokenA={tokenB?.symbol}
          tokenB={tokenB?.symbol}
        />
      </div>

      <div className="mb-4 text-center">
        <p className="space-x-2 text-sm text-textSecondary">
          <span>Current Price:</span>
          <strong className="text-primary">{currentPrice}</strong>
          <span>
            {asset0?.symbol} per {asset1?.symbol}
          </span>
        </p>
      </div>
    </article>
  )
}

interface StepCounterProps {
  value: string
  onUserInput: (_value: string) => void
  decrement: () => string
  increment: () => string
  decrementDisabled?: boolean
  incrementDisabled?: boolean
  feeAmount?: FeeAmount
  label?: string
  locked?: boolean // disable input
  title: ReactNode
  tokenA?: string
  tokenB?: string
}

const StepCounter = ({
  value,
  decrementDisabled = false,
  incrementDisabled = false,
  locked,
  title,
  tokenA,
  tokenB,
  decrement,
  increment,
  onUserInput,
}: StepCounterProps) => {
  //  for focus state, styled components doesnt let you select input parent container
  const [, setActive] = useState(false)
  // animation if parent value updates local value
  const [, setPulsing] = useState<boolean>(false)

  // let user type value and only update parent value on blur
  const [localValue, setLocalValue] = useState('')
  const [useLocalValue, setUseLocalValue] = useState(false)

  const handleOnFocus = () => {
    setUseLocalValue(true)
    setActive(true)
  }

  const handleOnBlur = useCallback(() => {
    setUseLocalValue(false)
    setActive(false)
    onUserInput(localValue) // trigger update on parent value
  }, [localValue, onUserInput])

  // for button clicks
  const handleDecrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(decrement())
  }, [decrement, onUserInput])

  const handleIncrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(increment())
  }, [increment, onUserInput])

  useEffect(() => {
    if (localValue !== value && !useLocalValue) {
      setTimeout(() => {
        setLocalValue(value)
        setPulsing(true)
        setTimeout(function () {
          setPulsing(false)
        }, 1800)
      }, 0)
    }
  }, [localValue, useLocalValue, value])

  return (
    <div className={cn('rounded-lg bg-focus p-4 w-full')}>
      <label className="mb-2 block text-sm font-medium text-textSecondary">
        {title}
      </label>
      <div className="relative flex items-center space-x-2">
        <input
          disabled={locked}
          onFocus={handleOnFocus}
          onBlur={() => handleOnBlur()}
          className="w-full rounded bg-focus text-xl text-white"
          type="text"
          value={localValue}
          onChange={(e) => {
            setLocalValue(e.target.value.replace(/,/g, '.'))
          }}
        />
        <div className="absolute right-5 flex flex-col">
          <Button
            disabled={incrementDisabled}
            onClick={() => handleIncrement()}
            variant="ghost"
            className="size-5 p-4"
          >
            <Plus className="size-5" />
          </Button>
          <Button
            disabled={decrementDisabled}
            onClick={() => handleDecrement()}
            variant="ghost"
            className="size-5 p-4"
          >
            <Minus className="size-5" />
          </Button>
        </div>
      </div>
      <p className="mt-2 text-sm text-textSecondary">
        {tokenA} per {tokenB}
      </p>
    </div>
  )
}
