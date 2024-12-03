/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReadContractParameters,
  readContract as _readContract,
  sendTransaction as _sendTransaction,
  simulateContract as _simulateContract,
  waitForTransactionReceipt as _waitForTransactionReceipt,
  writeContract as _writeContract,
} from '@wagmi/core'
import { Address } from 'viem'
import { createConfig, http } from 'wagmi'
import { bsc, bscTestnet } from 'wagmi/chains'

// declare module 'wagmi' {
//   interface Register {
//     config: typeof config
//   }
// }

export const config = createConfig({
  ssr: true,
  chains: [bscTestnet, bsc],
  connectors: [
    // walletConnect({ projectId: env.VITE_WALLET_CONNECT_ID }),
  ],
  transports: {
    [bscTestnet.id]: http(),
    [bsc.id]: http(),
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
  abi: any
  chainId: number
  value: any
}) =>
  _writeContract(config, {
    ...contract,
  })

export const sendTransaction = async (contract: {
  to: Address
  data: any
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
  abi: any
  chainId: number
}) => {
  const res = await _simulateContract(config, {
    ...contract,
  })
  return res.result
}
