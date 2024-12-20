import { Tab } from '@/components/layout/tab'
import { useState } from 'react'
import {
  AdvancedRealTimeChart,
  CryptoCoinsHeatmap,
} from 'react-ts-tradingview-widgets'
import { SwapPane } from './components/SwapPane'

const listFeature = ['swap', 'chart', 'heatmap', 'bubble'] as const

export const Swap = () => {
  const [type, setType] = useState<(typeof listFeature)[number]>('swap')

  return (
    <section className="">
      <div className="flex w-fit rounded-lg border-4 border-layer bg-layer">
        {listFeature.map((feat) => {
          const pickedStyle = type === feat && 'bg-background'
          return (
            <button
              key={feat}
              className={`${pickedStyle} rounded-lg px-8 py-3 `}
              onClick={() => setType(feat)}
            >
              {feat}
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex min-h-[80dvh]">
        <Tab isOpen={type === 'swap'} className="flex">
          <SwapPane />
        </Tab>

        <Tab isOpen={type === 'chart'} className="flex">
          <article className="flex-1">
            <AdvancedRealTimeChart
              symbol="BTCUSD"
              theme="dark"
              interval="D"
              calendar={false}
              hide_top_toolbar={false}
              hide_legend={true}
              withdateranges={false}
              autosize
            />
          </article>
        </Tab>

        <Tab isOpen={type === 'heatmap'}>
          <CryptoCoinsHeatmap
            width="100%"
            height="100%"
            colorTheme="dark"
          ></CryptoCoinsHeatmap>
        </Tab>

        <Tab isOpen={type === 'bubble'}>
          <iframe
            src="https://cryptobubbles.net"
            width="100%"
            height="100%"
            loading="lazy"
          ></iframe>
        </Tab>
      </div>
    </section>
  )
}
