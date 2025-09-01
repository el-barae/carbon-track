// lib/wagmi.ts
import { createConfig, http } from "wagmi"
import { defineChain } from "viem"
import { injected } from "wagmi/connectors"
import { sepolia } from "wagmi/chains"

// 1. Définir Ganache
export const ganache = defineChain({
  id: 1337,
  name: "Ganache",
  network: "ganache",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:7545"] },
    public: { http: ["http://127.0.0.1:7545"] },
  },
  blockExplorers: {
    default: { name: "Ganache", url: "http://127.0.0.1:7545" },
  },
})

// 2. Créer config Wagmi
export const config = createConfig({
  chains: [ganache, sepolia], // Ganache en premier = "par défaut"
  connectors: [injected()],
  transports: {
    [ganache.id]: http("http://127.0.0.1:7545"),
    [sepolia.id]: http("https://rpc.sepolia.org"),
  },
})
