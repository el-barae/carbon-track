"use client"

import { Wallet, Copy, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"

interface WalletSectionProps {
  address?: string
  balance?: bigint
  decimals?: number  
  fmt: (n?: number | string | bigint, d?: number) => string
}


export default function WalletSection({ address, balance, decimals, fmt }: WalletSectionProps) {
  const isLoading = balance === undefined || decimals === undefined
  const decimalsToUse = decimals ?? 6
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const copyAddress = async () => {
    if (address && navigator.clipboard) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (addr: string) => `${addr.slice(0, 8)}...${addr.slice(-6)}`

  if (!address) {
    return (
      <section className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl shadow-lg p-8 border border-blue-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Connect your Web3 wallet to start trading carbon credits on the blockchain
          </p>
          <div className="text-sm text-gray-500">Supported wallets: MetaMask, WalletConnect, Coinbase Wallet</div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg p-6 border border-green-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-green-600" />
          Wallet Connected
        </h2>
        <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Active</div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Wallet Address */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-600 mb-2">Wallet Address</label>
          <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg">
            <span className="font-mono text-sm text-gray-800 flex-1">{formatAddress(address)}</span>

            <button
              onClick={copyAddress}
              className="h-8 w-8 p-0 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              <Copy className="w-3 h-3" />
            </button>

            <button
              onClick={() => window.open(`https://etherscan.io/address/${address}`, "_blank")}
              className="h-8 w-8 p-0 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {copied && <p className="text-xs text-green-600 mt-1">Address copied to clipboard!</p>}
        </div>

        {/* Token Balance */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-600 mb-2">SCO2 Token Balance</label>
          <div className="p-3 bg-white border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-green-700">
                {isLoading ? "Loading..." : fmt(balance, decimalsToUse)}{" "}
              <span className="text-sm font-medium text-gray-500">SCO2</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Carbon Credit Tokens</div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full mt-0.5 flex-shrink-0"></div>
          <div className="text-sm text-blue-800">
            <strong>Connected to CO2ken Contract:</strong> Your wallet is connected to the carbon credit smart contract.
            You can now create listings, buy credits, and retire tokens.
          </div>
        </div>
      </div>
    </section>
  )
}
