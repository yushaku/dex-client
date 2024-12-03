import { cn } from '@/utils'

export const EmptyBox = ({ isShow }: { isShow: boolean }) => {
  return (
    <div
      className={cn(
        'hidden w-full h-[80dvh] flex-col',
        isShow && 'flex-center'
      )}
    >
      <img className="w-96" src="/catinbox.gif" alt="empty" />
      <h5 className="mt-5 text-xl text-lighterAccent">It's empty here</h5>
    </div>
  )
}
