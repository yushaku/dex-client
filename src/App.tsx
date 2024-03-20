import { Layout } from './components/layout'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './components/pages/home'
import { Dashboard } from './components/pages/Dashboard'
import { NotMatch } from './components/pages/Notmatch'
import { Swap } from './components/pages/Swap'
import { Nfts } from './components/pages/Nft'
import { routes } from './utils'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path={routes.dashboard} element={<Dashboard />} />
          <Route path={routes.trade} element={<Swap />} />
          <Route path={routes.nfts} element={<Nfts />} />
          <Route path="*" element={<NotMatch />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
