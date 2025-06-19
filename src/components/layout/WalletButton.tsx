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
import { useLogout } from '@account-kit/react'
import { createAvatar } from '@/utils/avatar'
import { LogOut } from 'lucide-react'

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
      <Button
        variant="accent"
        size="default"
        onClick={() => setIsDialogOpen(true)}
        className={cn(props.className)}
      >
        {user.email ? user.email : shortenAddress(user.address)}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div
                style={createAvatar(user.address)}
                className="size-10 rounded-full"
              ></div>
              <span>Account</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="flex gap-2">
              <span className="font-medium">Type:</span>
              <span className="text-muted-foreground">
                {user.type === 'eoa'
                  ? 'Externally Owned Account'
                  : 'Smart Account'}
              </span>
            </p>
            <p className="flex gap-2">
              <span className="font-medium">EVM Address:</span>
              <span className="text-muted-foreground">
                {shortenAddress(user.address)}
              </span>
            </p>

            {user.solanaAddress && (
              <p className="flex gap-2">
                <span className="font-medium">Solana Address:</span>
                <span className="text-muted-foreground">
                  {shortenAddress(user.solanaAddress)}
                </span>
              </p>
            )}

            <div className="flex gap-2">
              <Button
                className="flex-1 cursor-pointer"
                onClick={() => {
                  logout()
                  setIsDialogOpen(false)
                }}
              >
                <LogOut className="size-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
