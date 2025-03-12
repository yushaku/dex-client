import { stakeModuleABI } from '@/abi/stakeModule'
import { Button } from '@/components/common/Button'
import ModalWarp from '@/components/warper/ModalWarper'
import { STAKE_ADRESS, YSK_ADDRESS, cn } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Address, erc20Abi, formatEther, maxInt256, parseUnits } from 'viem'
import {
  useReadContract,
  useWaitForTransactionReceipt as useWaitTx,
  useWriteContract,
} from 'wagmi'
import * as yup from 'yup'

type Inputs = {
  amount: number
  lockType: number
}

const schema = yup
  .object({
    amount: yup.number().positive().required(),
    lockType: yup.number().default(0),
  })
  .required()

type Props = {
  isOpen: boolean
  setOpen: () => void
  address: Address
  balance: string | number
}

export const StakeForm = ({ isOpen, setOpen, address, balance }: Props) => {
  const [apy, setApy] = useState(lockType[0].apy)
  const { data: hash, isPending, writeContractAsync } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitTx({
    hash: hash,
  })

  const allowance = useReadContract({
    abi: erc20Abi,
    address: YSK_ADDRESS,
    functionName: 'allowance',
    args: [address, STAKE_ADRESS],
    query: {
      enabled: true,
    },
  })

  const allowanceData = formatEther(allowance.data ?? 0n)

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<Inputs>({ resolver: yupResolver(schema) })

  async function approve() {
    const res = await writeContractAsync({
      address: YSK_ADDRESS,
      abi: erc20Abi,
      functionName: 'approve',
      args: [STAKE_ADRESS, maxInt256],
    })

    console.log(res)
  }

  async function onSubmit(data: Inputs) {
    const { amount, lockType } = data
    const bigintValue = parseUnits(String(amount), 18)

    const res = await writeContractAsync({
      address: STAKE_ADRESS,
      abi: stakeModuleABI,
      functionName: 'stake',
      args: [bigintValue, lockType],
    })

    console.log(res)
  }

  return (
    <ModalWarp title="Stake" isOpen={isOpen} handleClose={() => setOpen()}>
      <section className="w-[500px]">
        <p className="text-sm text-gray-300">Your APY: {apy}%</p>
        <form
          className="mt-5 flex flex-col gap-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex gap-3">
            {lockType.map((type, index) => {
              return (
                <label
                  htmlFor={type.id}
                  key={index}
                  className={`rounded-lg border border-gray-700 px-4 py-3 ${apy === type.apy && 'bg-accent'}`}
                  onClick={() => setApy(type.apy)}
                >
                  {type.title}
                  <input
                    id={type.id}
                    checked={index === 0}
                    value={index}
                    type="radio"
                    radioGroup="locktype"
                    className={`hidden`}
                    {...register('lockType', { required: true })}
                  />
                </label>
              )
            })}
          </div>

          <div
            className={`${Number(allowanceData) > getValues('amount') ? 'hidden' : 'block'} border border-gray-700 p-3`}
          >
            <p className="text-sm text-red-400">
              your current allowance not enough.
              <br /> please approve more token
            </p>
            <Button
              type="button"
              onClick={approve}
              className="mt-5"
              title="Approve"
            />
          </div>

          <label className="relative">
            <input
              type="text"
              placeholder="Amount"
              className={cn(
                'w-full rounded-lg border-2 border-gray-700 bg-layer p-3  focus:border-gray-500 focus:outline-none',
                { 'border-red-400': errors.amount?.message },
              )}
              {...register('amount', { required: true })}
            />
            <span
              onClick={() => setValue('amount', Number(balance))}
              className="absolute right-5 top-3 cursor-pointer text-accent"
            >
              Max
            </span>
          </label>

          <p>
            your balance: {balance}
            <img
              className="ml-2 inline-block size-8"
              src="/logo.png"
              alt="logo"
            />
          </p>

          <input
            type="submit"
            value={isPending ? 'Pending...' : 'Stake'}
            disabled={isPending || Number(allowanceData) < getValues('amount')}
            className="mt-5 w-full cursor-pointer rounded-lg bg-accent p-3 hover:bg-lighterAccent"
          />
        </form>

        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
      </section>
    </ModalWarp>
  )
}

const lockType = [
  {
    title: '0 Day',
    id: '0_day',
    apy: 5,
  },
  {
    title: '90 Days',
    id: '90_days',
    apy: 15,
  },
  {
    title: '180 Days',
    id: '180_days',
    apy: 30,
  },
]
