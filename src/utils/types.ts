import { Log } from 'viem'
import { assets } from './assets'

export type Data = {
  address: string
}

export enum LOCAL_STORAGE {
  SHOP_NFT = 'SHOP_NFT'
}

export type Address = `0x${string}`

export type LogTX = Log & { args: any }

export type NftCart = Record<string, ItemNft>

export type ItemNft = {
  address: string
  title: string
  name: string
  price: number
  cip: number
  url: string
}

export type Asset = (typeof assets)[number]
