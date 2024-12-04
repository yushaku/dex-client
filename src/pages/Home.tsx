import CountUp from 'react-countup'
import '@/styles/landing.css'
import TypeIt from 'typeit-react'
import {
  CubeTransparentIcon,
  EllipsisHorizontalIcon,
  GlobeAltIcon,
} from '@heroicons/react/16/solid'
import { Link } from 'react-router-dom'
import { routes } from '@/utils'

export const Home = () => {
  return (
    <section className="no-scrollbar relative overflow-hidden bg-background">
      <Navbar />
      <TopIntro />
      <Safety />
      <Backer />
    </section>
  )
}

const Navbar = () => {
  const componets = ['Intro', 'About', 'Features', 'Invester', 'FAQ']

  return (
    <header className="container sticky top-0 z-50 flex items-center justify-between py-5">
      <div className="flex items-center gap-3">
        <img src="/favicon.ico" />
        <h2 className="text-2xl font-bold">Yushaku</h2>
      </div>

      <ul className="flex-center gap-5">
        {componets.map((component, index) => (
          <li key={index} className="text-white hover:text-lighterAccent">
            <a href={`#${component}`}>{component}</a>
          </li>
        ))}
        <li className="gradient_accent btn z-50">
          <Link to={routes.trade}>Launch App</Link>
        </li>
      </ul>
    </header>
  )
}

const TopIntro = () => {
  return (
    <div
      id="Intro"
      className="flex-center h-screen w-full flex-col bg-[url('/grid.svg')] bg-cover text-center"
    >
      <p className="rounded-full bg-layer px-4 py-2 text-sm">
        Take back control from CEXs
      </p>

      <h3 className="text_gradient mt-10 text-4xl font-bold">
        <TypeIt
          options={{
            strings: ['Decentralized trading'],
            waitUntilVisible: true,
          }}
        />
      </h3>
      <h2 className="-mt-6 text-[80px] font-bold">Powerhouse</h2>

      <p className="mt-5 text-2xl text-gray-300">
        Lightning-fast orderbook DEX with powerful <br /> trading features &
        cross-margining for max efficiency.
      </p>

      <Link to={routes.trade} className="gradient_accent btn z-50 mt-10">
        Start Trading
      </Link>

      <ul className="mt-24 flex gap-12">
        <li className="rounded-xl px-4 py-5 hover:bg-layer">
          <p className="mb-3 text-gray-300">Total Volums</p>

          <h4 className="text-3xl font-bold">
            $<CountUp end={60} />
            B+
          </h4>
        </li>

        <li className="rounded-xl px-4 py-5 hover:bg-layer">
          <p className="mb-3 text-gray-300">Total Markets</p>
          <h4 className="text-3xl font-bold">
            <CountUp end={30} />+
          </h4>
        </li>

        <li className="rounded-xl px-4 py-5 hover:bg-layer">
          <p className="mb-3 text-gray-300">Number of Traders</p>
          <h4 className="text-3xl font-bold">
            <CountUp end={20} />
            k+
          </h4>
        </li>
      </ul>
    </div>
  )
}

const Backer = () => {
  const backerList = [
    '/brain-holdings.png',
    '/colab.png',
    '/hrt.png',
    'jane_street.png',
  ]

  return (
    <div id="Invester" className="flex-center flex-col py-24">
      <p className="font-bold">INVESTORS</p>
      <h2 className="text_gradient text-5xl font-bold">
        {'Investors & Partners'}
      </h2>
      <p className="mt-5 text-xl">
        Industry-leading market makers and venture capital firms.
      </p>

      <ul className="flex-center my-10 flex-wrap gap-5">
        {backerList.map((backer, index) => (
          <li
            key={index}
            className="flex-center z-10 h-[110px] w-[200px] rounded-lg bg-layer p-5 hover:bg-focus"
          >
            <img src={backer} alt="backer" />
          </li>
        ))}
      </ul>
    </div>
  )
}

const Safety = () => {
  const data = [
    {
      title: 'Decentralized',
      desc: 'Access an immutable money market directly on-chain. ',
      icon: GlobeAltIcon,
    },
    {
      title: 'BEP-20/ERC-20',
      desc: 'All Venus Protocol assets are bound by the BEP-20 and ERC-20 standards.',
      icon: CubeTransparentIcon,
    },
    {
      title: 'Multichain',
      desc: 'Built on EVM-compatible chains for fast, secure, and low cost transactions',
      icon: EllipsisHorizontalIcon,
    },
  ]

  return (
    <div className="flex-center container my-24 flex-col">
      <h3 className="text_gradient text-3xl font-bold">Safety before all</h3>
      <p className="mt-5">
        Transact with confidence, knowing Venus places nothing before the
        security of your assets
      </p>

      <ul className="flex-center mt-20 flex-wrap gap-5">
        {data.map(({ title, desc, icon: Icon }, index) => (
          <li
            key={index}
            className="h-[250px] w-[300px] rounded-xl bg-layer p-5 hover:bg-focus"
          >
            <Icon className="mb-10 mt-5 size-10" />
            <h4 className="text-2xl font-bold">{title}</h4>
            <p className="mt-2 text-gray-400">{desc}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
