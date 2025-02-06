import { chainlinkPriceFeedABI } from '@/abi/chainlinkPriceFeed'
import { Address, formatUnits } from 'viem'
import { useReadContract } from 'wagmi'

const symbolPrice = {
  BNB: '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE',
  ETH: '0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e',
}
export const useGetPrice = ({
  params,
}: {
  params: {
    symbol: keyof typeof symbolPrice
  }
}) => {
  const { symbol } = params

  const { data, ...rest } = useReadContract({
    address: symbolPrice[symbol] as Address,
    abi: chainlinkPriceFeedABI,
    functionName: 'latestRoundData',
    chainId: 56,
  })

  const price = (data as Array<bigint>)?.[1]
  const formatted = price ? Number(formatUnits(price, 8)) : undefined

  return { data: formatted, ...rest }
}
