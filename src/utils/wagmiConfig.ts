/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReadContractParameters,
  readContract as _readContract,
  sendTransaction as _sendTransaction,
  simulateContract as _simulateContract,
  waitForTransactionReceipt as _waitForTransactionReceipt,
  writeContract as _writeContract,
} from '@wagmi/core'
import { Abi, Address } from 'viem'
import { createConfig, fallback, http, unstable_connector } from 'wagmi'
import { arbitrum, bsc, bscTestnet, mainnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const supportedChain = [mainnet, bsc, arbitrum, bscTestnet] as const
export const config = createConfig({
  ssr: true,
  chains: supportedChain,
  connectors: [
    // walletConnect({ projectId: env.VITE_WALLET_CONNECT_ID }),
  ],
  transports: {
    [mainnet.id]: fallback([
      unstable_connector(injected),
      http('https://eth.llamarpc.com'),
    ]),
    [arbitrum.id]: fallback([unstable_connector(injected), http()]),
    [bsc.id]: fallback([unstable_connector(injected), http()]),
    [bscTestnet.id]: fallback([unstable_connector(injected), http()]),
  },
}) as any

export const readContract = async (
  contract: ReadContractParameters<any, string, any[], any>,
) =>
  _readContract(config, {
    ...contract,
  })

export const writeContract = async (contract: {
  functionName: string
  args: Array<any>
  address: Address
  abi: Abi
  chainId: number
  value: bigint
}) =>
  _writeContract(config, {
    ...contract,
  })

export const sendTransaction = async (contract: {
  to: Address
  data: `0x${string}`
  value: any
  chainId: number
}) =>
  _sendTransaction(config, {
    ...contract,
  })

export const waitForTransaction = async (hash: `0x${string}`) =>
  _waitForTransactionReceipt(config, {
    hash,
  })

export const simulateContract = async (contract: {
  functionName: string
  args: Array<any>
  address: Address
  abi: Abi
  chainId: number
}) => {
  const res = await _simulateContract(config, {
    ...contract,
  })
  return res.result
}
