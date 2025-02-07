/* eslint-disable @typescript-eslint/no-explicit-any */
import { LIDO_ABI } from '@/abi/lido'
import { WST_ETH } from '@/abi/wstETH'
import { Card } from '@/components/warper'
import { useWstETH } from '@/hooks/stake/useLido'
import { OrderInput } from '@/pages/swap/components/OrderInput'
import { useFarmState } from '@/stores'
import { WrapAsset } from '@/stores/addictionTokens'
import { cn, getTokenLink, shortenAddress } from '@/utils'
import { contracts } from '@/utils/contracts'
import { formatAmount } from '@/utils/odos'
import { ArrowDownIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import { Address, erc20Abi, formatEther, parseEther, zeroAddress } from 'viem'
import { mainnet } from 'viem/chains'
import { useAccount, useBalance, useReadContracts } from 'wagmi'

const listProtocols = [
  {
    type: 'Stake',
    list: [
      {
        img: 'https://etherscan.io/token/images/steth_32.svg',
        name: 'LIDO',
      },
    ],
  },
  {
    type: 'Restake',
    list: [
      {
        img: 'https://etherscan.io/token/images/renzorez_32.png',
        name: 'RENZO',
      },
    ],
  },
  // {
  //   type: 'Defi',
  //   list: [
  //     {
  //       img: 'https://etherscan.io/token/images/aaverplce_32.svg',
  //       name: 'AAVE',
  //       type: 'Defi',
  //     },
  //     {
  //       img: 'https://etherscan.io/token/images/Curvefi_32.png?v=2',
  //       name: 'CURVE',
  //       type: 'Defi',
  //     },
  //   ],
  // },
] as const

export const LidoFarming = () => {
  const { chainId } = useAccount()
  const { data: earnOnToken, toggleFarmin } = useFarmState()
  const [protocol, setProtocol] = useState<string>('LIDO')

  if (earnOnToken !== 'ETH' || chainId !== mainnet.id) return null

  return (
    <Card className="mt-10">
      <h3 className="flex justify-between text-lg font-bold text-lighterAccent">
        <span>EARN MORE</span>
        <XMarkIcon onClick={() => toggleFarmin(null)} className="size-6" />
      </h3>

      <div className="mt-5 grid grid-cols-5 gap-2">
        <ul className="col-span-1 space-y-3">
          {listProtocols.map(({ type, list }) => {
            return (
              <li className="mt-3">
                <p>{type}</p>
                {list.map((item) => {
                  return (
                    <button
                      onClick={() => setProtocol(item.name)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-lg p-4 hover:bg-focus',
                        item.name === protocol && 'bg-focus',
                      )}
                    >
                      <img src={item.img} className="inline-block size-6" />
                      {item.name}
                    </button>
                  )
                })}
              </li>
            )
          })}
        </ul>

        {protocol === 'wrapStETH' && <WrapStETH />}
        {protocol === 'RENZO' && <RenzoStake />}
      </div>
    </Card>
  )
}

