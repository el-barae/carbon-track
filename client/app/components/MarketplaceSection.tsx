"use client"

import { useEffect, useState } from "react"
import { ShoppingCart, X, TrendingUp } from "lucide-react"

interface MarketplaceSectionProps {
  listings: any[]
  address: string | undefined
  onBuy: (listing: any) => Promise<void>
  onCancel: (id: number) => Promise<void>
  fmt: (n?: number | string | bigint, d?: number) => string
  decimals: number
  loading: boolean
}

export default function MarketplaceSection({
  listings,
  address,
  onBuy,
  onCancel,
  fmt,
  decimals,
  loading,
}: MarketplaceSectionProps) {
  const [marketplaceData, setMarketplaceData] = useState({
    totalVolume: 0,
    avgPrice: 0,
  })

  const formatPrice = (pricePerToken: string, amount: string) => {
    const priceEth = Number(pricePerToken) / 1e18
    const tokens = Number(amount) / 10 ** decimals
    const total = priceEth * tokens
    return {
      pricePerToken: priceEth.toFixed(6),
      totalPrice: total.toFixed(6),
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Calculate total volume and average price on the client side after mount
  useEffect(() => {
    if (listings.length === 0) return

    const totalVolume = listings.reduce(
      (sum, listing) => sum + Number(listing.amount) / 10 ** decimals,
      0
    )

    const avgPrice =
      listings.reduce(
        (sum, listing) => sum + Number(listing.pricePerToken) / 1e18,
        0
      ) / listings.length

    setMarketplaceData({
      totalVolume: totalVolume,
      avgPrice: avgPrice,
    })
  }, [listings, decimals])

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Carbon Credit Marketplace
        </h2>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Smart Contract
          </div>
          <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            {listings.length} Active
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-4 font-mono bg-gray-50 px-3 py-2 rounded">
        GET /listings (active marketplace listings)
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-500 font-medium">Loading marketplace...</div>
        </div>
      ) : !listings.length ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏪</div>
          <div className="text-gray-500 font-medium mb-2">No active listings</div>
          <div className="text-sm text-gray-400">
            Be the first to create a listing and start trading carbon credits
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Marketplace Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-blue-600 font-medium text-sm">Active Listings</div>
              <div className="text-xl font-bold text-blue-800">{listings.length}</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-green-600 font-medium text-sm">Total Volume</div>
              <div className="text-xl font-bold text-green-800">
                {marketplaceData.totalVolume.toFixed(2)} SCO2
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="text-purple-600 font-medium text-sm">Avg Price</div>
              <div className="text-xl font-bold text-purple-800">
                {marketplaceData.avgPrice.toFixed(6)} ETH
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="space-y-3">
            {listings.map((listing: any) => {
              const { pricePerToken, totalPrice } = formatPrice(listing.pricePerToken, listing.amount)
              const isOwnListing = address && listing.seller.toLowerCase() === address.toLowerCase()

              return (
                <div
                  key={listing.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                          Listing #{listing.id}
                        </div>
                        <div className="text-lg font-bold text-gray-800">
                          {fmt(listing.amount, decimals)} SCO2
                        </div>
                        {isOwnListing && (
                          <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            Your Listing
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500 font-medium">Seller</div>
                          <div className="font-mono text-xs text-gray-700">{formatAddress(listing.seller)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 font-medium">Price per Token</div>
                          <div className="font-bold text-green-600">{pricePerToken} ETH</div>
                        </div>
                        <div>
                          <div className="text-gray-500 font-medium">Total Price</div>
                          <div className="font-bold text-blue-600">{totalPrice} ETH</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isOwnListing ? (
                        <button
                          onClick={() => onCancel(listing.id)}
                          className="flex items-center gap-2 rounded-md bg-red-600 hover:bg-red-700 px-3 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      ) : (
                        <button
                          onClick={() => onBuy(listing)}
                          disabled={!address}
                          className="flex items-center gap-2 rounded-md bg-green-600 hover:bg-green-700 px-3 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Buy Now
                        </button>
                      )}

                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
