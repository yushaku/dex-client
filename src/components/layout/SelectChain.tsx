import { cn } from '@/utils'
import { Menu } from '@headlessui/react'
import { Fragment } from 'react'
import { arbitrum, bsc, bscTestnet, mainnet } from 'viem/chains'
import { useChainId, useSwitchChain } from 'wagmi'
import { Arbitrum, BSC, ETH } from '../icons'
import { Dropdown } from '../common'

export const SelectChain = () => {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const name = chainList.find(({ id }) => id === chainId)?.name ?? 'BSC'
  const Logo = chainList.find(({ id }) => id === chainId)?.logo ?? BSC

  const Title = (
    <h6 className="flex gap-2 text-textSecondary">
      <Logo className="size-5" />
      <span className="hidden md:inline">{name}</span>
    </h6>
  )

  return (
    <Dropdown className="w-48 rounded-xl" hidden={!chainId} title={Title}>
      <Fragment>
        {chainList.map(({ id, name, logo: Logo }) => {
          return (
            <Menu.Item key={id}>
              {({ active }) => (
                <button
                  onClick={() => switchChain({ chainId: id })}
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

const chainList = [
  {
    id: mainnet.id,
    name: 'Ethereum',
    logo: ETH,
  },
  {
    id: arbitrum.id,
    name: 'Arbitrum',
    logo: Arbitrum,
  },
  {
    id: bsc.id,
    name: 'BSC',
    logo: BSC,
  },
  {
    id: bscTestnet.id,
    name: 'BSC Testnet',
    logo: BSC,
  },
] as const
