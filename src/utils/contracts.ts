import { bsc, bscTestnet } from 'viem/chains'

export const contracts = {
  odos: {
    [bsc.id]: '0x89b8AA89FDd0507a99d334CBe3C808fAFC7d850E',
  },
  SHOP_PAYMENT: {
    [bsc.id]: '',
    [bscTestnet.id]: '0x6b3De2f71bbeeEc360Cd50f6C19Daf13534bE8EA',
  },
  NFT_FACTORY: {
    [bsc.id]: '',
    [bscTestnet.id]: '0x64FFE32eCb2D433fc0868920c98Bf33Bee4f072A',
  },
  MARKETPLACE: {
    [bsc.id]: '',
    [bscTestnet.id]: '0x7175AAA9f0b6B05fe713AEFDD7B0026e61bd7aC5',
  },
} as const
