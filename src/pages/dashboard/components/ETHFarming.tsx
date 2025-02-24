/* eslint-disable @typescript-eslint/no-explicit-any */
import { LIDO_ABI } from '@/abi/lido'
import { WST_ETH } from '@/abi/wstETH'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/warper'
import { useStakeEth, useWstETH } from '@/hooks/stake/useLido'
import { useRenzo } from '@/hooks/stake/useRenzo'
import { OrderInput } from '@/pages/swap/components/OrderInput'
import { useFarmState } from '@/stores'
import { WrapAsset } from '@/stores/addictionTokens'
import { cn, getTokenLink, shortenAddress } from '@/utils'
import { contracts } from '@/utils/contracts'
import { formatAmount } from '@/utils/odos'
import { ArrowDownIcon } from '@heroicons/react/16/solid'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
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
        description: [
          {
            title: 'How does Lido work?',
            detail:
              'While each network works differently, generally, the Lido protocols batch user tokens to stake with validators and route the staking packages to network staking contracts. Users mint amounts of stTokens which correspond to the amount of tokens sent as stake and they receive staking rewards. When they unstake, they burn the stToken to initiate the network-specific withdrawal process to withdraw the balance of stake and rewards.',
          },
          {
            title: 'What is Lido staking APR for Ethereum?',
            detail: `Lido staking APR for Ethereum = Protocol APR * (1 - Protocol fee)
                Protocol APR — the overall Consensus Layer (CL) and Execution Layer (EL) rewards received by Lido validators to total pooled ETH estimated as the moving average of the last seven days.
                Protocol fee — Lido applies a 10% fee on staking rewards that are split between node operators and the DAO Treasury.
                More about Lido staking APR for Ethereum you could find on the Ethereum landing page and in our Docs.`,
          },
        ],
      },
    ],
  },
  {
    type: 'Restake',
    list: [
      {
        img: 'https://etherscan.io/token/images/renzorez_32.png',
        name: 'RENZO',
        description: [
          {
            title: 'what is ezETH?',
            detail:
              'ezETH is the liquid restaking token representing a user’s EigenLayer restaked position at Renzo. Users can deposit native ETH or stETH and receive ezETH. Serving as the interface to the EigenLayer ecosystem, ezETH secures Actively Validated Services (AVSs) to generate both staking and restaking rewards.',
          },
          {
            title: 'what is rewards of ezETH?',
            detail:
              'Staking and restaking rewards are auto-compounded. This means the value $ezETH increases relative to the underlying assets as it earns more rewards.',
          },
        ],
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

export const ETHFarming = () => {
  const { chainId } = useAccount()
  const { data: earnOnToken, toggleFarmin } = useFarmState()
  const [protocol, setProtocol] = useState<string>('LIDO')
  const [description, setDescription] = useState<any>([])

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
                      onClick={(event) => {
                        event.preventDefault()
                        setProtocol(item.name)
                        setDescription(item.description)
                      }}
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

        {protocol === 'LIDO' && <LidoStake />}
        {protocol === 'RENZO' && <RenzoStake />}

        <article className="col-span-2 rounded-lg bg-focus p-4">
          <Accordion type="single" collapsible className="w-full">
            {description.map((item: any, index: number) => {
              return (
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger>{item.title}</AccordionTrigger>
                  <AccordionContent> {item.detail} </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </article>
      </div>
    </Card>
  )
}

const lidoAssets: Array<WrapAsset> = [
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
    address: contracts.STAKING_ETH.WST_ETH,
    decimals: 18,
    symbol: 'wstETH',
    name: 'wstETH',
    logoURI: 'https://etherscan.io/token/images/wsteth3_32.png',
    balance: 0n,
  },
]

const LidoStake = () => {
  const [assetList, setAssetList] = useState<WrapAsset[]>(lidoAssets)
  const [fromAsset, setFromAsset] = useState<WrapAsset>(assetList[0])
  const [toAsset, setToAsset] = useState<WrapAsset>(assetList[1])
  const { address: account } = useAccount()
  const { stakeETH } = useStakeEth()

  const [fromAmount, setFromAmount] = useState('0')
  const [, setToAmount] = useState('0')

  const handleSetToken = (type: 'from' | 'to', asset: any) => {
    if (type === 'from') {
      setFromAmount('0')
      setToAmount('0')
      setFromAsset(asset)
    } else {
      setToAsset(asset)
    }
  }

  const handleDeposit = useCallback(() => {
    if (fromAsset.balance < parseEther(fromAmount)) {
      toast.error('Insufficient balance')
      return
    }

    if (fromAsset.address === zeroAddress) {
      stakeETH({ amount: fromAmount })
    } else {
      // depositToken({ amount: fromAmount })
    }
  }, [fromAmount, fromAsset.address, fromAsset.balance, stakeETH])

  const { data: balances } = useReadContracts({
    contracts: lidoAssets.map((asset) => ({
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
        lidoAssets.map((asset, index) => ({
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
          listAssets={[fromAsset]}
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
          amount={fromAmount}
          asset={toAsset}
          balance={toAsset.balance}
          listAssets={[assetList[1]]}
          setToAmount={setToAmount}
          setFromAmount={setFromAmount}
          handleSetToken={handleSetToken}
        />

        <div className="mt-5 space-y-2 p-2 text-sm">
          <p className="flex justify-between">
            <span>Exchange Rate</span>
            <span>1 ETH = 1 stETH</span>
          </p>
          <p className="flex justify-between">
            <span>APY</span>
            <span>3%</span>
          </p>
        </div>

        <Button
          size="lg"
          onClick={handleDeposit}
          className={cn('btn btn-solid w-full mt-5')}
          disabled={Number(fromAmount) <= 0}
        >
          Stake
        </Button>
      </div>
    </article>
  )
}

// eslint-disable-next-line no-unused-vars
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
        address: contracts.STAKING_ETH.WST_ETH,
        abi: WST_ETH,
        functionName: 'balanceOf',
        args: [address ?? zeroAddress],
      },
      {
        address: contracts.STAKING_ETH.WST_ETH,
        abi: WST_ETH,
        functionName: 'getWstETHByStETH',
        args: [parseEther('1')],
      },
      {
        address: contracts.STAKING_ETH.WST_ETH,
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
            href={getTokenLink(contracts.STAKING_ETH.WST_ETH, mainnet.id)}
            className="text-sm font-bold text-textPrimary"
          >
            {shortenAddress(contracts.STAKING_ETH.WST_ETH)}
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
  const { depositETH, depositToken } = useRenzo()

  const [fromAmount, setFromAmount] = useState('0')
  const [, setToAmount] = useState('0')

  const handleSetToken = (type: 'from' | 'to', asset: any) => {
    if (type === 'from') {
      setFromAmount('0')
      setToAmount('0')
      setFromAsset(asset)
    } else {
      setToAsset(asset)
    }
  }

  const handleDeposit = useCallback(() => {
    if (fromAsset.balance < parseEther(fromAmount)) {
      toast.error('Insufficient balance')
      return
    }

    if (fromAsset.address === zeroAddress) {
      depositETH({ amount: fromAmount })
    } else {
      depositToken({ amount: fromAmount })
    }
  }, [
    depositETH,
    depositToken,
    fromAmount,
    fromAsset.address,
    fromAsset.balance,
  ])

  const { data: balances } = useReadContracts({
    contracts: lidoAssets.map((asset) => ({
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
        lidoAssets.map((asset, index) => ({
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

        {/* <div className="mt-5 flex items-center justify-center"> */}
        {/*   <button */}
        {/*     // onClick={handleSwapPosition} */}
        {/*     className="group rounded-lg border border-focus bg-layer p-3" */}
        {/*   > */}
        {/*     <ArrowDownIcon className="animate size-5 hover:stroke-lighterAccent" /> */}
        {/*   </button> */}
        {/* </div> */}

        {/* <OrderInput */}
        {/*   type="to" */}
        {/*   amount={toAmount} */}
        {/*   asset={toAsset} */}
        {/*   balance={toAsset.balance} */}
        {/*   listAssets={[toAsset]} */}
        {/*   setToAmount={setToAmount} */}
        {/*   setFromAmount={setFromAmount} */}
        {/*   handleSetToken={handleSetToken} */}
        {/* /> */}

        <div className="mt-5 space-y-2 p-2 text-sm">
          {/* <p className="flex justify-between"> */}
          {/*   <span>Exchange Rate</span> */}
          {/*   <span>1 ETH = 0.96536 ezETH</span> */}
          {/* </p> */}
          <p className="flex justify-between">
            <span>APY</span>
            <span>4.11%</span>
          </p>
          <p className="flex justify-between">
            <span>Reward Fee</span>
            <span>10%</span>
          </p>
        </div>

        <Button
          size="lg"
          onClick={handleDeposit}
          className={cn('btn btn-solid w-full mt-5')}
          disabled={Number(fromAmount) <= 0}
        >
          Stake
        </Button>
      </div>
    </article>
  )
}