const WrapStETH = () => {
  const { address, chainId } = useAccount()

  const [isWarp, setIsWarp] = useState(true)
  const [amount, setAmount] = useState('0')
  const { wrapStETH, unwrapWstETH } = useWstETH()

  const { data } = useReadContracts({
    contracts: [
      {
        address: contracts.STAKING_ETH.LIDO,
        abi: LIDO_ABI,
        functionName: 'balanceOf',
        args: [address ?? zeroAddress],
      },
      {
        address: contracts.WST_ETH[mainnet.id],
        abi: WST_ETH,
        functionName: 'balanceOf',
        args: [address ?? zeroAddress],
      },
      {
        address: contracts.WST_ETH[mainnet.id],
        abi: WST_ETH,
        functionName: 'getWstETHByStETH',
        args: [parseEther('1')],
      },
      {
        address: contracts.WST_ETH[mainnet.id],
        abi: WST_ETH,
        functionName: 'getStETHByWstETH',
        args: [parseEther('1')],
      },
    ],
    query: {
      enabled: Boolean(address) && chainId === mainnet.id,
      staleTime: Infinity,
      refetchInterval: 10_000,
    },
  })

  const stbalance = data?.[0]?.result
  const wstbalance = data?.[1]?.result
  const wstETHByStETH = data?.[2]?.result ?? 0n
  const stETHByWstETH = data?.[3]?.result ?? 0n
  const toAmountWst = Number(formatEther(wstETHByStETH)) * Number(amount)
  const toAmountst = Number(formatEther(stETHByWstETH)) * Number(amount)

  return (
    <article className="col-span-2 rounded-lg bg-focus p-4">
      <h4 className="text-center">Wrap stETH before Farming</h4>

      <div className="mt-5 flex rounded-lg bg-background p-1">
        {['wrap', 'unwrap'].map((feat) => {
          return (
            <button
              key={feat}
              className={cn(
                'rounded-lg px-8 py-3 flex-1',
                isWarp && feat === 'wrap' && 'bg-focus',
                !isWarp && feat === 'unwrap' && 'bg-focus',
              )}
              onClick={() => {
                if (feat === 'wrap') setIsWarp(true)
                if (feat === 'unwrap') setIsWarp(false)
                setAmount('0')
              }}
            >
              {feat}
            </button>
          )
        })}
      </div>

      <label className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-gray-500 p-2">
        <img
          src={
            isWarp
              ? 'https://etherscan.io/token/images/steth_32.svg'
              : 'https://etherscan.io/token/images/wsteth3_32.png'
          }
          className="inline-block size-7"
        />

        <input
          placeholder="0.0"
          type="number"
          value={amount}
          onChange={(e) => {
            const value = e.target.value
            setAmount(value)
          }}
          className="no-spinner w-full flex-1 bg-transparent text-lg focus:outline-none"
          style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
        />
        <button
          onClick={() =>
            setAmount(
              isWarp
                ? formatEther(stbalance ?? 0n)
                : formatEther(wstbalance ?? 0n),
            )
          }
        >
          MAX
        </button>
      </label>

      <div className="mt-5 space-y-2">
        <p className="flex justify-between">
          <span className="block text-sm text-textSecondary">
            Exchange rate
          </span>
          <span className="text-sm text-textPrimary">
            {isWarp
              ? `1 stETH = ${formatAmount({ amount: wstETHByStETH })} wstETH`
              : `1 wstETH = ${formatAmount({ amount: stETHByWstETH })} stETH`}
          </span>
        </p>
        <p className="flex justify-between">
          <span className="block text-sm text-textSecondary">
            {isWarp ? 'stETH' : 'wstETH'} balance
          </span>
          <strong className="text-sm font-bold text-textPrimary">
            <img
              src={
                isWarp
                  ? 'https://etherscan.io/token/images/steth_32.svg'
                  : 'https://etherscan.io/token/images/wsteth3_32.png'
              }
              className="mr-2 inline-block size-6"
            />
            {isWarp
              ? formatEther(stbalance ?? 0n)
              : formatEther(wstbalance ?? 0n)}
          </strong>
        </p>
        <p className="flex justify-between">
          <span className="block text-sm text-textSecondary">
            You will receive
          </span>
          <strong className="text-sm font-bold text-textPrimary">
            <img
              src={
                !isWarp
                  ? 'https://etherscan.io/token/images/steth_32.svg'
                  : 'https://etherscan.io/token/images/wsteth3_32.png'
              }
              className="mr-2 inline-block size-6"
            />
            {isWarp ? toAmountWst : toAmountst}
          </strong>
        </p>
        <p className="flex justify-between">
          <span className="block text-sm text-textSecondary">
            contract address
          </span>
          <a
            href={getTokenLink(contracts.WST_ETH[mainnet.id], mainnet.id)}
            className="text-sm font-bold text-textPrimary"
          >
            {shortenAddress(contracts.WST_ETH[mainnet.id])}
          </a>
        </p>
      </div>

      <button
        onClick={() => {
          if (isWarp) {
            wrapStETH({ amount })
          } else {
            unwrapWstETH({ amount })
          }
        }}
        className={cn('btn btn-solid w-full mt-10')}
      >
        {isWarp ? 'Unlock and Wrap' : 'Unwrap'}
      </button>
    </article>
  )
}

