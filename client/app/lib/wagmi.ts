import { createConfig, http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { injected, metaMask, walletConnect } from "wagmi/connectors"

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected(), metaMask(), walletConnect({ projectId: "03e2710971623c0020c2fb0fe3e5d865" })],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})
