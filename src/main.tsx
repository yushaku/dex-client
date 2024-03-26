import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThirdwebProvider } from '@thirdweb-dev/react'
import { ConnectKitProvider } from 'connectkit'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { WagmiProvider } from 'wagmi'
import App from './App.tsx'
import './styles/index.css'
import { config, connectModalStyle, env } from './utils'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider customTheme={connectModalStyle}>
          <ThirdwebProvider
            activeChain="binance-testnet"
            clientId={env.VITE_THIRD_WEB}
          >
            <App />
            <ToastContainer />
          </ThirdwebProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)
