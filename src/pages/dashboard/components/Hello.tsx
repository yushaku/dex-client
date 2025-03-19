import { Card, GradientCard } from '@/components/common'
import { WalletButton } from '@/components/layout/header'
import TypeIt from 'typeit-react'

export const HelloGuy = () => {
  return (
    <section className="mt-5 flex flex-wrap gap-5 lg:flex-nowrap">
      <Card className="flex w-full items-center gap-4 lg:w-1/2">
        <img src="/logo.png" className="size-32" alt="Vite logo" />

        <div>
          <h6 className="text-lg">Hello, my Friend</h6>
          <h3 className="text-3xl text-lighterAccent">
            Wellcome to{' '}
            <TypeIt
              options={{
                strings: ['the YuMarket', "Let's order your NFTs"],
                lifeLike: true,
                waitUntilVisible: true,
              }}
            />
          </h3>
        </div>
      </Card>

      <GradientCard
        title="Click on the button to connect to your Wallet"
        description="To try out, mint your first NFT and do what ever shit you want if you can"
        className="flex items-center justify-center border-focus bg-[#1e2431]/50"
      >
        <WalletButton />
      </GradientCard>
    </section>
  )
}
