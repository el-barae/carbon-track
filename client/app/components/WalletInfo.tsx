'use client'

import { useAccount, useBalance, useEnsName } from 'wagmi'
import { Copy, ExternalLink } from 'lucide-react'
import { useState } from 'react'

export default function WalletInfo() {
  const { address, chain } = useAccount()
  const { data: balance } = useBalance({ address })
  const { data: ensName } = useEnsName({ address })
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!address) return null

  return (
    <div className="card max-w-sm">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Wallet Info</h3>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <div className={`w-2 h-2 rounded-full ${
              chain?.name ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            <span>{chain?.name || 'Unknown'}</span>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Address</p>
          <div className="flex items-center space-x-2">
            <p className="font-mono text-sm">
              {ensName || formatAddress(address)}
            </p>
            <button
              onClick={copyAddress}
              className="p-1 hover:bg-gray-100 rounded"
              title="Copy address"
            >
              <Copy className="h-3 w-3 text-gray-400" />
            </button>
            <a
              href={`${chain?.blockExplorers?.default.url}/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-gray-100 rounded"
              title="View on explorer"
            >
              <ExternalLink className="h-3 w-3 text-gray-400" />
            </a>
          </div>
          {copied && (
            <p className="text-xs text-green-600 mt-1">Address copied!</p>
          )}
        </div>
        
        {balance && (
          <div>
            <p className="text-sm text-gray-600">Balance</p>
            <p className="font-semibold">
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
