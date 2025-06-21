import axios from 'axios'
import { env } from '@/utils'

// Portfolio API instance
const portfolioApiInstance = axios.create({
  baseURL: `https://api.g.alchemy.com/data/v1/${env.VITE_ALCHEMY_API_KEY}`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// NFT API instance (different base URL)
const nftApiInstance = axios.create({
  baseURL: `https://eth-mainnet.g.alchemy.com/v2/${env.VITE_ALCHEMY_API_KEY}`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface NFTContract {
  network: string
  address: string
  contract: {
    address: string
    name: string
    symbol: string
    totalSupply: string
    tokenType: 'ERC721' | 'ERC1155'
    contractDeployer: string
    deployedBlockNumber: number
    openseaMetadata?: {
      floorPrice: number
      collectionName: string
      safelistRequestStatus: string
      imageUrl: string
      description: string
      externalUrl: string
      twitterUsername: string
      discordUrl: string
      lastIngestedAt: string
    }
    isSpam: boolean
    spamClassifications: string[]
  }
}

export interface NFTContractsResponse {
  data: {
    contracts: NFTContract[]
    totalCount: number
    pageKey?: string
  }
}

export interface GetNFTContractsParams {
  addresses: Array<{
    address: string
    networks: string[]
  }>
  withMetadata?: boolean
  pageKey?: string
  pageSize?: number
}

export interface NFT {
  contract: {
    address: string
    name: string
    symbol: string
    tokenType: 'ERC721' | 'ERC1155'
    tokenId: string
    tokenUri?: string
    metadata?: {
      name?: string
      description?: string
      image?: string
      external_url?: string
      attributes?: Array<{
        trait_type: string
        value: string | number
      }>
    }
  }
  title: string
  description: string
  tokenUri: string
  media: Array<{
    raw: string
    gateway: string
    thumbnail: string
    format: string
    bytes: number
  }>
  metadata: {
    name: string
    description: string
    image: string
    external_url: string
    attributes: Array<{
      trait_type: string
      value: string | number
    }>
  }
  timeLastUpdated: string
  contractMetadata: {
    name: string
    symbol: string
    tokenType: string
    contractDeployer: string
    deployedBlockNumber: number
    openSea: {
      floorPrice: number
      collectionName: string
      safelistRequestStatus: string
      imageUrl: string
      description: string
      externalUrl: string
      twitterUsername: string
      discordUrl: string
      lastIngestedAt: string
    }
  }
}

export interface GetNFTsResponse {
  ownedNfts: NFT[]
  totalCount: string
  pageKey?: string
}

export interface GetNFTsParams {
  owner: string
  contractAddresses?: string[]
  withMetadata?: boolean
  pageSize?: number
  pageKey?: string
  tokenUriTimeoutInMs?: number
}

export const getNFTContractsByAddress = async (
  params: GetNFTContractsParams,
): Promise<NFTContractsResponse> => {
  try {
    const response = await portfolioApiInstance.post(
      `/assets/nfts/contracts/by-address`,
      params,
    )
    return response.data
  } catch (error) {
    console.error('Alchemy Portfolio API Error:', error)
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data)
      console.error('Response status:', error.response?.status)
      console.error('Request URL:', error.config?.url)
      console.error('Request data:', error.config?.data)
    }
    throw error
  }
}

export const getNFTs = async (
  params: GetNFTsParams,
): Promise<GetNFTsResponse> => {
  try {
    // Try different parameter formats based on Alchemy documentation
    const requestParams: any = {
      owner: params.owner,
      withMetadata: params.withMetadata,
      pageSize: params.pageSize,
      tokenUriTimeoutInMs: params.tokenUriTimeoutInMs,
    }

    // Add contract addresses if provided
    if (params.contractAddresses && params.contractAddresses.length > 0) {
      // Try as comma-separated string first
      requestParams.contractAddresses = params.contractAddresses.join(',')
    }

    // Add page key if provided
    if (params.pageKey) {
      requestParams.pageKey = params.pageKey
    }

    console.log('NFT API Request Params:', requestParams)

    const response = await nftApiInstance.get(`/getNFTs`, {
      params: requestParams,
    })
    return response.data
  } catch (error) {
    console.error('Alchemy NFT API Error:', error)
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data)
      console.error('Response status:', error.response?.status)
      console.error('Request URL:', error.config?.url)
      console.error('Request params:', error.config?.params)
      console.error('Full error response:', error.response)
    }
    throw error
  }
}
