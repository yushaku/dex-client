export type Data = {
  address: string
}

export enum LOCAL_STORAGE {
  SHOP_NFT = 'SHOP_NFT',
}

export type NftCart = Record<string, ItemNft>

export type ItemNft = {
  address: string
  title: string
  name: string
  price: number
  cip: number
  url: string
}

export type Asset = {
  address: string
  decimals: number
  symbol: string
  name: string
  logoURI: string
}
