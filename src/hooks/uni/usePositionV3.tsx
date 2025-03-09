/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from 'uuid'
import { NPM_V3_ABI } from '@/abi/NPMv3'
import { contracts } from '@/utils/contracts'
import { useCallback, useState } from 'react'
import { Address, getAddress, maxUint128, zeroAddress } from 'viem'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { useTxn } from '../useTxn'
import { TXN_STATUS } from '@/utils'

export type PositionResponse = {
  tokenId: bigint
  token0Address: Address
  token1Address: Address
  fee: number
  tickLower: number
  tickUpper: number
  liquidity: string
  image: string
}

const STARTS_WITH = 'data:application/json;base64,'

export const useUniswapPositions = () => {
  const { address: userAddress, chainId = 1 } = useAccount()

  const { data: balances = 0n } = useReadContract({
    abi: NPM_V3_ABI,
    address: getAddress(contracts.uniswap.NFP[chainId]),
    functionName: 'balanceOf',
    args: [userAddress ?? zeroAddress],
    query: {
      enabled: !!userAddress,
      staleTime: Infinity,
    },
  })

  const { data: tokenIds = [] } = useReadContracts({
    contracts: new Array(Number(balances)).fill(null).map((_, index) => ({
      abi: NPM_V3_ABI,
      address: getAddress(contracts.uniswap.NFP[chainId]),
      functionName: 'tokenOfOwnerByIndex',
      args: [userAddress ?? zeroAddress, index],
    })),
    query: {
      enabled: !!userAddress && balances > 0n,
      staleTime: Infinity,
    },
  })

  const tokens = tokenIds
    .filter((i) => i.result)
    .map((i) => i.result) as bigint[]

  const { data: rawPositons = [] } = useReadContracts({
    contracts: tokens.map((index) => ({
      abi: NPM_V3_ABI,
      address: getAddress(contracts.uniswap.NFP[chainId]),
      functionName: 'positions',
      args: [index],
    })),
    query: {
      enabled: !!userAddress && tokens.length > 0,
      staleTime: Infinity,
    },
  })

  const { data: baseImgs = [] } = useReadContracts({
    contracts: tokens.map((index) => ({
      abi: NPM_V3_ABI,
      address: getAddress(contracts.uniswap.NFP[chainId]),
      functionName: 'tokenURI',
      args: [index],
    })),
    query: {
      enabled: !!userAddress && tokens.length > 0,
      staleTime: Infinity,
    },
  })

  const positions: PositionResponse[] = rawPositons
    .map((ele, idx) => {
      const result = ele?.result as any
      const encodeImage = String(baseImgs[idx]?.result)
      const decodeImage = atob(encodeImage.slice(STARTS_WITH.length))

      let json: any = null
      if (decodeImage) {
        json = JSON.parse(decodeImage)
      }

      return {
        tokenId: tokens[idx],
        token0Address: result[2],
        token1Address: result[3],
        fee: Number(result[4]),
        tickLower: Number(result[5]),
        tickUpper: Number(result[6]),
        liquidity: result[7]?.toString(),
        image: json?.image,
      }
    })
    .filter(Boolean)

  console.log({ positions, balances, tokens })

  return positions
}

export const useClaim = (autoClose = false) => {
  const [pending, setPending] = useState(false)
  const { address: userAddress, chainId = 1 } = useAccount()

  const { startTxn, endTxn, closeTxnModal, writeTxn } = useTxn(chainId)

  const claim = useCallback(
    async ({
      tokenId,
      callback,
    }: {
      tokenId: bigint
      callback?: () => void
    }) => {
      const key = uuidv4()
      const stakeId = uuidv4()

      setPending(true)
      startTxn({
        key,
        title: 'Claim Reward',
        transactions: {
          [stakeId]: {
            desc: 'Claim Reward',
            status: TXN_STATUS.START,
            hash: null,
          },
        },
      })

      const txHash = await writeTxn(key, stakeId, {
        address: getAddress(contracts.uniswap.NFP[chainId]),
        abi: NPM_V3_ABI,
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

      if (!txHash) {
        setPending(false)
        return
      }

      endTxn({ key, final: 'Claim reward successfully', link: 'string' })
      setPending(false)
      callback && callback()

      if (autoClose) {
        closeTxnModal()
      }
    },
    [
      autoClose,
      chainId,
      closeTxnModal,
      endTxn,
      startTxn,
      userAddress,
      writeTxn,
    ],
  )

  return { claim, pending }
}

export const useRemoveLiquidity = (autoClose = false) => {
  const [pending, setPending] = useState(false)
  const { address: userAddress, chainId = 1 } = useAccount()

  const { startTxn, endTxn, closeTxnModal, writeTxn } = useTxn(chainId)

  const claim = useCallback(
    async ({
      tokenId,
      callback,
    }: {
      tokenId: bigint
      callback?: () => void
    }) => {
      const key = uuidv4()
      const stakeId = uuidv4()

      setPending(true)
      startTxn({
        key,
        title: 'Claim Reward',
        transactions: {
          [stakeId]: {
            desc: 'Claim Reward',
            status: TXN_STATUS.START,
            hash: null,
          },
        },
      })

      const txHash = await writeTxn(key, stakeId, {
        address: getAddress(contracts.uniswap.NFP[chainId]),
        abi: NPM_V3_ABI,
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

      if (!txHash) {
        setPending(false)
        return
      }

      endTxn({ key, final: 'Claim reward successfully', link: 'string' })
      setPending(false)
      callback && callback()

      if (autoClose) {
        closeTxnModal()
      }
    },
    [
      autoClose,
      chainId,
      closeTxnModal,
      endTxn,
      startTxn,
      userAddress,
      writeTxn,
    ],
  )

  return { claim, pending }
}
