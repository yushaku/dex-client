import { ShopCartList } from '@/pages/shop/components/shopCartList'
import { cn, routes } from '@/utils'
import createAvatar from '@/utils/avatar'
import { ConnectKitButton } from 'connectkit'
import { Link, useLocation } from 'react-router-dom'
import { CartList } from '../common/CartList'
import { SelectChain } from '../common/SelectChain'
import { MobileSidebar } from './MobileSidebar'
import { NotificationDropdown } from './Notification'

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
          <CartList />
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

        <span className="hidden md:block">
          <WalletButton />
        </span>

        <span className="md:hidden">
          <WalletAvatar />
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
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <button
            onClick={show}
            className={cn('rounded-lg bg-accent px-6 py-2', props.className)}
          >
            {isConnected ? ensName ?? truncatedAddress : 'Connect Wallet'}
          </button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}

export const WalletAvatar = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address = '' }) => {
        const style = createAvatar(address)

        if (!isConnected) {
          return (
            <button onClick={show} className="rounded-lg bg-accent px-6 py-2">
              Connect
            </button>
          )
        }

        return (
          <button
            style={style}
            id="avatar"
            onClick={show}
            className="size-10 rounded-full"
          ></button>
        )
      }}
    </ConnectKitButton.Custom>
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
}
