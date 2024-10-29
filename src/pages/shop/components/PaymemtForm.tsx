import {
  StreetAddress,
  useCreateOrder,
  useDeleteOrders,
  useGetAddresses
} from '@/apis'
import { useGetPrice } from '@/apis/price'
import { Button } from '@/components/common/Button'
import { SelectPayToken } from '@/components/common/SelectPayToken'
import { BSC, USDT } from '@/components/icons'
import { SHOP_PAYMENT_ADDRESS, ZERO_ADDRESS, cn } from '@/utils'
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
import { toast } from 'react-toastify'
import { parseEther } from 'viem'
import { useSendTransaction } from 'wagmi'
import { useCartState } from '../states'
import { AddressForm } from './AddressForm'

type Step = 'address' | 'confirm'

export const PaymentForm = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<StreetAddress | null>(null)
  const [step, setStep] = useState<Step>('address')

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
          <DialogPanel className="relative min-w-[480px] max-w-xl space-y-4 bg-layer p-12">
            <DialogTitle className="font-bold">Order Confirmation</DialogTitle>
            <Description className="text-sm">
              {step === 'address' && 'Please select your address'}
            </Description>

            <SelectAddress
              isShow={step === 'address'}
              selected={selected}
              setSelected={(address) => setSelected(address)}
              setStep={setStep}
            />

            <ConfirmTab
              isShow={step === 'confirm'}
              setStep={setStep}
              address_id={selected?.address_id ?? 0}
            />

            <span className="absolute right-3 top-3">
              <Button
                variant="standard"
                onClick={() => setIsOpen(false)}
                icon={XMarkIcon}
                className="border-none p-3"
              />
            </span>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}

// const initialOrder = {
//   encodeData: '',
//   unit: 'ETH',
//   order: {
//     order_id: '',
//     price_in_token: ''
//   },
//   orderList: []
// }

const ConfirmTab = ({
  isShow,
  address_id,
  setStep
}: {
  isShow: boolean
  address_id: number
  setStep: (_step: Step) => void
}) => {
  // GLOCAL STORE
  const { itemList, clearCart } = useCartState()

  // CALL API
  const { isSuccess, isPending, isError, isPaused, sendTransaction } =
    useSendTransaction()
  const { mutateAsync: createOrder, isPending: isCallApi } = useCreateOrder()
  const { mutateAsync: deleteOrder } = useDeleteOrders()
  const { data: bnbPrice } = useGetPrice({ params: { symbol: 'BNB' } })

  // LOCAL STATE
  // const [order, setOrder] = useState<OrderResponse>(initialOrder)
  const [token, setToken] = useState(ZERO_ADDRESS)

  const totalUsdt = itemList.reduce((a, b) => a + Number(b.price), 0)
  const totalBnb = totalUsdt / (bnbPrice ?? 1)

  const handleConfirm = async () => {
    const data = await createOrder({
      address_id,
      token_address: token,
      products: itemList.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity
      }))
    })

    // setOrder(data)

    sendTransaction(
      {
        to: SHOP_PAYMENT_ADDRESS,
        data: data.encodeData as `0x${string}`,
        value: parseEther(data.order.price_in_token)
      },
      {
        onSuccess: () => {
          clearCart()
        },
        onError: async (e) => {
          const msg = e.message.includes('User rejected')
            ? 'User denied transaction signature'
            : 'Error: Transaction failed'
          toast.error(msg)
          await deleteOrder([data.order.order_id])
          // setStep('address')
        }
      }
    )
  }

  return (
    <>
      <article className={cn('text-sm hidden', isShow && 'block')}>
        <div
          className={cn(
            'mb-4 flex items-center justify-between',
            isError || isSuccess ? 'hidden' : 'flex'
          )}
        >
          <h6>Select payment token</h6>
          <SelectPayToken selected={token} onSelect={setToken} />
        </div>

        <ul
          className={cn(
            'flex-wrap gap-2 rounded bg-focus p-2',
            isError || isSuccess ? 'hidden' : 'flex'
          )}
        >
          {itemList.map((item) => {
            return (
              <li>
                <img
                  src={item.banner}
                  alt="image"
                  className="mb-2 size-32 rounded"
                />
                {token === ZERO_ADDRESS ? (
                  <p className="flex items-center gap-2">
                    {Number(Number(item.price) / (bnbPrice ?? 1)).toFixed(6)}
                    <BSC className="size-5" />
                  </p>
                ) : (
                  <p className="flex items-center gap-2">
                    {item.price}
                    <USDT className="size-5" />
                  </p>
                )}
              </li>
            )
          })}
        </ul>

        <p
          className={cn(
            'mt-4 flex items-center gap-4',
            isSuccess && 'hidden',
            isError && 'hidden'
          )}
        >
          <span>Total: </span>

          {token === ZERO_ADDRESS ? (
            <p className="flex items-center gap-2">
              {totalBnb.toFixed(6)}
              <BSC className="size-5" />
            </p>
          ) : (
            <p className="flex items-center gap-2">
              {totalUsdt}
              <USDT className="size-5" />
            </p>
          )}
        </p>

        <div
          className={cn(
            'mt-4 flex justify-between gap-2',
            (isCallApi || isPaused || isError || isPending || isSuccess) &&
              'hidden'
          )}
        >
          <Button
            variant="outline"
            title={'back'}
            className={cn('grow')}
            onClick={() => setStep('address')}
          />

          <Button
            title="Confirm"
            className={cn('grow')}
            onClick={handleConfirm}
          />
        </div>
      </article>

      <article className={cn('justify-center flex flex-col items-center')}>
        {isSuccess && (
          <>
            <img src="/txOk.gif" alt="image" />
            <p className="mt-1 text-xl font-bold">
              Send transaction successfully
            </p>
          </>
        )}

        {isError && (
          <>
            <img src="/txfail.gif" alt="image" />
            <p className="mt-1 text-xl font-bold">Send transaction Failed</p>
          </>
        )}

        {(isPending || isPaused || isCallApi) && (
          <>
            <img src="/catRunning.gif" alt="image" className="w-full" />
            <p className="mt-1 text-xl font-bold">Sending your transaction</p>
          </>
        )}
      </article>
    </>
  )
}

const SelectAddress = ({
  isShow,
  selected,
  setStep,
  setSelected
}: {
  isShow: boolean
  selected: StreetAddress | null
  setSelected: (_address: StreetAddress) => void
  setStep: (_step: Step) => void
}) => {
  const { data: addressList } = useGetAddresses({
    options: {
      enabled: true,
      refetchOnWindowFocus: true
    }
  })

  useEffect(() => {
    if (addressList) setSelected(addressList[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressList])

  return (
    <article className={cn('hidden', isShow && 'block')}>
      <RadioGroup
        value={selected}
        onChange={setSelected}
        aria-label="Server size"
        className={cn('space-y-2')}
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

      <div className="mt-4 flex justify-between gap-2">
        <AddressForm />

        <Button
          title="Next"
          className={cn('grow')}
          onClick={() => {
            if (!selected?.address_id) return
            setStep('confirm')
          }}
        />
      </div>
    </article>
  )
}
