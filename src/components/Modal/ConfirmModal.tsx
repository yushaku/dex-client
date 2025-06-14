/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from '@/components/ui/button'
import { cn } from '@/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { XMarkIcon } from '@heroicons/react/16/solid'
import { useState } from 'react'

type Props = {
  isDisabled?: boolean
  isPending: boolean
  title?: string
  icon?: (_props: any) => JSX.Element | any
  handleSubmit: () => void
}

export const ConfirmModal = ({
  isDisabled = false,
  isPending,
  title,
  handleSubmit,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          className={cn('w-auto', isDisabled && 'hidden')}
        >
          {title}
        </Button>
      </DialogTrigger>

      <DialogContent className="relative max-w-lg space-y-4 bg-layer p-12">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add new address
          </DialogTitle>
        </DialogHeader>

        <p>Are you sure?</p>

        <div className="absolute right-3 top-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="border-none p-3"
          >
            <XMarkIcon className="size-5" />
          </Button>
        </div>

        <Button
          className="w-full"
          type="submit"
          disabled={isPending}
          onClick={() => {
            handleSubmit()
            setIsOpen(false)
          }}
        >
          {isPending ? 'Loading...' : 'Confirm'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
