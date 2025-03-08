import { cleanEnv, str } from 'envalid'
import { parseUnits } from 'viem'

export const env = cleanEnv(import.meta.env, {
  VITE_WALLET_CONNECT_ID: str(),
  VITE_INFURA_KEY: str(),
  VITE_MORALIS_API_KEY: str(),
  VITE_THIRD_WEB: str(),
  VITE_THIRD_WEB_SECRET: str(),
  VITE_OWNER_ADDRESS: str(),
  VITE_GRAPHQL_CMS_ENDPOINT: str(),
  VITE_GRAPHQL_CMS_TOKEN: str(),
  VITE_PINATA_KEY: str(),
  VITE_PINATA_SECRET: str(),
  VITE_API_ENPOINT: str({ default: 'http://localhost:8080' }),
  VITE_ENV: str({ default: 'development' }),
})

export const routes = {
  home: '/',
  trade: '/trade',
  bridge: '/trade/bridge',
  nfts: '/nfts',
  myNFTs: '/nfts/my-collection',
  nftStudio: '/nfts/studio',
  nftLaunchpad: '/nfts/launchpad',
  pools: '/pools',
  addLiquidity: '/pools/add-liquidity',
  history: '/history',
  admin: '/admin',
  dashboard: '/dashboard',
  shop: '/shop',
  order: '/shop/order',
} as const

export const UNKNOWN_TOKEN = 'https://cdn.thena.fi/assets/UNKNOWN_TOKEN.png'
export const GATEWAY_URL = 'https://ipfs.io/ipfs/'
export const TOKEN_LIST = 'https://gateway.ipfs.io/ipns/tokens.uniswap.org'
export const UNI = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
export const JSON_RPC_URL = 'https://cloudflare-eth.com'
export const JSON_RPC = {
  1: [`https://mainnet.infura.io/v3/${env.VITE_INFURA_KEY}`],
  5: [`https://goerli.infura.io/v3/${env.VITE_INFURA_KEY}`],
}

export const YSK_ADDRESS = '0x7AFa15757A8012C3ECc0948154AD0f99c3b3c116'
export const USDT_ADDRESS = '0x7AFa15757A8012C3ECc0948154AD0f99c3b3c116'
export const NFT_ADRESS = '0x14a9c99d89106F66C2B86910d2C622Ce0A58C630'
export const STAKE_ADRESS = '0xb407fFcC4D82295790D684F812d97EFdbB6c3122'
export const MARKETPLACE_ADDRESS = '0x7175AAA9f0b6B05fe713AEFDD7B0026e61bd7aC5'
export const NFT_FACTORY_ADDRESS = '0x64FFE32eCb2D433fc0868920c98Bf33Bee4f072A'
export const PUBLIC_NFTS_ADDRESS = '0x284C5d066a4A2fD0163D190887fC5EFB6b4E0540'
export const SHOP_PAYMENT_ADDRESS = '0x6b3De2f71bbeeEc360Cd50f6C19Daf13534bE8EA'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const MAX_VALUE = parseUnits('9999999999999999999999', 18)

export const LOGIN_MESSAGE =
  'Welcome to Yushaku! Please sign this message to verify account ownership.'

// prettier-ignore
export const TOPICS = {
  ORDER_PAID: '0x90e1d0c46d2502169585bdac3bfaab23d6d93307febf995c863d64dafc6ab886',
  ORDER_CANCELLED: '0x7238c54289856123baca2546d37161f2e0b6967231fc8d004dd849d1f4f987e6',
  ORDER_DELIVERED: '0x0428dc7031c0c35b6cfc8c2573c1f2eecf691dcffacf2a33fd549f311ae5f29d',
}

export const TXN_STATUS = {
  START: 'start',
  WAITING: 'waiting',
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
}

export const getTokenLink = (token: string, chainId = 56) => {
  switch (chainId) {
    case 1:
      return `https://etherscan.io/token/${token}`
    case 97:
      return `https://testnet.bscscan.com/token/${token}`
    case 56:
    default:
      return `https://bscscan.com/token/${token}`
  }
}
