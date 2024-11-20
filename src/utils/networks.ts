/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReadContractParameters,
  readContract,
  sendTransaction,
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
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

export const read = async (
  contract: ReadContractParameters<any, string, any[], any>,
) =>
  readContract(config, {
    ...contract,
  })

export const writeCall = async (contract: {
  functionName: string
  args: Array<any>
  address: Address
  abi: any
  chainId: number
  value: any
}) =>
  writeContract(config, {
    ...contract,
  })

export const sendCall = async (contract: {
  to: Address
  data: any
  value: any
  chainId: number
}) =>
  sendTransaction(config, {
    ...contract,
  })

export const waitCall = async (hash: `0x${string}`) =>
  waitForTransactionReceipt(config, {
    hash,
  })

export const simulateCall = async (contract: {
  functionName: string
  args: Array<any>
  address: Address
  abi: any
  chainId: number
}) => {
  const res = await simulateContract(config, {
    ...contract,
  })
  return res.result
}
