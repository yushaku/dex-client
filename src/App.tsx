import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout'
import {
  AdminPage,
  CollectionNFTs,
  Comming,
  Dashboard,
  DetailNFT,
  HistoryPage,
  Home,
  NFTsStudio,
  NftMarket,
  NotMatch,
  ShopPage,
  Swap,
  UserCollection,
  UserNftDetail,
  UserNfts,
} from './pages'
import { Bridge } from './pages/brige'
import { routes } from './utils'

function App() {
  // const { address, isConnected } = useAccount()

  // useEffect(() => {
  //   if (isConnected) {
  //     checkUser(address)
  //   }
  // }, [address, isConnected])

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path={routes.dashboard} element={<Dashboard />} />
          <Route path={routes.trade} element={<Swap />} />
          <Route path={routes.bridge} element={<Bridge />} />

          <Route path={routes.nfts} element={<NftMarket />} />
          <Route path={routes.nftStudio} element={<NFTsStudio />} />
          <Route path={`${routes.nfts}/:id`} element={<CollectionNFTs />} />
          <Route path={`${routes.nfts}/:id/:cip`} element={<DetailNFT />} />

          <Route path={routes.myNFTs} element={<UserCollection />} />
          <Route path={`${routes.myNFTs}/:id`} element={<UserNfts />} />
          <Route
            path={`${routes.myNFTs}/:id/:cip`}
            element={<UserNftDetail />}
          />

          <Route path={routes.history} element={<HistoryPage />} />
          <Route path={routes.vaults} element={<Comming />} />
          <Route path={routes.admin} element={<AdminPage />} />
          <Route path={routes.shop} element={<ShopPage />} />
          <Route path="*" element={<NotMatch />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
