import { Button } from "@/components/common/Button"
import { useDebounce } from "@/hooks"
import { Asset, cn } from "@/utils"
import { assets, topAssets } from "@/utils/assets"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle
} from "@headlessui/react"
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/16/solid"
import { useMemo, useState } from "react"

type Props = {
  asset: Asset | null
  handleSetToken: (_asset: Asset) => void
}
export const OrderToken = ({ asset, handleSetToken }: Props) => {
  const [tokenList, setTokenList] = useState(assets)
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const deboundSearch = useDebounce(search)

  useMemo(() => {
    const list = assets.filter(
      (a) =>
        a.name.toLowerCase().includes(deboundSearch.toLowerCase()) ||
        a.symbol.toLowerCase().includes(deboundSearch.toLowerCase())
    )

    setTokenList(list)
  }, [deboundSearch])

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="flex cursor-pointer items-center gap-3 rounded-full bg-focus p-2"
      >
        <img src={asset?.logoURI} alt="icon logo" className="size-8" />
        {asset?.symbol}
        <ChevronDownIcon className="size-5" />
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
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

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
              placeholder="Search by name or symbol"
              className="w-full rounded-lg bg-background p-4 focus:outline-none"
            />

            <div id="TOP-TOKENS">
              <h6 className="mb-2 text-textSecondary">Treding Tokens</h6>

              <ul className="grid grid-cols-4 gap-2">
                {topAssets.map((token) => {
                  return (
                    <li
                      className={cn(
                        "flex grid-cols-1 items-center gap-2 cursor-pointer rounded-lg bg-background p-2",
                        "hover:bg-focus hover:text-lighterAccent",
                        asset?.address === token.address && "bg-focus"
                      )}
                      onClick={() => {
                        handleSetToken(token)
                        setIsOpen(false)
                      }}
                    >
                      <img src={token.logoURI} className="size-8" />
                      <span>{token.symbol}</span>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="h-0.5 w-full bg-focus" />

            <div id="token list">
              <h6 className="mb-2 text-textSecondary">Token List</h6>

              <ul className="h-96 space-y-2 overflow-y-scroll">
                {tokenList.map((token) => {
                  return (
                    <li
                      key={token.address}
                      onClick={() => {
                        handleSetToken(token)
                        setIsOpen(false)
                      }}
                      className={cn(
                        "flex justify-between rounded-lg p-2 cursor-pointer",
                        "hover:bg-focus hover:text-lighterAccent",
                        asset?.address === token.address && "bg-focus"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <img src={token.logoURI} className="size-8" />

                        <h6 className="">
                          <p>{token.symbol}</p>
                          <p className="text-sm text-textSecondary">
                            {token.name}
                          </p>
                        </h6>
                      </div>

                      <div>
                        <p>--</p>
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
