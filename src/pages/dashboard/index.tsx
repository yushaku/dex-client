import { NativeBalance } from '@/components/common/NativeTokenBalance'
import { cn, shortenAddress } from '@/utils'
import { useAccount, useEnsName } from 'wagmi'
import { HelloGuy } from './components/Hello'
import { LidoStakeForm } from './components/LidoStaking'
import { YSKStakeForm } from './components/YSKStaking'
import { ETHFarming } from './components/ETHFarming'
import { useGetUniswapPositions } from '@/hooks'
import { ManualPosition } from './components/ManualPosition'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export const Dashboard = () => {
  const { address } = useAccount()
  const positions = useGetUniswapPositions()
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

      <ETHFarming />

      <div className="mt-5 flex-1">
        <h4 className="mb-5 flex justify-between text-xl">
          <span>Your Positions</span>
          <Button>
            <Link to="/pools/add-liquidity">Add liquidity</Link>
          </Button>
        </h4>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {positions.map((position) => {
            return (
              <li key={position.tokenId}>
                <ManualPosition position={position} />
              </li>
            )
          })}
        </ul>
      </div>
      {/* <StakedValueLockChart /> */}
    </>
  )
}
