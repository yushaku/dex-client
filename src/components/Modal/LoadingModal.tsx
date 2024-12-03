import { cn } from '@/utils'

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  title?: string
  isShow: boolean
}

export const LoadingModal = ({
  isShow,
  className,
  title = 'Loading...'
}: Props) => {
  return (
    <div
      className={cn(
        'fixed inset-0 w-screen items-center justify-center p-2 z-50',
        'bg-gray-500/30 hidden',
        isShow && 'flex',
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <img src="/catRunning.gif" alt="loading" className="w-40 rounded-xl" />
        <p>{title}</p>
      </div>
    </div>
  )
}