const assets: Array<WrapAsset> = [
  {
    address: zeroAddress,
    decimals: 18,
    symbol: 'ETH',
    name: 'ETH',
    logoURI: 'https://app.renzoprotocol.com/tokens/ETH.svg',
    balance: 0n,
  },
  {
    address: contracts.STAKING_ETH.LIDO,
    decimals: 18,
    symbol: 'stETH',
    name: 'stETH',
    logoURI: 'https://etherscan.io/token/images/steth_32.svg',
    balance: 0n,
  },
  {
    address: contracts.RESTAKING_ETH.RENZO.ezETH,
    decimals: 18,
    symbol: 'ezETH',
    name: 'ezETH',
    balance: 0n,
    logoURI:
      'https://app.renzoprotocol.com/_next/static/media/ezETH-dark.5e60f776.svg',
  },
]
const RenzoStake = () => {
  const [assetList, setAssetList] = useState<WrapAsset[]>(assets)
  const [fromAsset, setFromAsset] = useState<WrapAsset>(assetList[0])
  const [toAsset, setToAsset] = useState<WrapAsset>(assetList[2])
  const { address: account } = useAccount()

  const [fromAmount, setFromAmount] = useState('0')
  const [toAmount, setToAmount] = useState('0')

  const handleSetToken = (type: 'from' | 'to', asset: any) => {
    if (type === 'from') {
      setFromAmount('0')
      setToAmount('0')
      setFromAsset(asset)
    } else {
      setToAsset(asset)
    }
  }

  const { data: balances } = useReadContracts({
    contracts: assets.map((asset) => ({
      abi: erc20Abi,
      address: asset.address as Address,
      functionName: 'balanceOf',
      args: [account ?? zeroAddress],
    })),
  })
  const { data: nativeBalance } = useBalance({
    address: account,
  })

  useEffect(() => {
    if (balances && nativeBalance?.value) {
      setAssetList(
        assets.map((asset, index) => ({
          ...asset,
          balance:
            asset.address === zeroAddress
              ? BigInt(nativeBalance?.value ?? 0n)
              : BigInt(balances[index].result ?? 0n),
        })),
      )
    }
  }, [balances, nativeBalance?.value])

  useEffect(() => {
    const newFromToken = assetList.find((t) => t.address === fromAsset.address)
    const newToToken = assetList.find((t) => t.address === toAsset.address)

    if (newFromToken?.balance !== fromAsset.balance) {
      setFromAsset(newFromToken ?? fromAsset)
    }

    if (newToToken?.balance !== toAsset.balance) {
      setToAsset(newToToken ?? toAsset)
    }
  }, [assetList, fromAsset, toAsset])

  return (
    <article className="col-span-2 rounded-lg bg-focus p-2 py-4">
      <h4 className="flex items-center justify-between">
        <strong className="text-lighterAccent">Restake on Renzo</strong>
      </h4>

      <div className="relative">
        <OrderInput
          type="from"
          amount={fromAmount}
          asset={fromAsset}
          balance={fromAsset?.balance}
          listAssets={[assetList[0], assetList[1]]}
          setToAmount={setToAmount}
          setFromAmount={setFromAmount}
          handleSetToken={handleSetToken}
        />

        <div className="mt-5 flex items-center justify-center">
          <button
            // onClick={handleSwapPosition}
            className="group rounded-lg border border-focus bg-layer p-3"
          >
            <ArrowDownIcon className="animate size-5 hover:stroke-lighterAccent" />
          </button>
        </div>

        <OrderInput
          type="to"
          amount={toAmount}
          asset={toAsset}
          balance={toAsset.balance}
          listAssets={[toAsset]}
          setToAmount={setToAmount}
          setFromAmount={setFromAmount}
          handleSetToken={handleSetToken}
        />

        <div className="mt-5 space-y-2 p-2 text-sm">
          <p className="flex justify-between">
            <span>Exchange Rate</span>
            <span>1 ETH = 0.96536 ezETH</span>
          </p>
          <p className="flex justify-between">
            <span>APY</span>
            <span>4.11%</span>
          </p>
          <p className="flex justify-between">
            <span>Reward Fee</span>
            <span>10%</span>
          </p>
        </div>

        <button className={cn('btn btn-solid w-full mt-5')}>Stake</button>
      </div>
    </article>
  )
}
