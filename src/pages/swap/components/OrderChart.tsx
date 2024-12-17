import { Asset, cn } from '@/utils'
import React, { useMemo } from 'react'
import { AdvancedRealTimeChart, MiniChart } from 'react-ts-tradingview-widgets'

type Pops = {
  symbol: string
  fromAsset: Asset | null
  toAsset: Asset | null
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

export const OrderChart = ({
  fromAsset,
  toAsset,
  className,
  ...props
}: Pops) => {
  const [isMini, setisMini] = React.useState(true)

  const symbol = useMemo(() => {
    if (fromAsset === null || toAsset === null) return

    const symbol1 = fromAsset.name.includes('Wrapped')
      ? fromAsset.symbol.replace('W', '')
      : fromAsset.symbol

    const symbol2 = toAsset.name.includes('Wrapped')
      ? toAsset.symbol.replace('W', '')
      : toAsset.symbol

    return `${symbol1}${symbol2}`
  }, [fromAsset, toAsset])

  return (
    <div className={cn('relative', className)} {...props}>
      <div className="absolute right-0 top-2 z-50 text-xs">
        <button
          className={cn(
            'bg-focus p-2 rounded-md',
            isMini && 'bg-lighterAccent',
          )}
          onClick={() => setisMini(true)}
        >
          Mini Chart
        </button>
        <button
          className={cn(
            'bg-focus p-2 rounded-md',
            !isMini && 'bg-lighterAccent',
          )}
          onClick={() => setisMini(false)}
        >
          Candle Chart
        </button>
      </div>

      {isMini ? (
        <MiniChart
          symbol={symbol}
          width="100%"
          colorTheme="dark"
          height="100%"
        />
      ) : (
        <AdvancedRealTimeChart
          symbol={symbol}
          theme="dark"
          interval="D"
          calendar={false}
          hide_top_toolbar={false}
          hide_side_toolbar={true}
          hide_legend={true}
          withdateranges={true}
          allow_symbol_change={false}
          save_image={false}
          autosize
        />
      )}
    </div>
  )
}
