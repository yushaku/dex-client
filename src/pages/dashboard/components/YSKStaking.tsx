import { Card } from '@/components/warper'
import { useDebounce } from '@/hooks'
import { useFarmState } from '@/stores'
import { cn, formatNumber } from '@/utils'
import { contracts } from '@/utils/contracts'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { erc20Abi, formatEther, zeroAddress } from 'viem'
import { bscTestnet, mainnet } from 'viem/chains'
import { useAccount, useReadContracts } from 'wagmi'

export const YSKStakeForm = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState('0')
  const debounceAmount = useDebounce(amount, 300)
  const { toggleFarmin } = useFarmState()

  const { address, chainId } = useAccount()

  const { data } = useReadContracts({
    contracts: [
      {
        address: contracts.YSK[bscTestnet.id],
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address ?? zeroAddress],
        chainId: bscTestnet.id,
      },
      {
        address: contracts.YSK[bscTestnet.id],
        abi: erc20Abi,
        functionName: 'totalSupply',
        chainId: bscTestnet.id,
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
        <img className="size-10" src="/logo.png" alt="logo" /> YSK
      </h3>

      <article className="mt-5 flex justify-between">
        <p className="text-center">
          <span className="block text-sm text-textSecondary">
            You are staking:
          </span>
          <strong className="inline-flex items-center gap-2 text-xl font-bold text-textPrimary">
            0
            <img className="size-7" src="/logo.png" alt="logo" />
          </strong>
        </p>
        <p className="text-center">
          <span className="block text-sm text-textSecondary">Your Balance</span>
          <strong className="flex items-center gap-2 text-xl font-bold text-textPrimary">
            {formatNumber(formatEther(balance ?? 0n))}
            <img className="size-7" src="/logo.png" alt="logo" />
          </strong>
        </p>
      </article>

      <article className="my-10 flex justify-between">
        <p className="text-center">
          <span className="block text-sm text-textSecondary">
            XVS Stake APR
          </span>
          <strong className="text-xl font-bold text-textPrimary">8.31%</strong>
        </p>

        <p className="text-center">
          <span className="block text-sm text-textSecondary">
            Daily Emission
          </span>
          <strong className="flex-start gap-2 text-xl font-bold text-textPrimary">
            <img className="size-7" src="/logo.png" alt="logo" />
            1.672k
          </strong>
        </p>

        <p className="text-center">
          <span className="block text-sm text-textSecondary">Total Staked</span>
          <strong className="flex-start gap-2 text-xl font-bold text-textPrimary">
            <img className="size-7" src="/logo.png" alt="logo" />
            {formatNumber(formatEther(total ?? 0n))}
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
            <img className="size-7" src="/logo.png" alt="logo" />
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
            <button onClick={() => setAmount(formatEther(balance ?? 0n))}>
              MAX
            </button>
          </label>

          <p className="mt-5 flex justify-between">
            <span className="block text-sm text-textSecondary">
              You will receive
            </span>
            <strong className="text-sm font-bold text-textPrimary">
              {debounceAmount}
            </strong>
          </p>
        </div>
      </article>

      <article className={cn('flex gap-5')}>
        <button
          onClick={() => {
            if (isOpen) {
              toast.info('Staking Is Paused')
            } else {
              setIsOpen(!isOpen)
            }
          }}
          className={cn(
            'btn btn-solid w-1/2',
            isOpen && Number(amount) <= 0 && 'opacity-50',
          )}
          disabled={isOpen && Number(amount) <= 0}
        >
          Stake
        </button>

        <button
          onClick={() => {
            setIsOpen(false)
            toggleFarmin(null)
          }}
          className={cn('btn btn-outline w-1/2', isOpen && 'hidden')}
        >
          Claim
        </button>

        <button
          onClick={() => {
            setIsOpen(false)
            toggleFarmin(null)
          }}
          className={cn('btn btn-outline w-1/2 hidden', isOpen && 'block')}
        >
          Cancel
        </button>
      </article>
    </Card>
  )
}
