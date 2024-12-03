import { Card } from '@/components/warper'
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
                waitUntilVisible: true
              }}
            />
          </h3>
        </div>
      </Card>

      <Card className="flex w-full flex-col items-center text-center lg:w-1/2">
        <WalletButton />
        <p className="mt-5 text-textSecondary">
          Click on the button to connect to your Wallet
        </p>
        <p className="text-textSecondary">
          To try out, mint your first NFT and do what ever shit you want if you
          can
        </p>
      </Card>
    </section>
  )
}
