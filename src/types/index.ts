export * from './collections'
export * from './user'

export type ApiResponce<TData> = {
  page: number
  perPage: number
  total: number
  data: Array<TData>
}
