import { arbitrum, bsc, mainnet } from 'viem/chains'

export const getTopAssets = (chainId: number) => {
  switch (chainId) {
    case bsc.id:
      return [
        {
          name: 'BTCB Token',
          symbol: 'BTC',
          decimals: 18,
          chainId: 56,
          address: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
          logoURI: 'https://cdn.thena.fi/assets/BTCB.png',
        },
        {
          name: 'Ethereum Token',
          symbol: 'ETH',
          decimals: 18,
          chainId: 56,
          address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
          logoURI: 'https://cdn.thena.fi/assets/ETH.png',
        },
        {
          name: 'Wrapped BNB',
          symbol: 'WBNB',
          decimals: 18,
          chainId: 56,
          address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
          logoURI: 'https://cdn.thena.fi/assets/WBNB.png',
        },
        {
          name: 'SOLANA',
          symbol: 'SOL',
          decimals: 18,
          chainId: 56,
          address: '0x570a5d26f7765ecb712c0924e4de545b89fd43df',
          logoURI: 'https://cdn.thena.fi/assets/SOL.png',
        },
        {
          name: 'Tether USD',
          symbol: 'USDT',
          decimals: 6,
          chainId: 56,
          address: '0x55d398326f99059ff775485246999027b3197955',
          logoURI: 'https://cdn.thena.fi/assets/USDT.png',
        },
        {
          name: 'Dai Token',
          symbol: 'DAI',
          decimals: 18,
          chainId: 56,
          address: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
          logoURI: 'https://cdn.thena.fi/assets/DAI.png',
        },
        {
          name: 'USD Coin',
          symbol: 'USDC',
          decimals: 6,
          chainId: 56,
          address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
          logoURI: 'https://cdn.thena.fi/assets/USDC.png',
        },
        {
          name: 'First Digital USD',
          symbol: 'FDUSD',
          decimals: 18,
          chainId: 56,
          address: '0xc5f0f7b66764f6ec8c8dff7ba683102295e16409',
          logoURI: 'https://cdn.thena.fi/assets/FDUSD.png',
        },
      ]

    case 1337:
    case mainnet.id:
      return [
        {
          name: 'WBTC Token',
          symbol: 'BTC',
          decimals: 18,
          chainId: 56,
          address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
          logoURI: 'https://cdn.thena.fi/assets/BTCB.png',
        },
        {
          name: 'Ethereum Token',
          symbol: 'ETH',
          decimals: 18,
          chainId: 56,
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          logoURI: 'https://cdn.thena.fi/assets/ETH.png',
        },
        {
          name: 'Wrapped BNB',
          symbol: 'WBNB',
          decimals: 18,
          chainId: 56,
          address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
          logoURI: 'https://cdn.thena.fi/assets/WBNB.png',
        },
        {
          name: 'ChainLink Token',
          symbol: 'LINK',
          decimals: 18,
          chainId: 56,
          address: '0x514910771af9ca656af840dff83e8264ecf986ca',
          logoURI: 'https://arbiscan.io/token/images/chainlink_32.png?v=1',
        },
        {
          name: 'Tether USD',
          symbol: 'USDT',
          decimals: 6,
          chainId: 56,
          address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          logoURI: 'https://cdn.thena.fi/assets/USDT.png',
        },
        {
          name: 'Dai Token',
          symbol: 'DAI',
          decimals: 18,
          chainId: 56,
          address: '0x6b175474e89094c44da98b954eedeac495271d0f',
          logoURI: 'https://cdn.thena.fi/assets/DAI.png',
        },
        {
          name: 'USD Coin',
          symbol: 'USDC',
          decimals: 6,
          chainId: 56,
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          logoURI: 'https://cdn.thena.fi/assets/USDC.png',
        },
        {
          name: 'USDe',
          symbol: 'USDe',
          decimals: 18,
          chainId: 56,
          address: '0x4c9edd5852cd905f086c759e8383e09bff1e68b3',
          logoURI: 'https://etherscan.io/token/images/ethenausde_32.svg',
        },
      ]

    case arbitrum.id:
      return [
        {
          name: 'BTCB Token',
          symbol: 'BTC',
          decimals: 18,
          chainId: 56,
          address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
          logoURI: 'https://cdn.thena.fi/assets/BTCB.png',
        },
        {
          name: 'Ethereum Token',
          symbol: 'ETH',
          decimals: 18,
          chainId: 56,
          address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
          logoURI: 'https://cdn.thena.fi/assets/ETH.png',
        },
        {
          name: 'ChainLink Token',
          symbol: 'LINK',
          decimals: 18,
          chainId: 56,
          address: '0xf97f4df75117a78c1a5a0dbb814af92458539fb4',
          logoURI: 'https://arbiscan.io/token/images/chainlink_32.png?v=1',
        },
        {
          name: 'Arbitrum',
          symbol: 'ARB',
          decimals: 18,
          chainId: 56,
          address: '0x912ce59144191c1204e64559fe8253a0e49e6548',
          logoURI: 'https://arbiscan.io/token/images/arbitrumone2_32_new.png',
        },
        {
          name: 'Tether USD',
          symbol: 'USDT',
          decimals: 6,
          chainId: 56,
          address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
          logoURI: 'https://cdn.thena.fi/assets/USDT.png',
        },
        {
          name: 'Dai Token',
          symbol: 'DAI',
          decimals: 18,
          chainId: 56,
          address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
          logoURI: 'https://cdn.thena.fi/assets/DAI.png',
        },
        {
          name: 'USD Coin',
          symbol: 'USDC',
          decimals: 6,
          chainId: 56,
          address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
          logoURI: 'https://cdn.thena.fi/assets/USDC.png',
        },
        {
          name: 'USDe',
          symbol: 'USDe',
          decimals: 18,
          chainId: 56,
          address: '0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34',
          logoURI: 'https://arbiscan.io/token/images/ethenausde_32.png',
        },
      ]

    default:
      return []
  }
}
