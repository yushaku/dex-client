import { ShopCartList } from '@/pages/shop/components/shopCartList'
import { cn, routes, shortenAddress } from '@/utils'
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { Link, useLocation } from 'react-router-dom'

import { useAccount, useEnsName } from 'wagmi'
import { NFTCartList } from './CartList'
import { MobileSidebar } from './MobileSidebar'
import { NotificationDropdown } from './Notification'
import { SelectChain } from './SelectChain'

type Props = {
  theme: string
  switchTheme: () => void
}

export const Header = (_prop: Props) => {
  const location = useLocation().pathname
  const title = headTitle[location as keyof typeof headTitle] ?? 'Home'

  return (
    <header className="mt-5 flex items-center justify-between py-5">
      <Link to="/" className="flex items-center gap-3 md:hidden">
        <img src="/logo.png" className="size-12" alt="Vite logo" />
      </Link>

      <h3 className="heading-lg lg:heading-2xl hidden text-lighterAccent md:block">
        {title}
      </h3>

      <div className="flex-center gap-3">
        {/* <button className="hidden p-3 md:block" onClick={switchTheme}> */}
        {/*   {theme === 'light' ? ( */}
        {/*     <SunIcon className="size-6 fill-accent" /> */}
        {/*   ) : ( */}
        {/*     <MoonIcon className="size-6" /> */}
        {/*   )} */}
        {/* </button> */}

        <span className={`${location.includes('nft') ? '' : 'hidden'}`}>
          <NFTCartList />
        </span>

        <span className={`${location.includes('shop') ? '' : 'hidden'}`}>
          <ShopCartList />
        </span>

        <span className="hidden md:block">
          <NotificationDropdown />
        </span>

        <span className="hidden md:block">
          <SelectChain />
        </span>

        <span className="">
          <WalletButton />
        </span>

        <MobileSidebar />
      </div>
    </header>
  )
}

export const WalletButton = (
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) => {
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()

  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address })
  // const { data: avatar } = useEnsAvatar({ name: ensName ?? '' })

  if (!address) {
    return (
      <button
        onClick={() => openConnectModal?.()}
        className={cn('rounded-lg bg-accent px-6 py-2', props.className)}
      >
        Connect Wallet
      </button>
    )
  }

  return (
    <button
      onClick={() => openAccountModal?.()}
      className={cn('rounded-lg bg-accent px-6 py-2', props.className)}
    >
      {ensName ?? shortenAddress(address)}
    </button>
  )
}

const headTitle = {
  [routes.dashboard]: 'Dashboard',
  [routes.trade]: 'Trade',
  [routes.history]: 'History',
  [routes.nfts]: 'NFTs Marketplace',
  [routes.nftStudio]: 'NFTs Studio',
  [routes.myNFTs]: 'Your NFTs Collection',
  [routes.shop]: 'My store',
  [routes.admin]: 'Admin Dashboard',
  [routes.addLiquidity]: 'New position',
  [routes.pools]: 'Pools',
}
