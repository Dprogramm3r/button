import  Profile from '../components/Profile'
import "@rainbow-me/rainbowkit/styles.css";

import { WagmiConfig, createClient, configureChains  } from 'wagmi'
import { avalanche, bsc,optimism, arbitrum, mainnet,polygon, localhost } from '@wagmi/core/chains'

import { publicProvider } from 'wagmi/providers/public'
 
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import {
  RainbowKitProvider,connectorsForWallets, darkTheme
} from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,metaMaskWallet,trustWallet,coinbaseWallet,omniWallet,ledgerWallet,braveWallet 
} from '@rainbow-me/rainbowkit/wallets';


// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, avalanche, bsc,polygon, localhost,optimism,arbitrum],
  [publicProvider()],
)
 
const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      // injectedWallet({ chains }),
      metaMaskWallet({ chains }),
      trustWallet({ chains }),
      walletConnectWallet({ chains }),
      rainbowWallet({ chains }),

    ],
  },
  {
    groupName: 'More',
    wallets: [
      coinbaseWallet({ chains, appName: 'Others' }),
      ledgerWallet({ chains }),
      braveWallet({ chains }),
      omniWallet({ chains }),
    ],
  },
]);


// Set up client
const client = createClient({
  // autoConnect: true,
  connectors: connectors ,
  provider,
  webSocketProvider,
})
 
export default function Home() {
  return (
    <WagmiConfig client={client}>
    <RainbowKitProvider theme={darkTheme()} chains={chains}  modalSize="compact" >
      <Profile />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
