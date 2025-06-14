/* eslint-disable @typescript-eslint/no-explicit-any */
import { BSC, USDT } from '@/components/icons'
import { cn } from '@/utils'
import { zeroAddress } from 'viem'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const SelectPayToken = ({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: any
}) => {
  const selectedtoken =
    tokenList.find(({ address }) => address === selected) ?? tokenList[0]
  const Logo = selectedtoken.logo

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex-center gap-3 rounded-xl border border-gray-700 bg-layer px-6 py-3 text-sm font-semibold hover:bg-focus outline-none">
        <h6 className="flex gap-2 text-text-secondary">
          <Logo className="size-5" />
          <span className="hidden md:inline">{selectedtoken.name}</span>
        </h6>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="rounded-md bg-layer py-1 shadow-lg ring-1 ring-gray-700">
        {tokenList.map(({ name, address, logo: Logo }) => (
          <DropdownMenuItem
            key={name}
            onClick={() => onSelect(address)}
            className={cn(
              'flex w-full items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:bg-focus hover:text-accent',
            )}
          >
            <Logo className="size-5" />
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const tokenList = [
  {
    name: 'BNB',
    logo: BSC,
    address: zeroAddress,
  },
  {
    name: 'USDT',
    logo: USDT,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
] as const
