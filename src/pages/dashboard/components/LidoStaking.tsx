import { LIDO_ABI } from '@/abi/lido'
import { ETH } from '@/components/icons'
import { Card } from '@/components/warper'
import { useFarmState } from '@/stores'
import { cn } from '@/utils'
import { contracts } from '@/utils/contracts'
import { formatAmount } from '@/utils/odos'
import { zeroAddress } from 'viem'
import { mainnet } from 'viem/chains'
import { useAccount, useBalance, useReadContracts, useSwitchChain } from 'wagmi'

export const LidoStakeForm = () => {
  const { data: farmType, toggleFarmin } = useFarmState()
  const { switchChain } = useSwitchChain()

  const { address, chainId } = useAccount()
  const { data: ethBalance } = useBalance({ address })

  const { data } = useReadContracts({
    contracts: [
      {
        address: contracts.STAKING_ETH.LIDO,
        abi: LIDO_ABI,
        functionName: 'balanceOf',
        args: [address ?? zeroAddress],
        chainId: mainnet.id,
      },
      {
        address: contracts.STAKING_ETH.LIDO,
        abi: LIDO_ABI,
        functionName: 'totalSupply',
        chainId: mainnet.id,
      },
    ],
    query: {
      enabled: Boolean(address) && chainId === mainnet.id,
    },
  })

  const balance = data?.[0]?.result
  const total = data?.[1]?.result

  return (
    <Card className="h-fit w-full lg:w-1/2">
      <h3 className="flex items-center gap-2 text-xl font-bold text-textPrimary">
        <img
          src="https://etherscan.io/token/images/steth_32.svg"
          className="inline-block size-9"
        />
        Lido Staking
      </h3>

      <article className="mt-5 flex justify-between">
        <p className="text-center">
          <span className="block text-sm text-textSecondary">
            you are staking:
          </span>
          <strong className="text-xl font-bold text-textPrimary">
            {formatAmount({ amount: balance, decimals: 18 })}
          </strong>
        </p>
        <p className="text-center">
          <span className="block text-sm text-textSecondary">
            Available to stake
          </span>
          <strong className="flex-start gap-2 text-xl text-textPrimary">
            <ETH className="inline-block size-6" />
            {formatAmount({ amount: ethBalance?.value, decimals: 18 })}
          </strong>
        </p>
      </article>

      <article className="my-10 flex justify-between">
        <p className="text-center">
          <span className="block text-sm text-textSecondary">stake APR</span>
          <strong className="text-xl font-bold text-textPrimary">3%</strong>
        </p>

        <p className="text-center">
          <span className="block text-sm text-textSecondary">Total Staked</span>
          <strong className="flex-start gap-2 text-xl font-bold text-textPrimary">
            <ETH className="inline-block size-6" />
            {formatAmount({ amount: total, decimals: 18 })}
          </strong>
        </p>
      </article>

      <article className="flex gap-5">
        <button
          onClick={() => {
            switchChain({ chainId: mainnet.id })
          }}
          className={cn(
            'btn btn-solid rounded-lg w-full',
            chainId === mainnet.id && 'hidden',
          )}
        >
          Connect to Ethereum
        </button>

        <button
          onClick={() => toggleFarmin('ETH')}
          className={cn(
            'btn btn-solid w-full',
            chainId !== mainnet.id && 'hidden',
          )}
        >
          Earn
        </button>

        <button
          onClick={() => {
            toggleFarmin(null)
          }}
          className={cn(
            'btn btn-outline w-full hidden',
            farmType === 'ETH' && 'block',
            chainId !== mainnet.id && 'hidden',
          )}
        >
          Cancel
        </button>
      </article>
    </Card>
  )
}
