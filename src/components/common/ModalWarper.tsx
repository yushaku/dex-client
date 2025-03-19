import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/16/solid'
import { Fragment } from 'react'

type Props = {
  isOpen: boolean
  handleClose: () => void
  children: JSX.Element
  title: string
  subtitle?: string
}

export function ModalWarp({
  children,
  title,
  subtitle,
  isOpen,
  handleClose,
}: Props) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 bg-gray-700/30" aria-hidden="true" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-fit rounded-2xl bg-background p-6 text-left align-middle shadow-xl transition-all">
                <button className="absolute right-5 top-5">
                  <XCircleIcon
                    onClick={handleClose}
                    className="size-6 fill-white hover:fill-lighterAccent"
                  />
                </button>

                <Dialog.Title className="text-xl font-medium text-lighterAccent">
                  {title}
                </Dialog.Title>

                <p className={`mb-5 text-sm text-gray-500`}>{subtitle}</p>

                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
