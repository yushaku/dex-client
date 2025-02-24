import { RENZO_ABI } from '@/abi/renzo'
import { TXN_STATUS, env, readContract } from '@/utils'
import { contracts } from '@/utils/contracts'
import { useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { parseEther } from 'viem'
import { mainnet } from 'viem/chains'
import { useTxn } from '../useTxn'
import { LIDO_ABI } from '@/abi/lido'
import { useAccount } from 'wagmi'

export const useRenzo = (autoClose = false) => {
  const [pending, setPending] = useState(false)

  const { address: account, chainId } = useAccount()
  const { startTxn, endTxn, closeTxnModal, writeTxn } = useTxn(mainnet.id)

  const depositETH = useCallback(
    async ({ amount, callback }: { amount: string; callback?: () => void }) => {
      const key = uuidv4()
      const stakeId = uuidv4()

      setPending(true)
      startTxn({
        key,
        title: 'Stake ETH',
        transactions: {
          [stakeId]: {
            desc: 'Stake ETH',
            status: TXN_STATUS.START,
            hash: null,
          },
        },
      })

      setPending(true)

      const txHash = await writeTxn(key, stakeId, {
        address: contracts.RESTAKING_ETH.RENZO.PROTOCOL,
        abi: RENZO_ABI,
        functionName: 'depositETH',
        args: [env.VITE_OWNER_ADDRESS],
        msgValue: parseEther(amount).toString(),
      })
      if (!txHash) {
        setPending(false)
        return
      }

      endTxn({ key, final: 'Stake Successfully', link: 'string' })
      setPending(false)
      callback && callback()

      if (autoClose) {
        closeTxnModal()
      }
    },
    [autoClose, closeTxnModal, endTxn, startTxn, writeTxn],
  )

  const depositToken = useCallback(
    async ({ amount, callback }: { amount: string; callback?: () => void }) => {
      const key = uuidv4()
      const stakeId = uuidv4()
      const approveId = uuidv4()

      const allowance = (await readContract({
        address: contracts.STAKING_ETH.LIDO,
        abi: LIDO_ABI,
        functionName: 'allowance',
        args: [account, contracts.RESTAKING_ETH.RENZO.PROTOCOL],
        chainId,
      })) as bigint
      const isApproved = parseEther(amount) <= allowance

      setPending(true)
      startTxn({
        key,
        title: 'Stake stETH',
        transactions: {
          ...(!isApproved && {
            [approveId]: {
              desc: 'Approve stETH',
              status: TXN_STATUS.START,
              hash: null,
            },
          }),
          [stakeId]: {
            desc: 'Stake stETH',
            status: TXN_STATUS.START,
            hash: null,
          },
        },
      })

      setPending(true)

      if (!isApproved) {
        setPending(true)
        const approvalResult = await writeTxn(key, approveId, {
          address: contracts.STAKING_ETH.LIDO,
          abi: LIDO_ABI,
          functionName: 'approve',
          args: [contracts.RESTAKING_ETH.RENZO.PROTOCOL, parseEther(amount)],
        })

        if (!approvalResult) {
          setPending(false)
          return
        }
      }

      const txHash = await writeTxn(key, stakeId, {
        address: contracts.RESTAKING_ETH.RENZO.PROTOCOL,
        abi: RENZO_ABI,
        functionName: 'deposit',
        args: [
          contracts.STAKING_ETH.LIDO,
          parseEther(amount),
          env.VITE_OWNER_ADDRESS,
        ],
      })

      if (!txHash) {
        setPending(false)
        return
      }

      endTxn({ key, final: 'Stake Successfully', link: 'string' })
      setPending(false)
      callback && callback()

      if (autoClose) {
        closeTxnModal()
      }
    },
    [account, autoClose, chainId, closeTxnModal, endTxn, startTxn, writeTxn],
  )

  return { depositETH, depositToken, pending }
}
