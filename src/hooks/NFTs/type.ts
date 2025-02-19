export type CollectionNft = {
  cohort: string
  name: string
  collectionSymbol: string
  collectionId: string
  vol: number
  totalVol: number
  totalTxns: number
  volPctChg: number
  txns: number
  txnsPctChg: number
  fp: number
  fpPctChg: number
  fpListingPrice: number
  fpListingCurrency: string
  highestGlobalOffer: number
  highestGlobalOfferBidPrice: number
  highestGlobalOfferBidCurrency: string
  marketCap: number
  totalSupply: number
  listedCount: number
  ownerCount: number
  uniqueOwnerRatio: number
  image: string
  isCompressed: boolean
  isVerified: boolean
  hasInscriptions: boolean
  currency: string
  currencyUsdRate: number
  marketCapUsd: number
  fpSparkLinePath: string
}

export type NftDetail = {
  token: NftToken
  market: Market
  updatedAt: string
  media: Media
}

export interface NftToken {
  rarity: string
  chainId: number
  contract: string
  tokenId: string
  name: string
  description: string
  image: string
  imageSmall: string
  imageLarge: string
  metadata: Metadata
  kind: string
  isFlagged: boolean
  isSpam: boolean
  isNsfw: boolean
  metadataDisabled: boolean
  lastFlagUpdate: string
  supply: string
  remainingSupply: string
  collection: Collection
  owner: string
  mintedAt: string
  createdAt: string
}

interface Metadata {
  imageOriginal: string
  imageMimeType: string
  tokenURI: string
}

interface Collection {
  id: string
  name: string
  image: string
  slug: string
  symbol: string
  creator: string
  tokenCount: number
  metadataDisabled: boolean
  floorAskPrice: FloorAskPrice
}

interface FloorAskPrice {
  currency: Currency
  amount: Amount
}

interface Currency {
  contract: string
  name: string
  symbol: string
  decimals: number
}

interface Amount {
  raw: string
  decimal: number
  usd: number
  native: number
}

interface Market {
  floorAsk: FloorAsk
}

interface FloorAsk {
  id: string
  price: Price
  maker: string
  validFrom: number
  validUntil: number
  source: Source
}

interface Price {
  currency: Currency2
  amount: Amount2
}

interface Currency2 {
  contract: string
  name: string
  symbol: string
  decimals: number
}

interface Amount2 {
  raw: string
  decimal: number
  usd: number
  native: number
}

interface Source {
  id: string
  domain: string
  name: string
  icon: string
  url: string
}

interface Media {
  image: string
  imageMimeType: string
}
