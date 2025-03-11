import { listRanges, useMintState } from '@/stores'
import { cn } from '@/utils'

export const PresetRanges = () => {
  const { selectPreset, preset } = useMintState()

  return (
    <article>
      <h2 className="mb-3 text-lg font-semibold">Range Type</h2>

      <div className="flex w-full rounded-lg border-4 border-background bg-background">
        {listRanges.map((feat) => {
          return (
            <button
              key={feat.title}
              className={cn(
                'w-full rounded-lg px-8 py-2 text-sm',
                preset.type === feat.type && 'bg-focus',
              )}
              onClick={() => selectPreset(feat)}
            >
              {feat.title}
            </button>
          )
        })}
      </div>
    </article>
  )
}
