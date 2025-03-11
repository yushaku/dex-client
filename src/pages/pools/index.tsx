import { Card } from '@/components/warper'
import { useUniswapPositions } from '@/hooks/uni/usePositionV3'
import { ManualPosition } from './components/ManualPosition'

export const Pools = () => {
  const positions = useUniswapPositions()

  return (
    <article className="space-y-8">
      <div className="flex-1">
        <h4 className="mb-5 text-xl">Your Positions</h4>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {positions.map((position) => {
            return (
              <li key={position.tokenId}>
                <ManualPosition position={position} />
              </li>
            )
          })}
        </ul>
      </div>

      <Card className="flex-1">
        <h4 className="text-xl">Top Pools</h4>
      </Card>
    </article>
  )
}
