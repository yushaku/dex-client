/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from '@/components/common/Button'
import { cn } from '@/utils'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle
} from '@headlessui/react'
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
  icon,
  handleSubmit
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="standard"
        onClick={() => setIsOpen(true)}
        title={title}
        icon={icon}
        className={cn('w-auto', isDisabled && 'hidden')}
      />

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/40" />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-2">
          <DialogPanel className="relative max-w-lg space-y-4 bg-layer p-12">
            <DialogTitle className="text-xl font-bold">
              Add new address
            </DialogTitle>

            <p>Are you sure?</p>

            <div className="absolute right-3 top-2">
              <Button
                variant="standard"
                onClick={() => setIsOpen(false)}
                icon={XMarkIcon}
                className="border-none p-3"
              />
            </div>

            <Button
              className="w-full"
              variant="filled"
              title={isPending ? 'Loading...' : 'Confirm'}
              type="submit"
              disabled={isPending}
              onClick={() => {
                handleSubmit()
                setIsOpen(false)
              }}
            />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
