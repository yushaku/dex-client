import { TOKENS, TokenOption } from '@/utils'
import { useState } from 'react'
import {
  AdvancedRealTimeChart,
  CryptoCoinsHeatmap,
  FundamentalData,
  TechnicalAnalysis,
  Timeline
} from 'react-ts-tradingview-widgets'
import { SelectToken } from '@/components/common/SelectToken'
import { Tab } from '@/components/layout/tab'

type Feature = 'chart' | 'analysis' | 'heatmap' | 'bubble' | 'news'
const listFeature: Array<Feature> = [
  'chart',
  'analysis',
  'heatmap',
  'bubble',
  'news'
]

export const Swap = () => {
  const [type, setType] = useState<Feature>('chart')
  const [token, setToken] = useState<TokenOption>(TOKENS[0])

  return (
    <section className="">
      <div className="flex w-fit rounded-lg border-4 border-layer bg-layer">
        <SelectToken token={token} setToken={setToken} />

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

      <div className="mt-6 flex h-1/2">
        <Tab isOpen={type === 'chart'} className="flex">
          <article className="flex-1">
            <AdvancedRealTimeChart
              symbol={token.tradingview}
              theme="dark"
              interval="D"
              calendar={false}
              hide_top_toolbar={false}
              hide_legend={true}
              withdateranges={false}
              autosize
            />
          </article>

          {/* <article className="grid gap-3"> */}
          {/* <SwapWidget */}
          {/*   theme={uniTheme} */}
          {/*   onTokenChange={(e) => console.log(JSON.stringify(e))} */}
          {/*   hideConnectionUI={true} */}
          {/*   tokenList={TOKEN_LIST} */}
          {/*   jsonRpcUrlMap={JSON_RPC} */}
          {/*   defaultChainId={1} */}
          {/*   defaultInputAmount="1" */}
          {/*   defaultInputTokenAddress="NATIVE" */}
          {/*   defaultOutputTokenAddress={UNI} */}
          {/* /> */}

          {/* <Timeline */}
          {/*   colorTheme="dark" */}
          {/*   feedMode="market" */}
          {/*   market="crypto" */}
          {/*   height={400} */}
          {/*   width="100%" */}
          {/* /> */}
          {/* </article> */}
        </Tab>

        <Tab isOpen={type === 'analysis'} className="flex">
          <TechnicalAnalysis
            symbol={token.tradingview}
            colorTheme="dark"
            width="100%"
          ></TechnicalAnalysis>

          <FundamentalData
            symbol={token.tradingview}
            colorTheme="dark"
            width="100%"
          ></FundamentalData>
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

        <Tab isOpen={type === 'news'}>
          <Timeline
            colorTheme="dark"
            feedMode="market"
            market="crypto"
            height="100%"
            width="100%"
          />
        </Tab>
      </div>
    </section>
  )
}
