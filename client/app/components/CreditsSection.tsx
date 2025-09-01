"use client"

import { useState, useEffect } from "react"
import { getCarbonFootprint } from "../../lib/api"

interface CreditsSectionProps {
  userCredits: any[]
  address: string | undefined
  onRetireCredits: (amount: string, reason: string) => Promise<void>
  isPending: boolean
  fmt: (n?: number | string | bigint, d?: number) => string
  decimals: number
}

export default function CreditsSection({
  userCredits,
  address,
  onRetireCredits,
  isPending,
  fmt,
  decimals,
}: CreditsSectionProps) {
  const [retireAmount, setRetireAmount] = useState("")
  const [retireReason, setRetireReason] = useState("")
  const [showRetireForm, setShowRetireForm] = useState(false)

  const [totalCredits, setTotalCredits] = useState(0)
  const [mounted, setMounted] = useState(false)

  // footprint states
  const [energy, setEnergy] = useState("")
  const [footprint, setFootprint] = useState<string | null>(null)
  const [carKm,setCarKm] = useState('')
  const [flightKm,setFlightKm] = useState('')
  const [loadingFootprint, setLoadingFootprint] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const sumCredits = userCredits.reduce((sum, credit) => sum + Number(credit.amount), 0)
    setTotalCredits(sumCredits)
  }, [userCredits])

  const handleRetire = async () => {
    if (!retireAmount || !retireReason) return
    try {
      await onRetireCredits(retireAmount, retireReason)
      setRetireAmount("")
      setRetireReason("")
      setShowRetireForm(false)
    } catch (error) {
      console.error("Failed to retire credits:", error)
    }
  }

  const handleCalculateFootprint = async () => {
    if (!energy && !carKm && !flightKm) return
    try {
      setLoadingFootprint(true)
      const res = await getCarbonFootprint(energy, carKm, flightKm)
      setFootprint(`${res.footprint} ${res.unit}`)
    } catch (err) {
      console.error("Footprint calculation failed:", err)
      setFootprint("Error calculating footprint")
    } finally {
      setLoadingFootprint(false)
    }
  }


  if (!mounted) {
    return (
      <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="text-center py-12 text-gray-400">Loading portfolio...</div>
      </section>
    )
  }

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">My Carbon Credits Portfolio</h2>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">On-Chain Events</div>
          <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            {userCredits.length} Credits
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-4 font-mono bg-gray-50 px-3 py-2 rounded">
        GET /credits (filtered by wallet address)
      </div>

      {!address ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">{!address ? "🔗" : !userCredits.length ? "📜" : "✅"}</div>
          <div className="text-gray-500 font-medium mb-2">
            {!address ? "Connect Your Wallet" : !userCredits.length ? "No carbon credits found" : ""}
          </div>
          <div className="text-sm text-gray-400">
            {!address
              ? "Connect your wallet to view your carbon credits portfolio"
              : !userCredits.length
              ? "You haven't been minted any carbon credits yet"
              : ""}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Portfolio Summary */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-600">Total Credits Minted</div>
                <div className="text-2xl font-bold text-green-700">
                  {fmt(totalCredits, decimals)} <span className="text-sm">SCO2</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Credit Batches</div>
                <div className="text-2xl font-bold text-blue-700">{userCredits.length}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Actions</div>
                <button
                  onClick={() => setShowRetireForm(!showRetireForm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-200"
                >
                  Retire Credits
                </button>
              </div>
            </div>
          </div>

          {/* ⚡️ Carbon Footprint Calculator */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 mb-3">Carbon Footprint Calculator</h3>
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <input
              type="number"
              placeholder="Energy consumed (kWh)"
              className="flex-1 border border-blue-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={energy}
              onChange={(e) => setEnergy(e.target.value)}
            />
            <input
              type="number"
              placeholder="Car travel (km)"
              className="flex-1 border border-blue-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={carKm}
              onChange={(e) => setCarKm(e.target.value)}
            />
            <input
              type="number"
              placeholder="Flight travel (km)"
              className="flex-1 border border-blue-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={flightKm}
              onChange={(e) => setFlightKm(e.target.value)}
            />
            <button
              onClick={handleCalculateFootprint}
              disabled={loadingFootprint || (!energy && !carKm && !flightKm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
            >
              {loadingFootprint ? "Calculating..." : "Calculate"}
            </button>
          </div>
          {footprint && ( <div className="text-sm font-medium text-gray-700"> Estimated Footprint:{" "} <span className="text-lg font-bold text-blue-700">{footprint}</span> </div> )}
          </div>

          {/* Retire Form */}
          {showRetireForm && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h3 className="font-semibold text-red-800 mb-3">Retire Carbon Credits</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-2">Amount to Retire</label>
                  <input
                    type="number"
                    step="0.000001"
                    placeholder="e.g. 5.000000"
                    className="w-full border border-red-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={retireAmount}
                    onChange={(e) => setRetireAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-2">Retirement Reason</label>
                  <input
                    type="text"
                    placeholder="e.g. Offsetting 2024 emissions"
                    className="w-full border border-red-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={retireReason}
                    onChange={(e) => setRetireReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRetire}
                  disabled={isPending || !retireAmount || !retireReason}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
                >
                  {isPending ? "Retiring..." : "Retire Credits"}
                </button>
                <button
                  onClick={() => setShowRetireForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-red-600 mt-2">
                ⚠️ Retiring credits permanently burns them from your balance. This action cannot be undone.
              </p>
            </div>
          )}

          {/* Credits List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 mb-3">Your Carbon Credits</h3>
            {userCredits.map((credit: any, index: number) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-2">
                    <div className="font-semibold text-gray-800 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {credit.projectId || "Unknown Project"}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500 font-medium">Amount</div>
                        <div className="font-bold text-green-600">{fmt(credit.amount, decimals)} SCO2</div>
                      </div>
                      <div>
                        <div className="text-gray-500 font-medium">Vintage</div>
                        <div className="font-semibold">{credit.vintage || "N/A"}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 font-medium">Certifier</div>
                        <div className="font-semibold">{credit.certifier || "N/A"}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 font-medium">Block</div>
                        <div className="font-semibold">#{credit.blockNumber}</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      <span className="font-mono">{credit.txHash}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Minted</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
