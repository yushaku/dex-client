import { routes } from '@/utils'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const NftDashboard = () => {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(collections[index])

  useEffect(() => {
    const id = setInterval(() => {
      setSelected(collections[index])
      setIndex((index + 1) % collections.length)
    }, 10_000)

    return () => clearInterval(id)
  }, [index])

  return (
    <section className="w-full">
      <div className="group relative overflow-hidden rounded-lg">
        <img
          className="h-[600px] w-full object-cover"
          src={selected.img}
          alt="NFT"
        />
        <article className="absolute inset-0 w-full bg-gradient-to-t from-[rgba(0,0,0,0.9)] to-[rgba(255,255,255,0.05)]" />
        <article className="absolute bottom-0 left-0 p-10">
          <div className="animate flex translate-y-20 items-center gap-5 group-hover:translate-y-0">
            <img
              src={selected.authorImg}
              alt="Author"
              className="size-10 rounded-full"
            />
            <div>
              <h4 className="text-2xl font-bold">{selected.name}</h4>
              <h4 className="text-base">BY {selected.author}</h4>
            </div>
          </div>

          <div className="animate mt-6 flex items-center gap-5 opacity-0 delay-150 group-hover:opacity-100">
            <p>
              <span className="text-xs text-gray-300">FLOOR PRICE</span>
              <span>4.15 ETH</span>
            </p>
            <p>
              <span className="text-xs text-gray-300">1D VOLUME</span>
              <span>49.15 ETH</span>
            </p>

            <Link
              to={`${routes.nfts}/${selected.address}`}
              className="btn btn-outline flex-start animate opacity-0 delay-300 group-hover:translate-x-5 group-hover:opacity-100"
            >
              <span>View collection</span>
              <ArrowRightIcon className="size-5" />
            </Link>
          </div>
        </article>
      </div>

      <ul className="relative mt-5 grid grid-cols-5 gap-5">
        {collections.map((col, jndex) => {
          return (
            <li
              className="animate group relative cursor-pointer overflow-hidden rounded-lg hover:-translate-y-2"
              onClick={() => setSelected(col)}
              key={jndex}
            >
              <img
                src={col.img}
                alt="NFT"
                className="animate h-[150px] w-full group-hover:scale-110"
              />
              <h3 className="animate absolute bottom-0 z-10 p-4 text-sm font-bold text-gray-300 group-hover:-bottom-6 group-hover:opacity-0">
                {col.author}
              </h3>
              <article className="absolute inset-0 w-full bg-gradient-to-t from-[rgba(0,0,0,1)] to-[rgba(255,255,255,0.2)] group-hover:-bottom-5" />
            </li>
          )
        })}
      </ul>
    </section>
  )
}

const collections = [
  {
    name: 'Gundams war',
    author: 'Yushaku',
    authorImg: '/logo.png',
    address: '0x14a9c99d89106F66C2B86910d2C622Ce0A58C630',
    img: '/gundams.jpg'
  },
  {
    name: 'Pudgy Penguins',
    author: 'PUDGY PENGUINS',
    authorImg:
      'https://images.blur.io/_blur-prod/0xbd3531da5cf5857e7cfaa92426877b022e612cf8/7387-2a29cab51c8c73ac?w=64&h=64',
    address: '0x14a9c99d89106F66C2B86910d2C622Ce0A58C630',
    img: 'https://images.blur.io/_blur-prod/_assets/homepage/covers/bayc-1.png?w=1560&format=png'
  },
  {
    name: 'Pudgy Penguins',
    author: 'PUDGY PENGUINS',
    address: '0x14a9c99d89106F66C2B86910d2C622Ce0A58C630',
    authorImg:
      'https://images.blur.io/_blur-prod/0xbd3531da5cf5857e7cfaa92426877b022e612cf8/7387-2a29cab51c8c73ac?w=64&h=64',
    img: 'https://images.blur.io/_blur-prod/_assets/homepage/covers/azuki-1.png?w=1560&format=png'
  },
  {
    name: 'Pudgy Penguins',
    author: 'PUDGY PENGUINS',
    address: '0x14a9c99d89106F66C2B86910d2C622Ce0A58C630',
    authorImg:
      'https://images.blur.io/_blur-prod/0xbd3531da5cf5857e7cfaa92426877b022e612cf8/7387-2a29cab51c8c73ac?w=64&h=64',
    img: 'https://i.seadn.io/gae/5c-HcdLMinTg3LvEwXYZYC-u5nN22Pn5ivTPYA4pVEsWJHU1rCobhUlHSFjZgCHPGSmcGMQGCrDCQU8BfSfygmL7Uol9MRQZt6-gqA?w=886'
  },
  {
    name: 'Pudgy Penguins',
    author: 'PUDGY PENGUINS',
    address: '0x14a9c99d89106F66C2B86910d2C622Ce0A58C630',
    authorImg:
      'https://images.blur.io/_blur-prod/0xbd3531da5cf5857e7cfaa92426877b022e612cf8/7387-2a29cab51c8c73ac?w=64&h=64',
    img: 'https://i.seadn.io/gae/0rRqgbEAHfee51ZWv0Crstfq_o3cHB7JdOwMMG0QPKqncTtkTvtTrEaLUcUysJHeLrLQ6UgtXmJB2-8xP3p-Z2_fhgnl6MgQmOY2?w=500&auto=format'
  }
]
