// @noErrors
import {
  createConfig,
  cookieStorage,
  AlchemyAccountsUIConfig,
} from '@account-kit/react'
import { alchemy, sepolia } from '@account-kit/infra'
import { env } from './constant'

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: 'outline',
  auth: {
    sections: [
      [{ type: 'email' }],
      [
        { type: 'passkey' },
        { type: 'social', authProviderId: 'google', mode: 'popup' },
        { type: 'social', authProviderId: 'facebook', mode: 'popup' },
        { type: 'social', authProviderId: 'twitch', mode: 'popup' },
        {
          type: 'social',
          authProviderId: 'auth0',
          mode: 'popup',
          auth0Connection: 'discord',
          displayName: 'Discord',
          logoUrl: '/images/discord.svg',
          scope: 'openid profile',
        },
        {
          type: 'social',
          authProviderId: 'auth0',
          mode: 'popup',
          auth0Connection: 'twitter',
          displayName: 'Twitter',
          logoUrl: '/images/twitter.svg',
          logoUrlDark: '/images/twitter-dark.svg',
          scope: 'openid profile',
        },
      ],
      [
        {
          type: 'external_wallets',
          walletConnect: { projectId: env.VITE_WALLET_CONNECT_ID },
        },
      ],
    ],
    addPasskeyOnSignup: false,
  },
}

export const alchemyConfig = createConfig(
  {
    // alchemy config
    transport: alchemy({ apiKey: env.VITE_ALCHEMY_API_KEY }), // TODO: add your Alchemy API key - setup your app and embedded account config in the alchemy dashboard (https://dashboard.alchemy.com/accounts)
    chain: sepolia, // TODO: specify your preferred chain here and update imports from @account-kit/infra
    ssr: true, // Defers hydration of the account state to the client after the initial mount solving any inconsistencies between server and client state (read more here: https://www.alchemy.com/docs/wallets/react/ssr)
    storage: cookieStorage, // persist the account state using cookies (read more here: https://www.alchemy.com/docs/wallets/react/ssr#persisting-the-account-state)
    enablePopupOauth: true, // must be set to "true" if you plan on using popup rather than redirect in the social login flow
    // optional config to override default session manager config
    sessionConfig: {
      expirationTimeMs: 1000 * 60 * 60, // 60 minutes (default is 15 min)
    },
  },
  uiConfig,
)
