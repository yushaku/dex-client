import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { WagmiProvider } from 'wagmi'
import App from './App.tsx'
// import { checkUser } from './apis'
import { TxModalLoading } from './components/Modal'
import { AssetsProvider } from './hooks/useAssets.tsx'
import './styles/index.css'
import { config } from './utils'
import { AlchemyAccountProvider } from '@account-kit/react'
import { alchemyConfig } from './utils/alchemy.ts'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AlchemyAccountProvider
          config={alchemyConfig}
          queryClient={queryClient}
        >
          <AssetsProvider>
            <App />
          </AssetsProvider>

          <ToastContainer theme="dark" />
          <TxModalLoading />
        </AlchemyAccountProvider>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
