import { cn, UNKNOWN_TOKEN } from '@/utils'

type Props = {
  className?: {
    default?: string
    image?: string
  }
  logo1?: string
  logo2?: string
}
export const IconGroup = ({ className, logo1, logo2 }: Props) => {
  return (
    <div className={cn('flex items-center -space-x-2', className?.default)}>
      <img
        className={cn(
          'size-8 rounded-full outline outline-2 outline-[#1C2027]',
          className?.image,
        )}
        src={logo1 ?? UNKNOWN_TOKEN}
        alt="First Logo"
      />
      <img
        className={cn(
          'z-1 rounded-full size-8 outline outline-2 outline-[#1C2027]',
          className?.image,
        )}
        src={logo2 ?? UNKNOWN_TOKEN}
        alt="Second Logo"
      />
    </div>
  )
}
