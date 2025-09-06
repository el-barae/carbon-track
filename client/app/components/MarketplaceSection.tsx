"use client"

import { useEffect, useState } from "react"
import { ShoppingCart, X, TrendingUp, Plus } from "lucide-react"

interface MarketplaceSectionProps {
  listings: any[]
  address: string | undefined
  onBuy: (listing: any) => Promise<void>
  onCancel: (id: number) => Promise<void>
  onCreateListing: (amount: string, price: string) => Promise<void>
  fmt: (n?: number | string | bigint, d?: number) => string
  decimals: number
  loading: boolean
  isPending?: boolean
}

export default function MarketplaceSection({
  listings,
  address,
  onBuy,
  onCancel,
  onCreateListing,
  fmt,
  decimals,
  loading,
  isPending = false,
}: MarketplaceSectionProps) {
  const [marketplaceData, setMarketplaceData] = useState({
    totalVolume: 0,
    avgPrice: 0,
  })
  
  // Create listing form state
  const [amount, setAmount] = useState("")
  const [price, setPrice] = useState("")
  const [calculatedValue, setCalculatedValue] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

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

  // Calculate total value for create listing form
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
      setShowCreateForm(false)
    } catch (error) {
      console.error("Failed to create listing:", error)
    }
  }

  const isFormValid = amount && price && Number(amount) > 0 && Number(price) > 0

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
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Listing
            </button>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-4 font-mono bg-gray-50 px-3 py-2 rounded">
        GET /listings (active marketplace listings)
      </div>

      {/* Admin Create Listing Form */}
      {showCreateForm && (
        <div className="mb-6 p-6 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              💰 Create Marketplace Listing
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Token Amount</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.000001"
                  placeholder="e.g. 12.500000"
                  className="w-full border border-gray-300 rounded-lg p-3 pr-16 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  step="0.00000001"
                  placeholder="e.g. 0.0000020"
                  className="w-full border border-gray-300 rounded-lg p-3 pr-12 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <span className="absolute right-3 top-3 text-gray-500 text-sm font-medium">ETH</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Price in ETH for each token</p>
            </div>
          </div>

          {calculatedValue && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-green-800">Total Value:</span>
                <span className="font-bold text-green-900">{calculatedValue} ETH</span>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 items-start">
            <button
              onClick={handleCreate}
              disabled={isPending || !isFormValid}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Listing...
                </span>
              ) : (
                "Create Listing"
              )}
            </button>

            <div className="text-xs text-gray-500">
              <p>⚠️ Your tokens will be held in escrow by the smart contract until sold or cancelled.</p>
            </div>
          </div>
        </div>
      )}

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
              {"Use the Create Listing button above to add the first listing to the marketplace or check back later for new carbon credit listings"}
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