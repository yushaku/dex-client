import { Button } from '@/components/common/Button'
import { useDebounce, useTokenMetadata } from '@/hooks'
import { AssetsContext } from '@/hooks/useAssets'
import { WrapAsset, useTokensState } from '@/stores/addictionTokens'
import { Asset, UNKNOWN_TOKEN, cn, getTokenLink } from '@/utils'
import { getTopAssets } from '@/utils/assets'
import { formatNumber } from '@/utils'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/16/solid'
import { useContext, useEffect, useMemo, useState } from 'react'
import {
  Address,
  erc20Abi,
  formatEther,
  formatUnits,
  isAddress,
  zeroAddress,
} from 'viem'
import { useAccount, useReadContract } from 'wagmi'

type Props = {
  className?: string
  asset: Asset | null
  handleSetToken: (_asset: Asset) => void
}

type AssetList = Array<WrapAsset>

export const OrderToken = ({ asset, handleSetToken, className }: Props) => {
  const { address: account, chainId = 1 } = useAccount()
  const { tokenList: storageTokens, add, remove } = useTokensState()
  const { listTokens } = useContext(AssetsContext)
  const topAssets = getTopAssets(chainId)

  const [tokenList, setTokenList] = useState<AssetList>(listTokens)
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const deboundSearch = useDebounce(search)

  useMemo(() => {
    const list = listTokens.filter(
      (a) =>
        a.name.toLowerCase().includes(deboundSearch.toLowerCase()) ||
        a.address.toLowerCase().includes(deboundSearch.toLowerCase()),
    )

    setTokenList(list)
  }, [deboundSearch, listTokens])

  const { data: balanceOf } = useReadContract({
    abi: erc20Abi,
    address: isAddress(deboundSearch) ? deboundSearch : undefined,
    functionName: 'balanceOf',
    args: [account ?? zeroAddress],
    query: {
      enabled: isAddress(deboundSearch) && !!account,
    },
  })
  const { data: newToken } = useTokenMetadata({
    token: deboundSearch,
    enabled: isAddress(deboundSearch) || tokenList.length === 0,
    chainId,
  })

  useEffect(() => {
    if (newToken?.[0] && isAddress(deboundSearch)) {
      setTokenList([
        {
          address: deboundSearch,
          name: newToken?.[0].name,
          logoURI: newToken?.[0].logo,
          symbol: newToken?.[0].symbol,
          decimals: newToken?.[0].decimals,
          formatted: formatUnits(balanceOf ?? 0n, newToken?.[0].decimals),
          balance: balanceOf ?? 0n,
          isCustom: true,
        },
      ])
    }
  }, [balanceOf, deboundSearch, newToken])

  const handleTogglenewToken = (token: WrapAsset) => {
    const exist = storageTokens.find((t) => t.address === token.address)
    if (exist) {
      remove(token.address as Address)
    } else {
      delete token?.isCustom
      token.isLocal = true
      setSearch('')
      add(token)
      setTokenList([token])
    }
  }

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={cn(
          'flex cursor-pointer items-center gap-3 rounded-full bg-focus p-2',
          className,
        )}
      >
        <img
          src={asset?.logoURI ?? UNKNOWN_TOKEN}
          alt="icon logo"
          className="size-8 overflow-hidden rounded-full"
        />
        <span className={cn('hidden md:block')}>{asset?.symbol}</span>
        <ChevronDownIcon className="ml-auto size-5" />
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

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
              placeholder="Search by name or symbol"
              className="w-full rounded-lg bg-background p-4 focus:outline-none"
            />

            <div id="TOP-TOKENS">
              <h6
                className={cn(
                  'mb-2 text-textSecondary',
                  topAssets.length === 0 && 'hidden',
                )}
              >
                Treding Tokens
              </h6>

              <ul className="grid grid-cols-4 gap-2">
                {topAssets.map((token) => {
                  return (
                    <li
                      key={token.address}
                      className={cn(
                        'flex grid-cols-1 items-center gap-2 cursor-pointer rounded-lg bg-background p-2',
                        'hover:bg-focus hover:text-lighterAccent',
                        asset?.address === token.address && 'bg-focus',
                      )}
                      onClick={() => {
                        handleSetToken(token)
                        setIsOpen(false)
                      }}
                    >
                      <img
                        src={token.logoURI}
                        className="size-8 overflow-hidden rounded-full"
                      />
                      <span>{token.symbol}</span>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="h-0.5 w-full bg-focus" />

            <div id="token list">
              <h6 className="mb-2 text-textSecondary">Token List</h6>

              <ul className="scroll-container h-96 space-y-2 overflow-y-scroll">
                {tokenList.map((token) => {
                  return (
                    <li
                      key={token.address}
                      onClick={() => {
                        if (token?.isCustom) return
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
                          {formatNumber(formatEther(token?.balance))}
                        </p>
                        <button
                          onClick={() => handleTogglenewToken(token)}
                          className={cn(
                            'bg-background p-1 rounded-lg',
                            !token?.isCustom && !token?.isLocal && 'hidden',
                          )}
                        >
                          <PlusIcon
                            className={cn(
                              'size-5 stroke-textSecondary',
                              !token?.isCustom && 'hidden',
                            )}
                          />

                          <TrashIcon
                            className={cn(
                              'size-5 stroke-textSecondary',
                              !token?.isLocal && 'hidden',
                            )}
                          />
                        </button>
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
