import { LIDO_ABI } from '@/abi/lido'
import { ETH } from '@/components/icons'
import { Card } from '@/components/warper'
import { useDebounce, useTokenPrice } from '@/hooks'
import { useStakeEth } from '@/hooks/stake/useLido'
import { useFarmState } from '@/stores'
import { cn } from '@/utils'
import { contracts } from '@/utils/contracts'
import { formatAmount } from '@/utils/odos'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { formatEther, formatGwei, parseEther, zeroAddress } from 'viem'
import { mainnet } from 'viem/chains'
import {
  useAccount,
  useBalance,
  useEstimateGas,
  useReadContracts,
  useSwitchChain,
} from 'wagmi'

export const LidoStakeForm = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState('0')
  const debounceAmount = useDebounce(amount, 300)
  const { toggleFarmin } = useFarmState()
  const { switchChain } = useSwitchChain()

  const { address, chainId } = useAccount()
  const { data: ethBalance } = useBalance({ address })
  const { data: price } = useTokenPrice({
    token: zeroAddress,
    chainId: mainnet.id,
  })

  const { stakeETH } = useStakeEth()

  const { data } = useReadContracts({
    contracts: [
      {
        address: contracts.STAKING_ETH.LIDO,
        abi: LIDO_ABI,
        functionName: 'balanceOf',
        args: [address ?? zeroAddress],
      },
      {
        address: contracts.STAKING_ETH.LIDO,
        abi: LIDO_ABI,
        functionName: 'totalSupply',
      },
    ],
    query: {
      enabled: Boolean(address) && chainId === mainnet.id,
    },
  })

  const { data: gas } = useEstimateGas({
    to: contracts.STAKING_ETH.LIDO,
    data: '0xa1903eab00000000000000000000000011d00000000000000000000000000000000011d0',
    value: parseEther('1'),
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

      <article
        className={cn(
          'bg-focus h-0 overflow-hidden rounded-lg transition-all duration-300 ease-in-out px-4',
          isOpen && 'h-full py-4 mb-10',
        )}
      >
        <div className={cn('text-sm hidden', isOpen && 'block')}>
          <label className="flex items-center justify-center gap-2 rounded-lg border border-gray-400 p-2">
            <ETH className="inline-block size-6" />
            <input
              placeholder="0.0"
              type="number"
              value={amount}
              onChange={(e) => {
                const value = e.target.value
                setAmount(value)
              }}
              className="no-spinner w-full flex-1 bg-transparent text-lg focus:outline-none lg:text-2xl"
              style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
            />
            <button
              onClick={() => setAmount(formatEther(ethBalance?.value ?? 0n))}
            >
              MAX
            </button>
          </label>

          <p className="mt-5 flex justify-between">
            <span className="block text-sm text-textSecondary">
              You will receive
            </span>
            <strong className="text-sm font-bold text-textPrimary">
              <img
                src="https://etherscan.io/token/images/steth_32.svg"
                className="inline-block size-6"
              />
              {debounceAmount}
            </strong>
          </p>
          <p className="flex justify-between">
            <span className="block text-sm text-textSecondary">
              Exchange rate
            </span>
            <strong className="text-sm font-bold text-textPrimary">
              1 ETH = 1 stETH
            </strong>
          </p>
          <p className="flex justify-between">
            <span className="block text-sm text-textSecondary">
              Max transaction cost
            </span>
            <strong className="text-sm font-bold text-textPrimary">
              ${Number(formatGwei(gas ?? 0n)) * Number(price)}
            </strong>
          </p>
        </div>
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
          onClick={() => {
            if (isOpen) {
              stakeETH({
                amount: debounceAmount,
                callback: () => {
                  toast.success('Staking success')
                },
              })
            } else {
              setIsOpen(!isOpen)
            }
          }}
          className={cn(
            'btn btn-solid w-full',
            isOpen && Number(amount) <= 0 && 'opacity-50',
            chainId !== mainnet.id && 'hidden',
          )}
          disabled={isOpen && Number(amount) <= 0}
        >
          Stake
        </button>

        <button
          onClick={() => toggleFarmin('ETH')}
          className={cn('btn btn-solid w-full hidden')}
        >
          Earn
        </button>

        <button
          onClick={() => {
            setIsOpen(false)
            toggleFarmin(null)
          }}
          className={cn('btn btn-outline w-full hidden', isOpen && 'block')}
        >
          Cancel
        </button>
      </article>
    </Card>
  )
}
