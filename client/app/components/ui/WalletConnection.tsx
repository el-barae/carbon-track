"use client"

import { useEffect, useState } from "react"
import { Wallet } from "lucide-react"

interface WalletConnectionProps {
  address?: string
  onConnectWallet?: () => void
  formatAddress: (addr: string) => string
}

export default function WalletConnection({ address, onConnectWallet, formatAddress }: WalletConnectionProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // 🔹 évite l'hydration mismatch (même rendu côté serveur et client au 1er paint)
    return (
      <button
        className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white opacity-50 cursor-not-allowed"
        disabled
      >
        Loading...
      </button>
    )
  }

  return (
    <>
      {address ? (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">{formatAddress(address)}</span>
          </div>
          <div className="sm:hidden">
            <div className="w-8 h-8 bg-green-100 border-2 border-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={onConnectWallet}
          className="inline-flex items-center justify-center rounded-md bg-green-600 hover:bg-green-700 px-4 py-2 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </button>
      )}
    </>
  )
}
