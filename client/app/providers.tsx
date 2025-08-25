'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig, RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const wagmiConfig = getDefaultConfig({
  appName: 'CarbonTrack',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '03e2710971623c0020c2fb0fe3e5d865',
  chains: [sepolia],
  ssr: true,
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <header className="flex items-center justify-between px-4 py-3 bg-green-600 text-white shadow">
            <h1 className="text-xl font-semibold">🌍 CarbonTrack</h1>
            <ConnectButton />
          </header>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
