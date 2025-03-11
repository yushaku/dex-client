import { NPM_V3_ABI } from '@/abi/NPMv3'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/warper/Card'
import { useGetPool } from '@/hooks'
import { PositionResponse, useClaim } from '@/hooks/uni/usePositionV3'
import { useGetAsset } from '@/hooks/useAssets'
import { UNKNOWN_TOKEN, cn } from '@/utils'
import { contracts } from '@/utils/contracts'
import { formatNumber } from '@/utils/odos'
import { CurrencyAmount } from '@uniswap/sdk-core'
import { Position } from '@uniswap/v3-sdk'
import BigNumber from 'bignumber.js'
import { useMemo, useState } from 'react'
import Tilt from 'react-parallax-tilt'
import { getAddress, maxUint128, zeroAddress } from 'viem'
import { useAccount, useSimulateContract } from 'wagmi'
import { IconGroup } from './IconGroup'

export const ManualPosition = ({
  position: _p,
}: {
  position: PositionResponse
}) => {
  const {
    tokenId,
    token1Address,
    token0Address,
    liquidity,
    tickLower,
    tickUpper,
    fee,
    image,
  } = _p

  const [show] = useState(true)
  const { address: userAddress, chainId = 1 } = useAccount()
  const asset1 = useGetAsset(token0Address)
  const asset2 = useGetAsset(token1Address)

  const { claim } = useClaim()
  const { pool, tokenA, tokenB } = useGetPool({
    asset0: asset1,
    asset1: asset2,
    fee,
  })

  const position = useMemo(() => {
    if (!pool) return null
    return new Position({
      pool: pool,
      liquidity: BigNumber(liquidity.toString()).toString(),
      tickLower: tickLower,
      tickUpper: tickUpper,
    })
  }, [liquidity, tickLower, tickUpper, pool])

  const amount0 = position?.amount0?.toExact() ?? '0'
  const amount1 = position?.amount1?.toExact() ?? '0'

  // const outOfRange = pool
  //   ? pool.tickCurrent < tickLower || pool.tickCurrent >= tickUpper
  //   : false
  //
  const { data: collect, refetch: refetchReward } = useSimulateContract({
    abi: NPM_V3_ABI,
    address: getAddress(contracts.uniswap.NFP[chainId]),
    functionName: 'collect',
    args: [
      {
        tokenId,
        recipient: userAddress ?? zeroAddress,
        amount0Max: maxUint128,
        amount1Max: maxUint128,
      },
    ],
  })
  const reward = collect?.result

  const feeValue0 = useMemo(() => {
    if (tokenA && reward) {
      return CurrencyAmount.fromRawAmount(
        tokenA,
        BigNumber(reward[0].toString()).toString(),
      )
    }
  }, [reward, tokenA])

  const feeValue1 = useMemo(() => {
    if (tokenB && reward) {
      return CurrencyAmount.fromRawAmount(
        tokenB,
        BigNumber(reward[1].toString()).toString(),
      )
    }
  }, [reward, tokenB])

  return (
    <Card>
      <div className="flex h-80 gap-2">
        <Tilt
          tiltMaxAngleX={5}
          tiltMaxAngleY={5}
          glareEnable
          glareMaxOpacity={0.1}
          scale={1.0}
          perspective={300}
          className="animate parallax-effect size-full rounded-lg"
        >
          <img src={image} alt="" className="my-auto w-fit" />
        </Tilt>

        <div className={cn('mt-4 w-full', !show && 'hidden')}>
          <h2 className="flex items-center gap-2">
            <IconGroup
              logo1={asset1?.logoURI ?? UNKNOWN_TOKEN}
              logo2={asset2?.logoURI ?? UNKNOWN_TOKEN}
            />
            <span className="font-medium">
              {asset1?.symbol}/{asset2?.symbol}
            </span>
          </h2>

          <ul className="group mt-3 grid grid-cols-1 text-sm text-textSecondary">
            <li className="flex justify-between">
              <span>{asset1?.symbol}</span>
              <span className="group-hover:text-primary">
                {formatNumber(amount0)}
              </span>
            </li>

            <li className="flex justify-between">
              <span>{asset2?.symbol}</span>
              <span className="group-hover:text-primary">
                {formatNumber(amount1)}
              </span>
            </li>

            {/* <li className="flex justify-between"> */}
            {/*   <span>Depositd in USD</span> */}
            {/*   <span className="group-hover:text-primary">$0</span> */}
            {/* </li> */}

            <li className="mt-5 flex justify-between">
              <span>Reward</span>
              <span className="group-hover:text-primary">
                {feeValue0?.toSignificant()} {tokenA?.symbol}
              </span>
            </li>

            <li className="flex justify-between">
              <span>Reward</span>
              <span className="group-hover:text-primary">
                {feeValue1?.toSignificant()} {tokenB?.symbol}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className={cn('mt-6 flex items-center gap-2', !show && 'hidden')}>
        <Button className="w-full" variant="ghost">
          Remove
        </Button>
        <Button className="w-full">Add</Button>
        <Button
          onClick={() =>
            claim({
              tokenId,
              callback: refetchReward,
            })
          }
          className="w-full"
        >
          Claim
        </Button>
      </div>
    </Card>
  )
}

// UNI_ADDRESSES
