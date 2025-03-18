/* eslint-disable no-unused-vars */
export type FeeData = {
  feeAmount: number
  tickSpacing: number
}

export enum PoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}
