import { LIDO_ABI } from '@/abi/lido'
import { TXN_STATUS, env, readContract } from '@/utils'
import { contracts } from '@/utils/contracts'
import { useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { parseEther } from 'viem'
import { mainnet } from 'viem/chains'
import { useTxn } from '../useTxn'
import { WST_ETH } from '@/abi/wstETH'
import { useAccount } from 'wagmi'

export const useStakeEth = (autoClose = false) => {
  const [pending, setPending] = useState(false)

  const { startTxn, endTxn, closeTxnModal, writeTxn } = useTxn(mainnet.id)

  const stakeETH = useCallback(
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

      const txHash = await writeTxn(key, stakeId, {
        address: contracts.STAKING_ETH.LIDO,
        abi: LIDO_ABI,
        functionName: 'submit',
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

  return { stakeETH, pending }
}

export const useWstETH = (autoClose = false) => {
  const [pending, setPending] = useState(false)

  const { address: account, chainId } = useAccount()
  const { startTxn, endTxn, closeTxnModal, writeTxn } = useTxn(mainnet.id)

  const wrapStETH = useCallback(
    async ({ amount, callback }: { amount: string; callback?: () => void }) => {
      const key = uuidv4()
      const stakeId = uuidv4()
      const approveId = uuidv4()

      const allowance = (await readContract({
        address: contracts.STAKING_ETH.LIDO,
        abi: LIDO_ABI,
        functionName: 'allowance',
        args: [account, contracts.WST_ETH[mainnet.id]],
        chainId,
      })) as bigint
      const isApproved = parseEther(amount) <= allowance

      setPending(true)
      startTxn({
        key,
        title: 'Wrap stETH',
        transactions: {
          ...(!isApproved && {
            [approveId]: {
              desc: 'Approve stETH',
              status: TXN_STATUS.START,
              hash: null,
            },
          }),
          [stakeId]: {
            desc: 'Wrap stETH',
            status: TXN_STATUS.START,
            hash: null,
          },
        },
      })

      if (!isApproved) {
        setPending(true)
        const approvalResult = await writeTxn(key, approveId, {
          address: contracts.STAKING_ETH.LIDO,
          abi: LIDO_ABI,
          functionName: 'approve',
          args: [contracts.WST_ETH[mainnet.id], parseEther(amount)],
        })

        if (!approvalResult) {
          setPending(false)
          return
        }
      }

      setPending(true)
      const txHash = await writeTxn(key, stakeId, {
        address: contracts.STAKING_ETH.LIDO,
        abi: LIDO_ABI,
        functionName: 'submit',
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
    [account, autoClose, chainId, closeTxnModal, endTxn, startTxn, writeTxn],
  )

  const unwrapWstETH = useCallback(
    async ({ amount, callback }: { amount: string; callback?: () => void }) => {
      const key = uuidv4()
      const stakeId = uuidv4()

      setPending(true)
      startTxn({
        key,
        title: 'Unwrap wstETH',
        transactions: {
          [stakeId]: {
            desc: 'Unwrap wstETH',
            status: TXN_STATUS.START,
            hash: null,
          },
        },
      })

      const txHash = await writeTxn(key, stakeId, {
        address: contracts.WST_ETH[mainnet.id],
        abi: WST_ETH,
        functionName: 'unwrap',
        args: [parseEther(amount)],
      })

      if (!txHash) {
        setPending(false)
        return
      }

      endTxn({ key, final: 'Unwrap Successfully', link: 'string' })
      setPending(false)
      callback && callback()

      if (autoClose) {
        closeTxnModal()
      }
    },
    [autoClose, closeTxnModal, endTxn, startTxn, writeTxn],
  )

  return { wrapStETH, unwrapWstETH, pending }
}
