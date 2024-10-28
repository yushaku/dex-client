import { LOGIN_MESSAGE, config } from '@/utils'
import { signMessage } from '@wagmi/core'
import instance from './client'

export async function checkUser(address?: string) {
  if (!address) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signedMessage = await signMessage(config as any, {
    message: LOGIN_MESSAGE,
    account: address
  })

  console.log({
    address,
    signedMessage
  })

  await instance.post('auth/login', {
    address,
    signedMessage
  })
}
