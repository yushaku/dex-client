import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { WagmiProvider } from 'wagmi'
import App from './App.tsx'
import { checkUser } from './apis'
import './styles/index.css'
import { config, connectModalStyle, env } from './utils'
import { ThirdwebProvider } from '@thirdweb-dev/react'
import { TxModalLoading } from './components/Modal'
import { AssetsProvider } from './hooks/useAssets.tsx'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <ThirdwebProvider
        activeChain="binance-testnet"
        clientId={env.VITE_THIRD_WEB}
      >
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider
            theme="midnight"
            onConnect={({ address }) => checkUser(address)}
            customTheme={connectModalStyle}
          >
            <AssetsProvider>
              <App />
            </AssetsProvider>

            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />

            <TxModalLoading />
          </ConnectKitProvider>
        </QueryClientProvider>
      </ThirdwebProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
