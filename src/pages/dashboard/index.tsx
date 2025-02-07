import { NativeBalance } from '@/components/common/NativeTokenBalance'
import { cn, shortenAddress } from '@/utils'
import { useAccount, useEnsName } from 'wagmi'
import { HelloGuy } from './components/Hello'
import { LidoFarming } from './components/LidoFarming'
import { LidoStakeForm } from './components/LidoStaking'
import { YSKStakeForm } from './components/YSKStaking'

export const Dashboard = () => {
  const { address } = useAccount()
  const ens = useEnsName({ address: address })

  return (
    <>
      <h3
        className={cn('hidden items-center gap-3 text-lg text-textSecondary', {
          flex: address,
        })}
      >
        <span>{ens?.data ? ens.data : shortenAddress(address)}:</span>
        <NativeBalance address={address} />
      </h3>

      {!address ? (
        <HelloGuy />
      ) : (
        <section className="mt-10 flex flex-wrap gap-10 lg:flex-nowrap">
          <YSKStakeForm />
          <LidoStakeForm />
        </section>
      )}

      <LidoFarming />
      {/* <StakedValueLockChart /> */}
    </>
  )
}
