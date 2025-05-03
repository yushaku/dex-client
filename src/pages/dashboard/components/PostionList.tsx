import { Button } from '@/components/ui/button'
import { useGetUniswapPositions } from '@/hooks'
import { Link } from 'react-router-dom'
import { ManualPosition } from './ManualPosition'

export const PostionList = () => {
  const positions = useGetUniswapPositions()
  // const { address: userAddress, chainId = 1 } = useAccount()

  // const calldatas: Array<`0x${string}`> = []
  // positions.forEach((p) => {
  //   const encoded = encodeFunctionData({
  //     abi: NPM_V3_ABI,
  //     functionName: 'collect',
  //     args: [
  //       {
  //         tokenId: p.tokenId,
  //         recipient: userAddress ?? zeroAddress,
  //         amount0Max: maxUint128,
  //         amount1Max: maxUint128,
  //       },
  //     ],
  //   })
  //   calldatas.push(encoded)
  // })
  //
  // const { data: total } = useSimulateContract({
  //   address: getAddress(contracts.uniswap.NFP[chainId]),
  //   abi: NPM_V3_ABI,
  //   functionName: 'multicall',
  //   args: [calldatas],
  //   query: {
  //     enabled: Boolean(positions.length),
  //   },
  // })
  //
  // console.log({ total })

  return (
    <div className="mt-5 flex-1">
      <h4 className="mb-5 flex justify-between text-xl">
        <span>Your Positions</span>
        <Button>
          <Link to="/pools/add-liquidity">Add liquidity</Link>
        </Button>
      </h4>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {positions.map((position) => {
          return (
            <li key={position.tokenId}>
              <ManualPosition position={position} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
