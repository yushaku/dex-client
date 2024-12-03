import { toast } from 'react-toastify'

export async function toastContractError(e: Error) {
  let msg: string

  switch (true) {
    case e.message.includes('User rejected'):
      msg = 'User denied transaction signature'
      break
    case e.message.includes('insufficient funds'):
      msg = 'Error: Insufficient funds for gas or transaction cost'
      break
    case e.message.includes('gas required exceeds allowance'):
      msg = 'Error: Gas limit too low for transaction'
      break
    case e.message.includes('nonce too low'):
      msg =
        'Error: Nonce too low. Try resetting your transaction or using a higher nonce'
      break
    case e.message.includes('network error'):
      msg = 'Error: Network error. Please check your connection'
      break
    case e.message.includes('OrderAlreadyCancelled'): {
      const orderId = extractOrderId(e.message)
      msg = `Error: The order with ID ${orderId} has already been cancelled.`
      break
    }
    case e.message.includes('Only PAID orders can be delivered'):
      msg = 'Error: Only orders with status PAID can be delivered.'
      break
    default:
      msg = 'Error: Transaction failed'
  }

  toast.error(msg)
}

// Helper function to extract orderId from error message
function extractOrderId(errorMessage: string): string {
  const match = errorMessage.match(/OrderAlreadyCancelled\(([^)]+)\)/)
  return match ? match[1] : 'unknown'
}
