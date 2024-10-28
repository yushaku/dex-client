import { useCreateAddress } from '@/apis'
import { Button } from '@/components/common/Button'
import { cn } from '@/utils'
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Field,
  Fieldset,
  Input,
  Label,
  Select,
  Textarea
} from '@headlessui/react'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { ChangeEvent, useState } from 'react'

export const AddressForm = ({ disabled = false }: { disabled?: boolean }) => {
  const { mutateAsync: createAddress, isPending } = useCreateAddress()

  const [isOpen, setIsOpen] = useState(false)
  const [from, setForm] = useState({
    recipient: '',
    phone: '',
    address: '',
    city: 'Ha Noi',
    note: ''
  })

  const handleChange =
    (type: keyof typeof from) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...from, [type]: e.target.value })
    }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    await createAddress({
      recipient_name: from.recipient,
      phone_number: from.phone,
      street: from.address,
      city: from.city
    })
    setForm({
      recipient: '',
      phone: '',
      address: '',
      city: 'Ha Noi',
      note: ''
    })
    setIsOpen(false)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        title="Add new address"
        className={cn('w-auto', disabled && 'hidden')}
      />

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/40" />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-2">
          <DialogPanel className="relative max-w-lg space-y-4 bg-layer p-12">
            <DialogTitle className="font-bold">Add new address</DialogTitle>

            <Fieldset className="space-y-6">
              <div className="flex gap-2">
                <Field>
                  <Label className="text-sm/6 font-medium text-white">
                    Recipient name
                  </Label>
                  <Input
                    onChange={handleChange('recipient')}
                    className={cn(
                      'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                      'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                    )}
                  />
                </Field>

                <Field>
                  <Label className="text-sm/6 font-medium text-white">
                    Phone number
                  </Label>
                  <Input
                    onChange={handleChange('phone')}
                    type="tel"
                    className={cn(
                      'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                      'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                    )}
                  />
                </Field>
              </div>

              <Field>
                <Label className="text-sm/6 font-medium text-white">
                  Street address
                </Label>
                <Input
                  onChange={handleChange('address')}
                  className={cn(
                    'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                  )}
                />
              </Field>

              <Field>
                <Label className="text-sm/6 font-medium text-white">City</Label>
                <Description className="text-sm/6 text-white/50">
                  We currently only ship to HaNoi
                </Description>
                <div className="relative">
                  <Select
                    className={cn(
                      'mt-3 block w-full appearance-none rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                      'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                      '*:text-black'
                    )}
                  >
                    <option>Ha Noi</option>
                  </Select>
                  <ChevronDownIcon
                    className="group pointer-events-none absolute right-2.5 top-2.5 size-4 fill-white/60"
                    aria-hidden="true"
                  />
                </div>
              </Field>

              <Field>
                <Label className="text-sm/6 font-medium text-white">
                  Delivery notes
                </Label>
                <Description className="text-sm/6 text-white/50">
                  If you have a tiger, we'd like to know about it.
                </Description>
                <Textarea
                  onChange={handleChange('note')}
                  className={cn(
                    'mt-3 block w-full resize-none rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                  )}
                  rows={3}
                />
              </Field>
            </Fieldset>

            <div className="absolute right-3 top-3">
              <Button
                variant="standard"
                onClick={() => setIsOpen(false)}
                icon={XMarkIcon}
                className="border-none p-3"
              />
            </div>

            <Button
              className="w-full"
              variant="outline"
              title={isPending ? 'Loading...' : 'Save'}
              type="submit"
              disabled={isPending}
              onClick={handleSubmit}
            />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
