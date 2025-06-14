import { useCreateAddress } from '@/apis'
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
import { ChangeEvent, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const AddressForm = ({ disabled = false }: { disabled?: boolean }) => {
  const { mutateAsync: createAddress, isPending } = useCreateAddress()

  const [isOpen, setIsOpen] = useState(false)
  const [from, setForm] = useState({
    recipient: '',
    phone: '',
    address: '',
    city: 'Ha Noi',
    note: '',
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
      city: from.city,
    })
    setForm({
      recipient: '',
      phone: '',
      address: '',
      city: 'Ha Noi',
      note: '',
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          title="Add new address"
          className={cn('w-full', disabled && 'hidden')}
        />
      </DialogTrigger>

      <DialogContent className="relative max-w-lg space-y-4 bg-layer p-12">
        <DialogHeader>
          <DialogTitle className="font-bold">Add new address</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-2">
            <div className="space-y-2">
              <Label className="text-sm/6 font-medium text-white">
                Recipient name
              </Label>
              <Input
                onChange={handleChange('recipient')}
                className="mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm/6 font-medium text-white">
                Phone number
              </Label>
              <Input
                onChange={handleChange('phone')}
                type="tel"
                className="mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm/6 font-medium text-white">
              Street address
            </Label>
            <Input
              onChange={handleChange('address')}
              className="mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm/6 font-medium text-white">City</Label>
            <p className="text-sm/6 text-white/50">
              We currently only ship to HaNoi
            </p>
            <Select
              value={from.city}
              onValueChange={(value) => setForm({ ...from, city: value })}
            >
              <SelectTrigger className="mt-3 block w-full appearance-none rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white focus:outline-none">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ha Noi">Ha Noi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm/6 font-medium text-white">
              Delivery notes
            </Label>
            <p className="text-sm/6 text-white/50">
              If you have a tiger, we'd like to know about it.
            </p>
            <Textarea
              onChange={handleChange('note')}
              className="mt-3 block w-full resize-none rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white focus:outline-none"
              rows={3}
            />
          </div>
        </div>

        <div className="absolute right-3 top-3">
          <Button onClick={() => setIsOpen(false)} className="border-none p-3">
            <XMarkIcon className="size-5" />
          </Button>
        </div>

        <Button
          className="w-full"
          variant="outline"
          title={isPending ? 'Loading...' : 'Save'}
          type="submit"
          disabled={isPending}
          onClick={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
