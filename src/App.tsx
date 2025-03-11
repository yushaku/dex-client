import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout'
import {
  AddLiquidity,
  AdminPage,
  Bridge,
  CollectionNFTs,
  Dashboard,
  DetailNFT,
  HistoryPage,
  Home,
  NFTsStudio,
  NftMarket,
  NotMatch,
  Pools,
  ShopPage,
  Swap,
  UserCollection,
  UserNftDetail,
  UserNfts,
} from './pages'
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

          <Route path={routes.pools} element={<Pools />} />
          <Route path={routes.addLiquidity} element={<AddLiquidity />} />

          <Route path={routes.history} element={<HistoryPage />} />
          <Route path={routes.admin} element={<AdminPage />} />
          <Route path={routes.shop} element={<ShopPage />} />
          <Route path="*" element={<NotMatch />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
