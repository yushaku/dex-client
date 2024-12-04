import { Asset } from '@/utils'
import { useMemo } from 'react'
import { MiniChart } from 'react-ts-tradingview-widgets'

type Pops = {
  symbol: string
  fromAsset: Asset | null
  toAsset: Asset | null
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

export const OrderChart = ({ fromAsset, toAsset, ...props }: Pops) => {
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
    <div {...props}>
      <MiniChart symbol={symbol} width="100%" colorTheme="dark" height="100%" />
    </div>
  )
}
