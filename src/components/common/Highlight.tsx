import { cn } from '@/utils'
import { InfoIcon } from 'lucide-react'

export function Highlight({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="relative inline-flex size-12 items-center justify-center rounded-lg border border-white/10  bg-white/5  p-1.5">
      <div
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-md bg-neutral-600 shadow',
          className,
        )}
      >
        <InfoIcon className="absolute top-[18px] h-10 w-20 rounded-full blur-md" />
        {children}
      </div>
    </div>
  )
}
