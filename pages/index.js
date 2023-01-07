import Head from 'next/head'
import * as React from 'react'
import { Profile } from './Profile'

import { WagmiConfig, createClient, configureChains  } from 'wagmi'
import { avalanche, bsc,optimism, arbitrum, mainnet,polygon, localhost } from '@wagmi/core/chains'

import { publicProvider } from 'wagmi/providers/public'
 
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'


// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, avalanche, bsc,polygon, localhost,optimism],
  [publicProvider()],
)
 
// Set up client
const client = createClient({
  // autoConnect: true,
  connectors: [
    new MetaMaskConnector({chains
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'multiChain Connect',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Auto-Detect',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
})
 
export default function Home() {
  return (
    <WagmiConfig client={client}>
      <Profile />
    </WagmiConfig>
  )
}
