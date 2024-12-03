import { cn } from '@/utils'

type Props = {
  listFeature: Array<string>
  isSelected: boolean
  handleClick: (_select: string) => void
}

export const SelectionTab = ({
  listFeature,
  isSelected,
  handleClick
}: Props) => {
  return (
    <div className="flex w-fit rounded-lg border-4 border-layer bg-layer">
      {listFeature.map((feat, index) => {
        return (
          <button
            key={index}
            className={cn(
              'rounded-lg px-8 py-3',
              isSelected && 'bg-background'
            )}
            onClick={() => handleClick(feat)}
          >
            {feat}
          </button>
        )
      })}
    </div>
  )
}
