import { arbitrum, bsc, bscTestnet, mainnet } from 'viem/chains'

export const contracts = {
  odos: {
    [bsc.id]: '0x89b8AA89FDd0507a99d334CBe3C808fAFC7d850E',
    [mainnet.id]: '0xCf5540fFFCdC3d510B18bFcA6d2b9987b0772559',
    [arbitrum.id]: '0xa669e7A0d4b3e4Fa48af2dE86BD4CD7126Be4e13',
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
  STAKING_ETH: {
    LIDO: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
  },
  RESTAKING_ETH: {
    RENZO: {
      PROTOCOL: '0x74a09653A083691711cF8215a6ab074BB4e99ef5',
      ezETH: '0xbf5495Efe5DB9ce00f80364C8B423567e58d2110',
    },
  },
  WST_ETH: {
    [mainnet.id]: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
  },
  YSK: {
    [bscTestnet.id]: '0x7AFa15757A8012C3ECc0948154AD0f99c3b3c116',
  },
} as const
