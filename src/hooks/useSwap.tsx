/* eslint-disable @typescript-eslint/no-explicit-any */
import { ERC20_ABI } from '@/abi/erc20'
import { Asset, TXN_STATUS, read } from '@/utils'
import { contracts } from '@/utils/contracts'
import { isInvalidAmount, quoteUrl } from '@/utils/odos'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getAddress, maxUint256, parseUnits, zeroAddress } from 'viem'
import { bsc } from 'viem/chains'
import { useAccount } from 'wagmi'
import { useTxn } from './useTxn'

export type OdosData = {
  inTokens: string[]
  outTokens: string[]
  inAmounts: string[]
  outAmounts: string[]
  gasEstimate: number
  dataGasEstimate: number
  gweiPerGas: number
  gasEstimateValue: number
  inValues: number[]
  outValues: number[]
  netOutValue: number
  priceImpact: number
  percentDiff: number
  partnerFeePercent: number
  pathId: string
  pathViz: string | null
  pathVizImage: string
}

export type Props = {
  account: string
  fromAsset: Asset | null
  toAsset: Asset | null
  amount: string
  slippage: number
  networkId: number
}

export const BEST_TRADE_ODOS = 'BEST_TRADE_ODOS'

export const useOdosQuoteSwap = ({
  fromAsset,
  toAsset,
  amount,
  slippage,
  account,
  networkId
}: Partial<Props>) => {
  const isEnabled = Boolean(
    fromAsset && toAsset && networkId === bsc.id && !isInvalidAmount(amount)
  )

  const fetchQuote = async () => {
    if (!isEnabled) return

    const inputAmount = parseUnits(
      amount!.toString(),
      fromAsset!.decimals
    ).toString()

    const quoteRequestBody = {
      chainId: networkId,
      inputTokens: [
        {
          tokenAddress: getAddress(
            fromAsset!.address === 'BNB' ? zeroAddress : fromAsset!.address
          ),
          amount: inputAmount
        }
      ],
      outputTokens: [
        {
          tokenAddress: getAddress(
            toAsset!.address === 'BNB' ? zeroAddress : toAsset!.address
          ),
          proportion: 1
        }
      ],
      userAddr: getAddress(account ?? zeroAddress),
      slippageLimitPercent: slippage,
      referralCode: 121015208,
      pathVizImage: true,
      disableRFQs: true,
      compact: true,
      pathVizImageConfig: {
        linkColors: ['#6ca3ff', '#FBA499', '#F9EC66', '#F199EE'],
        nodeColor: '#422D4C',
        nodeTextColor: '#D9D5DB',
        legendTextColor: '#FCE6FB',
        height: 300
      }
    }

    const res = await axios.post(quoteUrl, quoteRequestBody, {
      headers: { 'Content-Type': 'application/json' }
    })
    return res.data as OdosData
  }

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [
      BEST_TRADE_ODOS,
      account,
      fromAsset?.address,
      toAsset?.address,
      amount,
      slippage
    ],
    queryFn: fetchQuote,
    refetchInterval: 30000,
    enabled: isEnabled
  })

  return { data, error, isLoading, refetch }
}

export const useOdosSwap = (autoClose = false) => {
  const [pending, setPending] = useState(false)
  let { address: account, chainId } = useAccount()

  account ??= zeroAddress
  chainId ??= bsc.id

  const { startTxn, endTxn, sendTxn, closeTxnModal, writeTxn, } = useTxn(bsc.id)

  const onOdosSwap = useCallback(
    async (
      {
        fromAsset,
        toAsset,
        fromAmount,
        quote,
        callback
      }: {
        fromAsset: Asset,
        toAsset: Asset,
        fromAmount: string,
        quote: any,
        callback?: () => void
      }
    ) => {
      const key = uuidv4()
      const approveId = uuidv4()
      const swapId = uuidv4()

      let isApproved = true
      const routerAddress = contracts.odos[bsc.id]

      if (fromAsset.address !== 'BNB') {
        const allowance = await read({
          address: fromAsset.address,
          abi: ERC20_ABI,
          functionName: 'allowance',
          args: [account, routerAddress],
          chainId
        }) as bigint

        isApproved = parseUnits(fromAmount, fromAsset.decimals) <= allowance
      }

      const transactions: Record<string, any> = {}

      if (!isApproved) {
        transactions[approveId] = {
          desc: `Approve ${fromAsset.symbol}`,
          status: TXN_STATUS.START,
          hash: null
        }
      }

      transactions[swapId] = {
        desc: `Swap ${fromAsset.symbol} for ${toAsset.symbol}`,
        status: TXN_STATUS.START,
        hash: null
      }

      startTxn({ key, transactions, title: `Swap ${fromAsset.symbol} for ${toAsset.symbol}`, })

      setPending(true)

      if (!isApproved) {
        const approvalResult = await writeTxn(
          key,
          approveId,
          {
            address: fromAsset.address,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [routerAddress, maxUint256]
          },
        )

        if (!approvalResult) {
          setPending(false)
          return
        }
      }

      const assembleRequestBody = {
        userAddr: getAddress(account),
        pathId: quote.pathId, // Replace with the pathId from quote response in step 1
        simulate: true // this can be set to true if the user isn't doing their own estimate gas call for the transaction
      }

      const assembleUrl = 'https://api.odos.xyz/sor/assemble'
      const response = await fetch(assembleUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assembleRequestBody)
      })
      if (response.status !== 200) {
        console.error('Error in Transaction Assembly:', response)
        setPending(false)
        return
      }
      const assembledTransaction = await response.json()
      const { to, data, value } = assembledTransaction.transaction
      if (!(await sendTxn(key, swapId, to, data, value))) {
        setPending(false)
        return
      }

      endTxn({ key, final: 'Swap Successful', link: "string", })

      setPending(false)

      callback && callback()

      if (autoClose) {
        closeTxnModal()
      }
    },
    [account, autoClose, chainId, closeTxnModal, endTxn, sendTxn, startTxn, writeTxn]
  )

  return { onOdosSwap, pending }
}
