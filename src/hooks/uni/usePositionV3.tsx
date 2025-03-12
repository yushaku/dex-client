/* eslint-disable @typescript-eslint/no-explicit-any */
import { NPM_V3_ABI } from '@/abi/NPMv3'
import { WillExecuteTxs } from '@/stores/transaction'
import { getTransactionLink, readContract, toWei, TXN_STATUS } from '@/utils'
import { contracts } from '@/utils/contracts'
import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { Position, toHex } from '@uniswap/v3-sdk'
import JSBI from 'jsbi'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import invariant from 'tiny-invariant'
import { v4 as uuidv4 } from 'uuid'
import {
  Address,
  encodeFunctionData,
  erc20Abi,
  getAddress,
  maxUint128,
  maxUint256,
  zeroAddress,
} from 'viem'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { useTxn } from '../useTxn'

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

export function useUniswapPositions() {
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

  // console.log({ positions, balances, tokens })

  return positions
}

export function useClaim(autoClose = false) {
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

export function useRemoveLiquidity(autoClose = false) {
  const [pending, setPending] = useState(false)
  const { address: userAddress, chainId = 1 } = useAccount()

  const { startTxn, endTxn, closeTxnModal, writeTxn, sendTxn } = useTxn(chainId)

  const claim = useCallback(
    async ({
      tokenId,
      options,
      position,
      shouldClaim = true,
      shouldBurn = false,
      callback,
    }: {
      tokenId: bigint
      shouldClaim: boolean
      shouldBurn: boolean
      position: Position
      options: {
        liquidityPercentage: Percent
        slippageTolerance: Percent
        deadline: string
        burnToken: boolean
        currencyO: CurrencyAmount<Currency>
        currency1: CurrencyAmount<Currency>
      }
      callback?: () => void
    }) => {
      if (!userAddress) {
        toast.error('Please connect wallet')
        return
      }

      const key = uuidv4()
      const stakeId = uuidv4()
      const removeId = uuidv4()

      setPending(true)
      startTxn({
        key,
        title: 'Claim Reward',
        transactions: {
          ...(shouldClaim && {
            [stakeId]: {
              desc: 'Claim Reward',
              status: TXN_STATUS.START,
              hash: null,
            },
          }),
          [removeId]: {
            desc: 'Remove Liquidity',
            status: TXN_STATUS.START,
            hash: null,
          },
        },
      })

      if (shouldClaim) {
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
      }

      const calldata: `0x${string}`[] = []
      const deadline = toHex(options.deadline)
      // const _tokenId = toHex(tokenId)

      const partialPosition = new Position({
        pool: position.pool,
        liquidity: options.liquidityPercentage.multiply(position.liquidity)
          .quotient,
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
      })

      invariant(
        JSBI.greaterThan(partialPosition.liquidity, JSBI.BigInt(0)),
        'ZERO_LIQUIDITY',
      )
      const { amount0: amount0Min, amount1: amount1Min } =
        partialPosition.burnAmountsWithSlippage(options.slippageTolerance)

      // if (options.permit) {
      //   calldatas.push(
      //     encodeFunctionData({
      //       abi: NPM_V3_ABI,
      //       functionName: 'permit',
      //       args: [
      //         validateAndParseAddress(options.permit.spender) as Address,
      //         tokenId,
      //         BigInt(options.permit.deadline),
      //         options.permit.v,
      //         options.permit.r,
      //         options.permit.s,
      //       ],
      //     }),
      //   )
      // }

      calldata.push(
        encodeFunctionData({
          abi: NPM_V3_ABI,
          functionName: 'decreaseLiquidity',
          args: [
            {
              tokenId,
              liquidity: BigInt(partialPosition.liquidity.toString()),
              amount0Min: BigInt(amount0Min.toString()),
              amount1Min: BigInt(amount1Min.toString()),
              deadline: BigInt(deadline),
            },
          ],
        }),
      )

      const { currencyO, currency1 } = options
      const involvesETH =
        currencyO.currency.isNative || currency1.currency.isNative

      calldata.push(
        encodeFunctionData({
          abi: NPM_V3_ABI,
          functionName: 'collect',
          args: [
            {
              tokenId,
              recipient: involvesETH ? zeroAddress : userAddress,
              amount0Max: maxUint128,
              amount1Max: maxUint128,
            },
          ],
        }),
      )

      if (involvesETH) {
        const ethAmount = currencyO.currency.isNative
          ? currencyO.quotient
          : currency1.quotient
        const token = currencyO.currency.isNative
          ? currency1.currency
          : currencyO.currency
        const tokenAmount = currencyO.currency.isNative
          ? currency1.quotient
          : currencyO.quotient

        calldata.push(
          encodeFunctionData({
            abi: NPM_V3_ABI,
            functionName: 'unwrapWETH9',
            args: [BigInt(ethAmount.toString()), userAddress],
          }),
        )
        calldata.push(
          encodeFunctionData({
            abi: NPM_V3_ABI,
            functionName: 'sweepToken',
            args: [
              getAddress(token.wrapped.address),
              BigInt(tokenAmount.toString()),
              userAddress,
            ],
          }),
        )
      }

      // remove 100% liquidity + shouldBurn = true
      if (options.liquidityPercentage.equalTo(JSBI.BigInt(1)) && shouldBurn) {
        calldata.push(
          encodeFunctionData({
            abi: NPM_V3_ABI,
            functionName: 'burn',
            args: [tokenId],
          }),
        )
      }

      const data = encodeFunctionData({
        abi: NPM_V3_ABI,
        functionName: 'multicall',
        args: [calldata],
      })

      const txHash = await sendTxn(
        key,
        stakeId,
        getAddress(contracts.uniswap.NFP[chainId]),
        data,
      )

      if (!txHash) {
        setPending(false)
        return
      }

      endTxn({
        key,
        final: 'Claim reward successfully',
        link: getTransactionLink({ chainId, hash: txHash }),
      })
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
      sendTxn,
      startTxn,
      userAddress,
      writeTxn,
    ],
  )

  return { claim, pending }
}

export function useAddLiquidity() {
  const { address: account, chainId = 1 } = useAccount()
  const [pending, setPending] = useState(false)
  const { startTxn, writeTxn, endTxn, sendTxn } = useTxn(chainId)

  const addLiquidity = useCallback(
    async ({
      amountA: _amountA,
      amountB: _amountB,
      baseCurrency,
      quoteCurrency,
      mintInfo,
      slippage,
      deadline,
      callback,
    }: {
      amountA: string
      amountB: string
      baseCurrency: Currency
      quoteCurrency: Currency
      mintInfo: any
      slippage: number
      deadline: number
      callback: () => void
    }) => {
      try {
        const key = uuidv4()
        const approve1Id = uuidv4()
        const approve2Id = uuidv4()
        const createPoolId = uuidv4()
        const addLiquidityId = uuidv4()

        const allowedSlippage = new Percent(
          JSBI.BigInt(slippage * 100),
          JSBI.BigInt(10000),
        )

        const amountA = toWei(_amountA, baseCurrency.decimals)
        const amountB = toWei(_amountB, quoteCurrency.decimals)

        const { position, noLiquidity } = mintInfo
        const NPM_V3_ADDRESS = getAddress(contracts.uniswap.NFP[chainId])
        const baseCurrencyAddress = getAddress(baseCurrency.wrapped.address)
        const quoteCurrencyAddress = getAddress(quoteCurrency.wrapped.address)

        const allowance1 = (await readContract({
          abi: erc20Abi,
          functionName: 'allowance',
          address: baseCurrencyAddress,
          args: [account, NPM_V3_ADDRESS],
        })) as bigint

        const isFirstApproved = amountA.lte(allowance1.toString())

        const allowance2 = (await readContract({
          abi: erc20Abi,
          functionName: 'allowance',
          address: quoteCurrencyAddress,
          args: [account, NPM_V3_ADDRESS],
        })) as bigint

        const isSecondApproved = amountB.lte(allowance2.toString())

        const transactions: WillExecuteTxs = {}
        if (!isFirstApproved) {
          transactions[approve1Id] = {
            desc: `Approve ${baseCurrency.symbol}`,
            status: TXN_STATUS.START,
            hash: null,
          }
        }

        if (!isSecondApproved) {
          transactions[approve2Id] = {
            desc: `Approve ${quoteCurrency.symbol}`,
            status: TXN_STATUS.START,
            hash: null,
          }
        }

        if (noLiquidity) {
          transactions[createPoolId] = {
            desc: 'Create pool',
            status: TXN_STATUS.START,
            hash: null,
          }
        }

        transactions[addLiquidityId] = {
          desc: noLiquidity ? 'Create pool and add liquidity' : 'Add Liquidity',
          status: TXN_STATUS.START,
          hash: null,
        }

        startTxn({
          key,
          transactions,
          title: noLiquidity
            ? 'Create pool and add liquidity'
            : 'Add Liquidity',
        })
        setPending(true)

        // MARK: APPROVE TOKENS
        if (!isFirstApproved) {
          if (
            !(await writeTxn(key, approve1Id, {
              abi: erc20Abi,
              address: baseCurrencyAddress,
              functionName: 'approve',
              args: [NPM_V3_ADDRESS, maxUint256],
            }))
          ) {
            setPending(false)
            return
          }
        }

        if (!isSecondApproved) {
          if (
            !(await writeTxn(key, approve1Id, {
              abi: erc20Abi,
              address: quoteCurrencyAddress,
              functionName: 'approve',
              args: [NPM_V3_ADDRESS, maxUint256],
            }))
          ) {
            setPending(false)
            return
          }
        }

        // MARK: CREATE NEW NORMAL POOL
        if (noLiquidity) {
          const txHash = await writeTxn(key, createPoolId, {
            abi: NPM_V3_ABI,
            address: NPM_V3_ADDRESS,
            functionName: 'createAndInitializePoolIfNecessary',
            args: [
              position.pool.sqrtRatioX96,
              position.pool.token0.address,
              position.pool.token1.address,
            ],
          })
          if (!txHash) {
            setPending(false)
            return
          }
        }

        // MARK: ADD LIQUIDITY TO POOL
        const timestamp =
          Math.floor(new Date().getTime() / 1000) + deadline * 60
        const useNative = baseCurrency.isNative
          ? baseCurrency
          : quoteCurrency.isNative
            ? quoteCurrency
            : undefined

        const calldata: `0x${string}`[] = []
        // const { calldata, value } =
        //   NonfungiblePositionManager.addCallParameters(position, {
        //     slippageTolerance: allowedSlippage,
        //     recipient: account,
        //     deadline: timestamp.toString(),
        //     useNative,
        //     createPool: noLiquidity,
        //     chainId,
        //   })

        const txHash = await sendTxn(
          key,
          addLiquidityId,
          NPM_V3_ADDRESS,
          calldata,
          // value,
        )
        if (!txHash) {
          setPending(false)
          return
        }

        endTxn({ key, final: 'Liquidity Add Successful' })
        setPending(false)
        if (callback) callback()
      } catch (e) {
        setPending(false)
        throw e
      }
    },
    [account, chainId, endTxn, sendTxn, startTxn, writeTxn],
  )

  return { addLiquidity, pending }
}
