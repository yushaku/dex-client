import { useTransactionStore } from '@/stores/transaction'
import { TXN_STATUS, cn } from '@/utils'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { CircleCheckIcon, CircleXIcon, Clock2Icon, XIcon } from 'lucide-react'
import { Button } from '../common/Button'
import { Spinner } from '../common/Loading'

export const TxModalLoading = () => {
  const { popup, title, transactions, closeTransaction } = useTransactionStore()

  return (
    <Dialog open={popup} onClose={closeTransaction} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/80" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-2">
        <DialogPanel className="relative w-96 space-y-4 rounded-lg bg-layer p-5">
          <DialogTitle className="text-lg font-bold text-lighterAccent">
            {title}
          </DialogTitle>

          <Button
            variant="standard"
            onClick={closeTransaction}
            icon={XIcon}
            className="absolute right-3 top-2 border-none p-2"
          />

          <ul className="grid gap-3 pt-5">
            {Object.entries(transactions).map((tx) => {
              const [key, value] = tx

              return (
                <li
                  key={key}
                  className="flex justify-between rounded-lg bg-background p-4"
                >
                  <span className="text-textSecondary"> {value.desc} </span>

                  <span
                    className={cn({
                      hidden: value.status !== TXN_STATUS.PENDING,
                    })}
                  >
                    <Spinner className="size-5" />
                  </span>

                  <span
                    className={cn({
                      hidden: value.status !== TXN_STATUS.WAITING,
                    })}
                  >
                    <Spinner className="size-5" />
                  </span>

                  <span
                    className={cn({
                      hidden: value.status !== TXN_STATUS.SUCCESS,
                    })}
                  >
                    <CircleCheckIcon className="size-5 stroke-green-500" />
                  </span>

                  <span
                    className={cn({
                      hidden: value.status !== TXN_STATUS.FAILED,
                    })}
                  >
                    <CircleXIcon className="size-5 stroke-red-500" />
                  </span>

                  <span
                    className={cn({
                      hidden: value.status !== TXN_STATUS.START,
                    })}
                  >
                    <Clock2Icon className="size-5 fill-gray-400" />
                  </span>
                </li>
              )
            })}
          </ul>

          {/* <Button */}
          {/*   className="w-full" */}
          {/*   variant="filled" */}
          {/*   // title={isPending ? 'Loading...' : 'Confirm'} */}
          {/*   type="submit" */}
          {/*   // disabled={isPending} */}
          {/*   onClick={() => { }} */}
          {/* /> */}
        </DialogPanel>
      </div>
    </Dialog>
  )
}
