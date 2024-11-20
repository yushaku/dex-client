// import { Card } from '@/components/warper/Card'
import { MiniChart } from 'react-ts-tradingview-widgets'

export const OrderChart = ({
  symbol = 'BNBUSDT',
  ...props
}: { symbol: string } & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => {
  return (
    <div {...props}>
      <MiniChart symbol={symbol} width="100%" colorTheme="dark" height="100%" />
    </div>
  )
}
