import { Card } from '@/components/common'
import { OdosData } from '@/hooks'
import { Asset, cn } from '@/utils'

type Props = {
  fromAmount: string
  toAmount: string
  fromAsset?: Asset | null
  toAsset?: Asset | null
  bestTrade?: OdosData
  isLoadingOdos: boolean
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>
export const OrderRouting = ({
  fromAmount,
  toAmount,
  fromAsset,
  toAsset,
  bestTrade,
  isLoadingOdos,
  ...props
}: Props) => {
  return (
    <Card {...props}>
      <h4 className="mx-10 text-lg font-bold text-lighterAccent">
        Order Routing
      </h4>

      <article className="mx-10 mt-10 flex justify-between">
        <div className="flex w-fit flex-1 items-center gap-1">
          <img src={fromAsset?.logoURI} className="size-5" alt="from token" />
          <strong>{fromAmount}</strong>
          <span>{fromAsset?.symbol}</span>
        </div>

        <div className="flex w-fit items-center gap-1">
          <img src={toAsset?.logoURI} className="size-5" alt="from token" />
          <strong>{toAmount}</strong>
          <span>{toAsset?.symbol}</span>
        </div>
      </article>

      {isLoadingOdos ? (
        <div className="mx-10 mt-5 h-52 animate-pulse rounded-lg bg-focus"></div>
      ) : (
        <img
          className={cn('w-full', bestTrade?.pathVizImage ? 'block' : 'hidden')}
          src={bestTrade?.pathVizImage}
          alt="best trade"
        />
      )}
    </Card>
  )
}
