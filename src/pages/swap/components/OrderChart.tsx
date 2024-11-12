import { Card } from '@/components/warper/Card'
import { MiniChart } from 'react-ts-tradingview-widgets'

export const OrderChart = () => {
  return (
    <Card className="col-span-1 py-4">
      <h4 className="mb-5 text-lg font-bold text-lighterAccent">Toke Chart</h4>

      <MiniChart symbol="BNBUSDT" width="100%" colorTheme="dark" height="90%" />
    </Card>
  )
}
