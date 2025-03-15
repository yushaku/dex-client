import { GraphQLClient } from 'graphql-request'
import { env } from './constant'

export const uniSubgraphClient = new GraphQLClient(env.VITE_SUBGRAPH_TOKEN, {
  headers: {
    authorization: `Bearer ${env.VITE_SUBGRAPH_TOKEN}`,
  },
})

// prettier-ignore
const subgraphUniswapUrl: { [key: number]: { [key: number]: string } } = {
  3: {
    1: 'https://gateway.thegraph.com/api/{api-key}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV',
    56: 'https://gateway.thegraph.com/api/{api-key}/subgraphs/id/8f1KyiuNYiNGrjagzEVpf6k6KkPG517prtjdrJihgHw',
    42161: 'https://gateway.thegraph.com/api/{api-key}/subgraphs/id/FQ6JYszEKApsBpAmiHesRsd9Ygc6mzmpNRANeVQFYoVX',
  },
  4: {
    1: 'https://gateway.thegraph.com/api/[api-key]/subgraphs/id/DiYPVdygkfjDWhbxGSqAQxwBKmfKnkWQojqeM2rkLb3G',
    56: 'https://gateway.thegraph.com/api/[api-key]/subgraphs/id/7krGUB3mQURTaWYwU6xNTDuEA5bdaFQrtKct2UE6WabT',
    42161: 'https://gateway.thegraph.com/api/[api-key]/subgraphs/id/7krGUB3mQURTaWYwU6xNTDuEA5bdaFQrtKct2UE6WabT',
  },
}

export const uniswapClient = (
  version: keyof typeof subgraphUniswapUrl = 3,
  chainId: number = 1,
) => {
  const endpoint = subgraphUniswapUrl[version][chainId]
  return new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${env.VITE_SUBGRAPH_TOKEN}`,
    },
  })
}
