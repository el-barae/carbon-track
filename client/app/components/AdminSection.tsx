"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { RefreshCw, Shield, Database } from "lucide-react"

interface AdminSectionProps {
  onDataRefresh: () => Promise<void>
}

export default function AdminSection({ onDataRefresh }: AdminSectionProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await onDataRefresh()
    } catch (error) {
      console.error("Failed to refresh data:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-600" />
          Admin Controls
        </h2>
        <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          System Management
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Refresh On-Chain Data
              </h3>
              <p className="text-sm text-gray-600 mt-1">Reload all data from the blockchain and backend API</p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Note:</strong> This section provides basic administrative functions. For advanced contract
            management (minting, verification), use the backend API directly or implement additional admin interfaces.
          </div>
        </div>
      </div>
    </section>
  )
}
