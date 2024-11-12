import { Button } from '@/components/common/Button'
import { useSettingState } from '@/stores'
import { cn } from '@/utils'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle
} from '@headlessui/react'
import { Cog6ToothIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { useState } from 'react'

export const OrderSetting = ({ disabled = false }: { disabled?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { setting, updateSetting } = useSettingState()

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'ounded-md p-2 rounded-lg hover:bg-focus',
          disabled && 'hidden'
        )}
      >
        <Cog6ToothIcon className="size-5" />
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/40" />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-2">
          <DialogPanel className="relative w-96 space-y-6 bg-layer p-4">
            <DialogTitle className="font-bold text-lighterAccent">
              Transaction Settings
            </DialogTitle>

            <Button
              variant="standard"
              onClick={() => setIsOpen(false)}
              icon={XMarkIcon}
              className="absolute right-2 top-2 border-none p-3"
            />

            <div>
              <h6 className="mb-2">Slippage Tolerance</h6>

              <div className="flex justify-between">
                <ul className="flex gap-1 rounded-lg border border-focus bg-background p-1">
                  {[0.1, 0.5, 1].map((num) => {
                    return (
                      <li
                        key={num}
                        onClick={() =>
                          updateSetting({
                            ...setting,
                            slippage: num
                          })
                        }
                        className={cn(
                          'px-3 cursor-pointer hover:bg-focus py-1 rounded-lg',
                          setting.slippage === num && 'bg-focus'
                        )}
                      >
                        {num}%
                      </li>
                    )
                  })}
                </ul>

                <div className="flex w-fit items-center rounded-lg border border-focus px-2">
                  <input
                    value={setting.slippage}
                    onChange={(e) => {
                      updateSetting({
                        ...setting,
                        slippage: Number(e.target.value)
                      })
                    }}
                    placeholder="0.0"
                    type="number"
                    className="no-spinner w-16 bg-transparent focus:outline-none"
                    style={{
                      WebkitAppearance: 'none',
                      MozAppearance: 'textfield'
                    }}
                  />
                  <span>%</span>
                </div>
              </div>
            </div>

            <div>
              <h6 className="mb-2">Transaction Deadline</h6>
              <div className="flex items-center rounded-lg border border-focus p-4 py-2">
                <input
                  value={setting.deadline}
                  onChange={(e) => {
                    updateSetting({
                      ...setting,
                      deadline: Number(e.target.value)
                    })
                  }}
                  placeholder="0.0"
                  type="number"
                  className="no-spinner w-full bg-transparent focus:outline-none"
                  style={{
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield'
                  }}
                />
                <span className="text-textSecondary">minutes</span>
              </div>
            </div>

            <div>
              <h6 className="mb-2">Liquidity Hub</h6>

              <p className="text-sm text-textSecondary">
                <a
                  href="https://www.orbs.com/liquidity-hub/"
                  className="text-accent"
                >
                  Liquidity Hub
                </a>
                , powered by{' '}
                <a href="https://www.orbs.com/" className="text-accent">
                  Orbs
                </a>
                , may provide better price by aggregating liquidity from
                multiple sources.{' '}
                <a
                  href="https://www.orbs.com/liquidity-hub/"
                  className="text-accent"
                >
                  Learn More
                </a>
              </p>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
