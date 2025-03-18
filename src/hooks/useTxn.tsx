/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react'

import {
  TXN_STATUS,
  getTransactionLink,
  sendTransaction,
  waitForTransaction,
  writeContract,
} from '@/utils'
import { toast } from 'react-toastify'
import { useTransactionStore } from '@/stores/transaction'
import { Address } from 'viem'

export const useTxn = (chainId: number) => {
  const {
    openTransaction,
    updateTransaction,
    completeTransaction,
    closeTransaction,
    closeTransactionPopup,
    openRetryTransactionModal,
  } = useTransactionStore()

  const startTxn = openTransaction
  const updateTxn = updateTransaction
  const endTxn = completeTransaction
  const closeTxn = closeTransaction
  const closeTxnModal = closeTransactionPopup

  const askUserToRetry = useCallback(
    (params: any) =>
      new Promise((resolve) => {
        openRetryTransactionModal({ params, resolver: resolve })
      }),
    [openRetryTransactionModal],
  )

  const writeTxn = useCallback(
    async (
      key: string,
      uuid: string,
      contract: {
        abi: any
        address: Address
        functionName: string
        args: Array<any>
        msgValue?: string
      },
    ) => {
      let hash

      const { abi, functionName, address, args, msgValue } = contract

      updateTxn({ key, uuid, status: TXN_STATUS.WAITING })

      try {
        hash = await writeContract({
          abi,
          functionName: functionName,
          args: args,
          value: BigInt(msgValue ?? 0),
          chainId,
          address,
        })

        updateTxn({ key, uuid, hash, status: TXN_STATUS.PENDING })

        await waitForTransaction(hash)

        updateTxn({ key, uuid, hash, status: TXN_STATUS.SUCCESS })

        toast.success(
          <a href={getTransactionLink({ chainId, hash })}>
            transaction confirmed. Click here to view.
          </a>,
        )

        return hash
      } catch (error: any) {
        if (error && error.name === 'TransactionReceiptNotFoundError') {
          updateTxn({ key, uuid, hash, status: TXN_STATUS.SUCCESS })
          toast.success(
            <a href={getTransactionLink({ chainId, hash })}>
              transaction confirmed. Click here to view.
            </a>,
          )

          return true
        }

        updateTxn({ key, uuid, hash, status: TXN_STATUS.FAILED })

        toast.error(`Error ${error.shortMessage}`)

        const userWantsToRetry = await askUserToRetry({
          key,
          uuid,
          contract,
          method: functionName,
          params: args,
          msgValue,
        })

        if (userWantsToRetry) {
          // return writeTxn(key, uuid, contract, method, params, msgValue) // retry
        }

        return false
      }
    },
    [updateTxn, chainId, askUserToRetry],
  )

  const sendTxn = useCallback(
    async (key: string, uuid: string, to: Address, data: any, value = '0') => {
      let hash
      updateTxn({ key, uuid, status: TXN_STATUS.WAITING })

      try {
        hash = await sendTransaction({ to, data, value, chainId })

        updateTxn({ key, uuid, hash, status: TXN_STATUS.PENDING })

        await waitForTransaction(hash)

        updateTxn({ key, uuid, hash, status: TXN_STATUS.SUCCESS })

        toast.success(
          <a href={getTransactionLink({ hash, chainId })}>
            transaction confirmed. Click here to view.
          </a>,
        )

        return hash
      } catch (error: any) {
        if (error && error.name === 'TransactionReceiptNotFoundError') {
          updateTxn({ key, uuid, hash, status: TXN_STATUS.SUCCESS })
          toast('Transaction confirmed')
          return hash
        }

        updateTxn({ key, uuid, hash, status: TXN_STATUS.FAILED })

        toast.error(`Error ${error.shortMessage}`)
        return false
      }
    },
    [updateTxn, chainId],
  )

  return {
    startTxn,
    updateTxn,
    endTxn,
    closeTxn,
    writeTxn,
    sendTxn,
    closeTxnModal,
  }
}
