/* eslint-disable @typescript-eslint/no-explicit-any */
import { BSC, USDT } from '@/components/icons'
import { Dropdown } from '@/components/common'
import { cn } from '@/utils'
import { Menu } from '@headlessui/react'
import { Fragment } from 'react'
import { zeroAddress } from 'viem'

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

  const Title = (
    <h6 className="flex gap-2 text-textSecondary">
      <Logo className="size-5" />
      <span className="hidden md:inline">{selectedtoken.name}</span>
    </h6>
  )

  return (
    <Dropdown title={Title}>
      <Fragment>
        {tokenList.map(({ name, address, logo: Logo }) => {
          return (
            <Menu.Item key={name}>
              {({ active }) => (
                <button
                  onClick={() => onSelect(address)}
                  className={cn(
                    active ? 'bg-focus text-accent' : 'text-textSecondary',
                    'flex w-full items-center gap-3 px-4 py-3 text-sm',
                  )}
                >
                  <Logo className="size-5" />
                  {name}
                </button>
              )}
            </Menu.Item>
          )
        })}
      </Fragment>
    </Dropdown>
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
