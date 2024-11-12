import { Asset } from '@/utils'
import { isInvalidAmount, quoteUrl } from '@/utils/odos'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { getAddress, parseUnits, zeroAddress } from 'viem'
import { bsc } from 'viem/chains'

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
      'useBestQuoteSwap',
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
