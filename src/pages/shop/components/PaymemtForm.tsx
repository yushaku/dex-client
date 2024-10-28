import {
  OrderResponse,
  StreetAddress,
  useCreateOrder,
  useGetAddresses
} from '@/apis'
import { Button } from '@/components/common/Button'
import { SHOP_PAYMENT_ADDRESS, cn } from '@/utils'
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Radio,
  RadioGroup
} from '@headlessui/react'
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { shortenString } from '@thirdweb-dev/react'
import { useEffect, useState } from 'react'
import { parseEther } from 'viem'
import { useSendTransaction } from 'wagmi'
import { useCartState } from '../states'
import { AddressForm } from './AddressForm'
import { Spinner } from '@/components/common/Loading'
import { toast } from 'react-toastify'

const initialOrder = {
  encodeData: '',
  unit: 'ETH',
  order: {
    order_id: '',
    price_in_token: ''
  },
  orderList: []
}

export const PaymentForm = () => {
  // GLOCAL STATE
  const { itemList, clearCart } = useCartState()
  const { isSuccess, isPending, isError, sendTransaction } =
    useSendTransaction()

  // LOCAL STATE
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<StreetAddress | null>(null)
  const [step, setStep] = useState(1)
  const [order, setOrder] = useState<OrderResponse>(initialOrder)

  // CALL APIs
  const { data: addressList } = useGetAddresses({
    options: {
      enabled: true,
      refetchOnWindowFocus: true
    }
  })
  const { mutateAsync: createOrder } = useCreateOrder()

  useEffect(() => {
    if (addressList) setSelected(addressList[0])
  }, [addressList])

  const handleNext = async () => {
    if (!selected) return

    if (!order.encodeData) {
      const data = await createOrder({
        address_id: selected.address_id,
        products: itemList.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      })
      setOrder(data)
    }

    setStep(2)
  }

  const handleConfirm = async () => {
    sendTransaction(
      {
        to: SHOP_PAYMENT_ADDRESS,
        data: order.encodeData as `0x${string}`,
        value: parseEther(order.order.price_in_token)
      },
      {
        onSuccess: () => {
          setStep(3)
          clearCart()
          setOrder(initialOrder)
        },
        onError: (e) => {
          const msg = e.message.includes('User rejected')
            ? 'User denied transaction signature'
            : 'Error: Transaction failed'
          toast.error(msg)
          setStep(4)
        },
        onSettled: () => {
          setStep(1)
        }
      }
    )
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} title="Buy" className="w-full" />

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="relative max-w-lg space-y-4 bg-layer p-12">
            <DialogTitle className="font-bold">Order Confirmation</DialogTitle>
            <Description className="text-sm">
              {step === 1 && 'Please select your address'}
              {step === 2 && 'Please complete your payment'}
              {step === 3 && !isSuccess && !isError && 'Sending transaction'}
            </Description>

            <RadioGroup
              value={selected}
              onChange={setSelected}
              aria-label="Server size"
              className={cn('space-y-2 hidden', step === 1 && 'block')}
            >
              {addressList?.map((plan) => (
                <Radio
                  key={plan.address_id}
                  value={plan}
                  className="group relative flex cursor-pointer rounded-lg bg-white/5 px-5 py-4 text-white shadow-md transition focus:outline-none data-[checked]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="text-sm/6">
                      <p className="font-semibold text-white">
                        {plan.recipient_name}
                      </p>
                      <div className="flex gap-2 text-white/50">
                        <div>{plan.city}</div>
                        <div aria-hidden="true">&middot;</div>
                        <div>{plan.street}</div>
                        <div aria-hidden="true">&middot;</div>
                        <div>{shortenString(plan.phone_number, true)}</div>
                      </div>
                    </div>

                    <CheckCircleIcon className="size-6 fill-white opacity-0 transition group-data-[checked]:opacity-100" />
                  </div>
                </Radio>
              ))}
            </RadioGroup>

            <article className={cn('text-sm hidden', step === 2 && 'block')}>
              <h6>Your order {order?.order?.order_id}</h6>
              <p className="mt-1 font-bold">
                Total: {order?.order?.price_in_token} {order.unit}
              </p>
            </article>

            <article
              className={cn(
                'justify-center hidden flex-col items-center',
                step === 3 && 'flex'
              )}
            >
              {isSuccess && (
                <>
                  <img src="/txOk.gif" alt="image" />
                  <p className="mt-1 text-xl font-bold">
                    Send transaction successfully
                  </p>
                </>
              )}
            </article>

            <article
              className={cn(
                'justify-center hidden flex-col items-center',
                step === 4 && 'flex'
              )}
            >
              {isError && (
                <>
                  <img src="/txfail.gif" alt="image" />
                  <p className="mt-1 text-xl font-bold">
                    Send transaction Failed
                  </p>
                </>
              )}
            </article>

            <article
              className={cn(
                'justify-center hidden flex-col items-center',
                step === 4 || (step == 3 && 'flex')
              )}
            >
              {isPending && (
                <>
                  <Spinner />
                  <p className="mt-1 text-xl font-bold">
                    Sending your transaction
                  </p>
                </>
              )}
            </article>

            <div className="absolute right-3 top-3">
              <Button
                variant="standard"
                onClick={() => setIsOpen(false)}
                icon={XMarkIcon}
                className="border-none p-3"
              />
            </div>

            <div className="flex justify-between gap-2">
              {step === 1 && <AddressForm />}
              {step === 2 && (
                <Button
                  variant="outline"
                  title={'back'}
                  className={cn('grow', !selected && 'hidden')}
                  onClick={() => setStep(1)}
                />
              )}

              <Button
                title={step === 1 ? 'Next' : 'Confirm'}
                className={cn(
                  'grow',
                  !selected && 'hidden',
                  step === 3 && 'hidden'
                )}
                onClick={step === 1 ? handleNext : handleConfirm}
              />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
