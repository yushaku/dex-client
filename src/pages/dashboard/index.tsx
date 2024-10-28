import { ERC20_ABI } from '@/abi/erc20.ts'
import { NativeBalance } from '@/components/common/NativeTokenBalance'
import { USDT } from '@/components/icons'
import { Card } from '@/components/warper'
import { YSK_ADDRESS, cn, shortenAddress } from '@/utils'
import { useState } from 'react'
import { Address, formatEther } from 'viem'
import { useAccount, useEnsName, useReadContract } from 'wagmi'
import { StakedValueLockChart } from './components/Chart'
import { HelloGuy } from './components/Hello'
import { StakeForm } from './components/stakeForm'

export const Dashboard = () => {
  const { address } = useAccount()
  const ens = useEnsName({ address: address })
  const [openModal, setOpenModal] = useState({
    stake: false,
    claim: false
  })

  const yskRes = useReadContract({
    abi: ERC20_ABI,
    address: YSK_ADDRESS,
    functionName: 'balanceOf',
    args: [address ?? '0x0000000000000000000000000000000000000000']
  })
  const yuBalance = formatEther(yskRes?.data ?? 0n)

  const totalStaked = { data: 10000000n }

  // const totalStaked = useReadContract({
  //   abi: stakeModuleABI,
  //   address: STAKE_ADRESS,
  //   functionName: 'totalStakedAmount'
  // })

  return (
    <>
      <h3
        className={cn('hidden items-center gap-3 text-lg text-textSecondary', {
          flex: address
        })}
      >
        <span>{ens?.data ? ens.data : shortenAddress(address)}:</span>
        <NativeBalance address={address} />
      </h3>

      {!address ? (
        <HelloGuy />
      ) : (
        <section className="mt-10 flex flex-wrap gap-10 lg:flex-nowrap">
          <Card className="h-fit w-full lg:w-1/2">
            <h3 className="flex items-center gap-2 text-xl font-bold text-textPrimary">
              <img className="size-10" src="/logo.png" alt="logo" /> YSK
            </h3>

            <article className="mt-5 flex justify-between">
              <p className="text-center">
                <span className="block text-sm text-textSecondary">
                  You are staking:
                </span>
                <strong className="inline-flex items-center gap-2 text-xl font-bold text-textPrimary">
                  0
                  <img className="size-7" src="/logo.png" alt="logo" />
                </strong>
              </p>
              <p className="text-center">
                <span className="block text-sm text-textSecondary">
                  Your Balance
                </span>
                <strong className="flex items-center gap-2 text-xl font-bold text-textPrimary">
                  {yuBalance}
                  <img className="size-7" src="/logo.png" alt="logo" />
                </strong>
              </p>
            </article>

            <article className="mt-10 flex justify-between">
              <p>
                <span className="block text-sm text-textSecondary">
                  XVS Stake APR
                </span>
                <strong className="text-xl font-bold text-textPrimary">
                  8.31%
                </strong>
              </p>

              <p>
                <span className="block text-sm text-textSecondary">
                  Daily Emission
                </span>
                <strong className="flex-start gap-2 text-xl font-bold text-textPrimary">
                  <img className="size-7" src="/logo.png" alt="logo" />
                  1.672k
                </strong>
              </p>

              <p>
                <span className="block text-sm text-textSecondary">
                  Total Staked
                </span>
                <strong className="flex-start gap-2 text-xl font-bold text-textPrimary">
                  <img className="size-7" src="/logo.png" alt="logo" />
                  {formatEther(totalStaked?.data ?? 0)}
                </strong>
              </p>
            </article>

            <article className="mt-10 flex gap-5">
              <button
                onClick={() => setOpenModal({ ...openModal, stake: true })}
                className="btn btn-solid w-1/2"
              >
                Stake
              </button>
              <button
                onClick={() => setOpenModal({ ...openModal, claim: true })}
                className="btn btn-outline w-1/2"
              >
                Claim
              </button>
            </article>
          </Card>

          <Card className="h-fit w-full lg:w-1/2">
            <h3 className="flex items-center gap-2 text-xl font-bold text-textPrimary">
              <USDT className="inline-block size-9" />
              USDT
            </h3>

            <article className="mt-5 flex justify-between">
              <p className="text-center">
                <span className="block text-sm text-textSecondary">
                  you are staking:
                </span>
                <strong className="text-xl font-bold text-textPrimary">
                  0
                </strong>
              </p>
              <p>
                <span className="block text-sm text-textSecondary">
                  Your Balance
                </span>
                <strong className="text-xl font-bold text-textPrimary">
                  0
                </strong>
              </p>
            </article>

            <article className="mt-10 flex justify-between">
              <p className="text-center">
                <span className="block text-sm text-textSecondary">
                  XVS Stake APR
                </span>
                <strong className="text-xl font-bold text-textPrimary">
                  15.1%
                </strong>
              </p>

              <p>
                <span className="block text-sm text-textSecondary">
                  Daily Emission
                </span>
                <strong className="flex-start gap-2 text-xl font-bold text-textPrimary">
                  <img className="size-7" src="/logo.png" alt="logo" />
                  125.000
                </strong>
              </p>

              <p>
                <span className="block text-sm text-textSecondary">
                  Total Staked
                </span>
                <strong className="flex-start gap-2 text-xl font-bold text-textPrimary">
                  <USDT className="inline-block size-6" />
                  2.68M
                </strong>
              </p>
            </article>

            <article className="mt-10 flex gap-5">
              <button className="btn btn-solid w-1/2">Stake</button>
              <button className="btn btn-outline w-1/2">Claim</button>
            </article>
          </Card>
        </section>
      )}

      {/* <ul className={`${logs.length === 0 && 'hidden'} mt-10`}> */}
      {/*   <li className="mb-5 text-xl font-bold">logs of transactions</li> */}
      {/*   <li className="flex justify-between text-lg font-bold text-accent"> */}
      {/*     <span>From</span> */}
      {/*     <span>To</span> */}
      {/*     <span>value</span> */}
      {/*   </li> */}
      {/**/}
      {/*   {logs.map((tx, index) => { */}
      {/*     return ( */}
      {/*       <li key={index} className="flex justify-between text-gray-500"> */}
      {/*         <span>{shortenAddress(tx.args.from)}</span> */}
      {/*         <span>{shortenAddress(tx.args.to)}</span> */}
      {/*         <span>{formatEther(tx.args.value)}</span> */}
      {/*       </li> */}
      {/*     ) */}
      {/*   })} */}
      {/* </ul> */}

      <StakedValueLockChart />

      <StakeForm
        isOpen={openModal.stake}
        setOpen={() => setOpenModal({ ...openModal, stake: false })}
        address={address as Address}
        balance={yuBalance}
      />
    </>
  )
}
