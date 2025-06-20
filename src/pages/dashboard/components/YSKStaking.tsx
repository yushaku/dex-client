import { Card } from '@/components/common'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks'
import { useFarmState } from '@/stores'
import { cn, formatNumber } from '@/utils'
import { contracts } from '@/utils/contracts'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { erc20Abi, formatEther, zeroAddress } from 'viem'
import { bscTestnet } from 'viem/chains'
import { useAccount, useReadContracts } from 'wagmi'

export const YSKStakeForm = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState('0')
  const debounceAmount = useDebounce(amount, 300)
  const { toggleFarmin } = useFarmState()

  const { address } = useAccount()

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
      enabled: Boolean(address),
    },
  })

  const balance = data?.[0]?.result
  const total = data?.[1]?.result
  const reward = 0n

  return (
    <Card className="h-fit w-full lg:w-1/2">
      <h3 className="flex items-center gap-2 text-xl font-bold text-text-primary">
        <img className="size-10" src="/logo.png" alt="logo" /> YSK
      </h3>

      <article className="mt-5 flex justify-between">
        <p className="text-center">
          <span className="block text-sm text-text-secondary">
            You are staking:
          </span>
          <strong className="inline-flex items-center gap-2 text-xl font-bold text-text-primary">
            {formatNumber(formatEther(reward ?? 0n))}
            <img className="size-7" src="/logo.png" alt="logo" />
          </strong>
        </p>
        <p className="text-center">
          <span className="block text-sm text-text-secondary">
            Your Balance
          </span>
          <strong className="flex items-center gap-2 text-xl font-bold text-text-primary">
            {formatNumber(formatEther(balance ?? 0n))}
            <img className="size-7" src="/logo.png" alt="logo" />
          </strong>
        </p>
      </article>

      <article className="my-10 flex justify-between">
        <p className="text-center">
          <span className="block text-sm text-text-secondary">
            XVS Stake APR
          </span>
          <strong className="text-xl font-bold text-text-primary">8.31%</strong>
        </p>

        <p className="text-center">
          <span className="block text-sm text-text-secondary">
            Daily Emission
          </span>
          <strong className="flex justify-start items-center gap-2 text-xl font-bold text-text-primary">
            <img className="size-7" src="/logo.png" alt="logo" />
            1.672k
          </strong>
        </p>

        <p className="text-center">
          <span className="block text-sm text-text-secondary">
            Total Staked
          </span>
          <strong className="flex justify-start items-center gap-2 text-xl font-bold text-text-primary">
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
              className="no-spinner w-full flex-1 bg-transparent text-lg focus:outline-hidden lg:text-2xl"
              style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
            />
            <button onClick={() => setAmount(formatEther(balance ?? 0n))}>
              MAX
            </button>
          </label>

          <p className="mt-5 flex justify-between">
            <span className="block text-sm text-text-secondary">
              You will receive
            </span>
            <strong className="text-sm font-bold text-text-primary">
              {debounceAmount}
            </strong>
          </p>
        </div>
      </article>

      <article className={cn('flex gap-5')}>
        <Button
          onClick={() => {
            if (isOpen) {
              toast.info('Staking Is Paused')
            } else {
              setIsOpen(!isOpen)
            }
          }}
          className={cn(
            'flex-1',
            isOpen && Number(amount) <= 0 && 'opacity-50',
          )}
          disabled={isOpen && Number(amount) <= 0}
          variant="accent"
          size="default"
        >
          Stake
        </Button>

        <Button
          onClick={() => {
            setIsOpen(false)
            toggleFarmin(null)
          }}
          className={cn('flex-1', (isOpen || Number(reward) <= 0) && 'hidden')}
          variant="ghost"
        >
          Claim
        </Button>

        <Button
          onClick={() => {
            setIsOpen(false)
            toggleFarmin(null)
          }}
          className={cn('flex-1 hidden', isOpen && 'block')}
          variant="ghost"
        >
          Cancel
        </Button>
      </article>
    </Card>
  )
}
