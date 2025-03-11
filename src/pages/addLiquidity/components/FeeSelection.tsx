import { Button } from '@/components/ui/button'
import { useMintState } from '@/stores'
import { cn } from '@/utils'
import { FeeAmount } from '@uniswap/v3-sdk'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const feesTier = [
  {
    title: 'Best for very stable pairs.',
    value: FeeAmount.LOWEST,
  },
  {
    title: 'Best for stable pairs.',
    value: FeeAmount.LOW,
  },
  {
    title: 'Best for most pairs.',
    value: FeeAmount.MEDIUM,
  },
  {
    title: 'Best for exotic pairs.',
    value: FeeAmount.HIGH,
  },
]

export const FeeSelection = () => {
  const [show, setShow] = useState(true)
  const { fee, updateFee } = useMintState()

  return (
    <article>
      <h2 className="text-lg font-semibold">Fee tier</h2>
      <p className="text-sm font-light text-textSecondary">
        The amount earned providing liquidity. Choose an amount that suits your
        risk tolerance and strategy.
      </p>
      <div className="mt-4 flex items-center justify-between rounded-md bg-focus p-2">
        <p className="text-sm">
          <span>{fee / 10000}% fee tier</span>
          {/* <span className="mx-3 rounded-md bg-background px-2 py-1 text-xs"> */}
          {/*   Highest TVL */}
          {/* </span> */}
          <i className="mt-2 block text-textSecondary">
            The % you will earn in fees
          </i>
        </p>
        <Button onClick={() => setShow(!show)} className="rounded-md">
          {show ? 'Less' : 'More'}
          <ChevronDown className={cn('size-5', show && 'rotate-180')} />
        </Button>
      </div>

      <ul className={cn('mt-2 w-full flex gap-2', !show && 'hidden')}>
        {feesTier.map(({ title, value }) => (
          <li
            key={value}
            className={cn(
              'mb-2 border w-full rounded-md bg-focus cursor-pointer opacity-50 p-2',
              fee === value && 'border-accent opacity-100',
            )}
            onClick={() => updateFee(value)}
          >
            <p className="text-sm">{value / 10000}%</p>
            <p className="mt-1 text-xs text-textSecondary">{title}</p>
          </li>
        ))}
      </ul>
    </article>
  )
}
