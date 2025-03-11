import { Button } from '@/components/ui/button'
import { MintInfo, useRangeHopCallbacks } from '@/hooks'
import { Bound, FIELD, useMintState } from '@/stores'
import { cn } from '@/utils'
import { Pool } from '@uniswap/v3-sdk'
import { ArrowRightLeft } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

type Props = {
  pool: Pool | null
  mintInfo: MintInfo
}
export const RangeSelector = ({ pool, mintInfo }: Props) => {
  const {
    fee,
    preset,
    asset0,
    asset1,
    updateTypedValue,
    handleSetToken,
    updateLeftRangeInput,
    updateRightRangeInput,
  } = useMintState()
  const [localvalue, setLocalValue] = useState({
    [Bound.LOWER]: '',
    [Bound.UPPER]: '',
  })
  const { tokenA, tokenB, price, isInvert } = mintInfo

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
      console.log({
        price,
      })
    }
  }, [isInvert, price])

  const leftPrice = useMemo(
    () => (isInvert ? priceLower : priceUpper?.invert()),
    [isInvert, priceLower, priceUpper],
  )

  const rightPrice = useMemo(
    () => (isInvert ? priceUpper : priceLower?.invert()),
    [isInvert, priceUpper, priceLower],
  )

  const {
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
  } = useRangeHopCallbacks({
    baseToken: tokenA,
    quoteToken: tokenB,
    feeAmount: fee,
    tickLower,
    tickUpper,
    pool,
  })

  // const enforcer = (nextUserInput) => {
  //   if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
  //     setLocalTokenValue(nextUserInput.trim())
  //     dispatch(updateSelectedPreset({ preset: null }))
  //   }
  // }
  const handleOnChange = useCallback(
    (type: keyof typeof Bound, value: string) => {
      setLocalValue((prev) => ({
        ...prev,
        [type]: value,
      }))
    },
    [],
  )

  const handleOnBlur = useCallback(
    (type: keyof typeof Bound) => {
      if (type === Bound.LOWER) {
        updateLeftRangeInput(localvalue[Bound.LOWER])
      }

      if (type === Bound.UPPER) {
        updateRightRangeInput(localvalue[Bound.UPPER])
      }
    },
    [localvalue, updateLeftRangeInput, updateRightRangeInput],
  )

  const handleDecrement = useCallback(
    (type: keyof typeof Bound) => {
      if (type === Bound.LOWER) {
        const data = isInvert ? getDecrementUpper() : getIncrementLower()
        updateLeftRangeInput(data)
      }

      if (type === Bound.UPPER) {
        const data = isInvert ? getIncrementUpper() : getDecrementLower()
        updateRightRangeInput(data)
      }
    },
    [
      isInvert,
      getDecrementUpper,
      getIncrementLower,
      updateLeftRangeInput,
      getDecrementLower,
      getIncrementUpper,
      updateRightRangeInput,
    ],
  )

  const handleIncrement = useCallback(
    (type: keyof typeof Bound) => {
      if (type === Bound.LOWER) {
        const data = isInvert ? getDecrementUpper() : getIncrementLower()
        updateLeftRangeInput(data)
      }

      if (type === Bound.UPPER) {
        const data = isInvert ? getDecrementLower() : getIncrementUpper()
        updateRightRangeInput(data)
      }
    },
    [
      isInvert,
      getDecrementLower,
      getDecrementUpper,
      getIncrementLower,
      getIncrementUpper,
      updateLeftRangeInput,
      updateRightRangeInput,
    ],
  )

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
        <div
          className={cn('rounded-lg bg-focus p-4 w-full', !pool && 'hidden')}
        >
          <label className="mb-2 block text-sm font-medium text-textSecondary">
            Min Price
          </label>
          <div className="relative flex items-center space-x-2">
            <input
              className="w-full rounded bg-focus text-xl text-white"
              type="text"
              onBlur={() => handleOnBlur(Bound.UPPER)}
              value={preset.type === 'FULL' ? '0' : leftPrice?.toSignificant(6)}
              onChange={(e) => {
                handleOnChange(Bound.LOWER, e.target.value.replace(/,/g, '.'))
              }}
            />
            <div className="absolute right-5 flex flex-col">
              <Button
                onClick={() => handleIncrement(Bound.LOWER)}
                variant="ghost"
                className="size-5 p-4"
              >
                +
              </Button>
              <Button
                onClick={() => handleDecrement(Bound.LOWER)}
                variant="ghost"
                className="size-5 p-4"
              >
                -
              </Button>
            </div>
          </div>
          <p className="mt-2 text-sm text-textSecondary">
            {asset0?.symbol} per {asset1?.symbol}
          </p>
        </div>

        <div
          onClick={handleSwap}
          className="flex items-center justify-center rounded-lg p-2 hover:bg-focus"
        >
          <ArrowRightLeft className="size-6" />
        </div>

        <div
          className={cn('rounded-lg bg-focus p-4 w-full', !pool && 'hidden')}
        >
          <label className="mb-2 block text-sm font-medium text-textSecondary">
            Max Price
          </label>
          <div className="relative flex items-center space-x-2">
            <input
              onBlur={() => handleOnBlur(Bound.UPPER)}
              className="w-full rounded bg-focus text-xl text-white"
              type="text"
              value={
                preset.type === 'FULL' ? '∞' : rightPrice?.toSignificant(6)
              }
              onChange={(e) => {
                handleOnChange(Bound.UPPER, e.target.value.replace(/,/g, '.'))
              }}
            />
            <div className="absolute right-5 flex flex-col">
              <Button
                onClick={() => handleIncrement(Bound.UPPER)}
                variant="ghost"
                className="size-5 p-4"
              >
                +
              </Button>
              <Button
                onClick={() => handleDecrement(Bound.UPPER)}
                variant="ghost"
                className="size-5 p-4"
              >
                -
              </Button>
            </div>
          </div>
          <p className="mt-2 text-sm text-textSecondary">
            {asset0?.symbol} per {asset1?.symbol}
          </p>
        </div>
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
