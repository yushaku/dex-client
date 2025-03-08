import { Button } from '@/components/common/Button'
import { WrapAsset } from '@/stores/addictionTokens'
import { Asset, UNKNOWN_TOKEN, cn, getTokenLink } from '@/utils'
import { formatAmount } from '@/utils/odos'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/16/solid'
import { useState } from 'react'
import { useAccount } from 'wagmi'

type Props = {
  asset: Asset | null
  listAssets: WrapAsset[]
  handleSetToken: (_asset: Asset) => void
}

export const TokensDialog = ({ asset, listAssets, handleSetToken }: Props) => {
  const { chainId = 56 } = useAccount()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="flex cursor-pointer items-center gap-3 rounded-full bg-focus p-2"
      >
        <img
          src={asset?.logoURI ?? UNKNOWN_TOKEN}
          alt="icon logo"
          className="size-8 overflow-hidden rounded-full"
        />
        <span className={cn('hidden md:block')}>{asset?.symbol}</span>
        <ChevronDownIcon className="size-5" />
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50 rounded-xl"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/40" />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-2">
          <DialogPanel className="relative min-w-96 space-y-6 bg-layer p-4">
            <DialogTitle className="text-xl font-bold text-lighterAccent">
              Select Asset
            </DialogTitle>

            <Button
              variant="standard"
              onClick={() => setIsOpen(false)}
              icon={XMarkIcon}
              className="absolute right-1 top-0 border-none p-3"
            />

            <div id="token list">
              <ul className="scroll-container h-96 space-y-2 overflow-y-scroll">
                {listAssets.map((token) => {
                  return (
                    <li
                      key={token.address}
                      onClick={() => {
                        handleSetToken(token)
                        setIsOpen(false)
                      }}
                      className={cn(
                        'flex justify-between rounded-lg p-2 cursor-pointer',
                        'hover:bg-focus hover:text-lighterAccent',
                        asset?.address === token.address && 'bg-focus',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={token.logoURI}
                          className="size-8 overflow-hidden rounded-full"
                        />

                        <h6 className="">
                          <p className="flex gap-2">
                            {token.symbol}
                            <a
                              href={getTokenLink(token.address, chainId)}
                              target="_blank"
                            >
                              <ArrowUpRightIcon className="size-5 stroke-textSecondary hover:stroke-lighterAccent" />
                            </a>
                          </p>
                          <p className="text-sm text-textSecondary">
                            {token.name}
                          </p>
                        </h6>
                      </div>

                      <div className="flex items-center gap-2">
                        <p className="text-sm text-textSecondary">
                          {formatAmount({
                            amount: token.balance,
                            decimals: token.decimals,
                          })}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
