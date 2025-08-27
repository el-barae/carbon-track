"use client"

import { useState, useEffect } from "react"

interface CreateListingSectionProps {
  onCreateListing: (amount: string, price: string) => Promise<void>
  isPending: boolean
}

export default function CreateListingSection({ onCreateListing, isPending }: CreateListingSectionProps) {
  const [amount, setAmount] = useState("")
  const [price, setPrice] = useState("")
  const [calculatedValue, setCalculatedValue] = useState<string | null>(null)

  useEffect(() => {
    if (amount && price) {
      setCalculatedValue((Number(amount) * Number(price)).toFixed(6))
    } else {
      setCalculatedValue(null)
    }
  }, [amount, price])

  const handleCreate = async () => {
    if (!amount || !price) return
    try {
      await onCreateListing(amount, price)
      setAmount("")
      setPrice("")
    } catch (error) {
      console.error("Failed to create listing:", error)
    }
  }

  const isFormValid = amount && price && Number(amount) > 0 && Number(price) > 0

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">💰 Create Marketplace Listing</h2>
        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Smart Contract</div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Token Amount</label>
          <div className="relative">
            <input
              type="number"
              step="0.000001"
              placeholder="e.g. 12.500000"
              className="w-full border border-gray-300 rounded-lg p-3 pr-16 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <span className="absolute right-3 top-3 text-gray-500 text-sm font-medium">SCO2</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Number of carbon credit tokens to sell</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Price per Token</label>
          <div className="relative">
            <input
              type="number"
              step="0.000001"
              placeholder="e.g. 0.002000"
              className="w-full border border-gray-300 rounded-lg p-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <span className="absolute right-3 top-3 text-gray-500 text-sm font-medium">ETH</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Price in ETH for each token</p>
        </div>
      </div>

      {calculatedValue && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-blue-800">Total Value:</span>
            <span className="font-bold text-blue-900">{calculatedValue} ETH</span>
          </div>
        </div>
      )}

      <button
        onClick={handleCreate}
        disabled={isPending || !isFormValid}
        className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Creating Listing...
          </span>
        ) : (
          "Create Listing"
        )}
      </button>

      <div className="mt-4 text-xs text-gray-500">
        <p>⚠️ Your tokens will be held in escrow by the smart contract until sold or cancelled.</p>
      </div>
    </section>
  )
}
