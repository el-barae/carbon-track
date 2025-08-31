import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { defineChain } from "viem";
import { injected } from "wagmi/connectors";

// 1. Define Ganache chain
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
});

// 2. Create wagmi config
export const config = createConfig({
  connectors: [injected()],
  chains: [ganache, sepolia],
  transports: {
    [ganache.id]: http("http://127.0.0.1:7545"),
    [sepolia.id]: http("https://rpc.sepolia.org"),
  },
});
