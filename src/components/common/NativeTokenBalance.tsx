import { Address } from 'viem'
import { useBalance, useChainId } from 'wagmi'
import { BSC, ETH, Matic } from '../icons'
import { cn } from '@/utils'

export const NativeBalance = ({ address }: { address?: Address }) => {
  const balance = useBalance({ address })

  return (
    <div className="font-bold">
      {balance.data?.formatted.slice(0, 5)}
      <NativeToken />
    </div>
  )
}

export const NativeToken = ({
  className,
  ...rest
}: React.SVGProps<SVGSVGElement>) => {
  const chainId: number = useChainId()
  let Token: (_props: React.SVGProps<SVGSVGElement>) => JSX.Element

  switch (chainId) {
    case 1:
    case 5:
      Token = ETH
      break

    case 80001:
      Token = Matic
      break

    case 97:
      Token = BSC
      break

    default:
      Token = ETH
      break
  }

  return (
    <Token className={cn('ml-3 inline-block size-5', className)} {...rest} />
  )
}
