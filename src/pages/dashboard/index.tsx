import { NativeBalance } from '@/components/common/NativeTokenBalance'
import { cn, shortenAddress } from '@/utils'
import { useAccount, useEnsName } from 'wagmi'
import { ETHFarming } from './components/ETHFarming'
import { HelloGuy } from './components/Hello'
import { LidoStakeForm } from './components/LidoStaking'
import { YSKStakeForm } from './components/YSKStaking'
import { PostionList } from './components/PostionList'

export const Dashboard = () => {
  const { address } = useAccount()
  const ens = useEnsName({ address: address })

  if (!address) {
    return (
      <section className="flex min-h-[80dvh] items-center justify-center">
        <HelloGuy />
      </section>
    )
  }

  return (
    <section className="min-h-[80dvh]">
      <h3
        className={cn('hidden items-center gap-3 text-lg text-text-secondary', {
          flex: address,
        })}
      >
        <span>{ens?.data ? ens.data : shortenAddress(address)}:</span>
        <NativeBalance address={address} />
      </h3>

      <section className="mt-10 flex flex-wrap gap-10 lg:flex-nowrap">
        <YSKStakeForm />
        <LidoStakeForm />
      </section>

      <ETHFarming />
      <PostionList />
      {/* <StakedValueLockChart /> */}
    </section>
  )
}
