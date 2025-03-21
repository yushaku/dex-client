import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { WagmiProvider } from 'wagmi'
import App from './App.tsx'
// import { checkUser } from './apis'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { TxModalLoading } from './components/Modal'
import { AssetsProvider } from './hooks/useAssets.tsx'
import './styles/index.css'
import { config, walletTheme } from './utils'
import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          appInfo={{
            appName: 'Yushaku dex',
            learnMoreUrl: 'https://yushaku-dex.vercel.app',
          }}
          theme={walletTheme}
          modalSize="wide"
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
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
