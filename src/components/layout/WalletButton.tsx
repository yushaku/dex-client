import { useUser, useAuthModal } from '@account-kit/react'
import { cn, shortenAddress } from '@/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { Button } from '../ui/button'
import { toast } from 'react-toastify'
import { useLogout } from '@account-kit/react'

export const WalletButton = (
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) => {
  const user = useUser()
  const { openAuthModal } = useAuthModal()
  const { logout } = useLogout()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  console.log({ user })

  if (!user) {
    return (
      <button
        onClick={() => openAuthModal()}
        className={cn('rounded-lg bg-accent px-6 py-2', props.className)}
      >
        Connect Wallet
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className={cn('rounded-lg bg-accent px-6 py-2', props.className)}
      >
        {shortenAddress(user.address)}
      </button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="flex gap-2">
              <span className="font-medium">Address:</span>
              <span className="text-muted-foreground">
                {shortenAddress(user.address)}
              </span>
            </p>

            <div className="flex gap-2">
              <Button
                className="flex-1 cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(user.address)
                  toast.success('Address copied to clipboard')
                }}
              >
                Copy address
              </Button>

              <Button
                className="flex-1 cursor-pointer"
                onClick={() => {
                  logout()
                  setIsDialogOpen(false)
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
