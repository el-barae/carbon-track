"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { RefreshCw, Shield, Database, UserPlus, CheckCircle, XCircle, Coins } from "lucide-react"

interface AdminSectionProps {
  onDataRefresh: () => Promise<void>
  onMintCredits: (recipient: string, amount: string, projectId: string) => Promise<void>
  // onVerifyCredit: (creditId: string, status: "verified" | "rejected", notes?: string) => Promise<void>
  isPending: boolean
}

export default function AdminSection({ onDataRefresh, onMintCredits, 
  // onVerifyCredit,
   isPending }: AdminSectionProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showMintForm, setShowMintForm] = useState(false)
  const [showVerifyForm, setShowVerifyForm] = useState(false)

  // Mint form state
  const [mintRecipient, setMintRecipient] = useState("")
  const [mintAmount, setMintAmount] = useState("")
  const [mintProjectId, setMintProjectId] = useState("")

  // Verify form state
  const [verifyCreditId, setVerifyCreditId] = useState("")
  const [verifyNotes, setVerifyNotes] = useState("")

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

  const handleMintCredits = async () => {
    if (!mintRecipient || !mintAmount || !mintProjectId) return

    try {
      await onMintCredits(mintRecipient, mintAmount, mintProjectId)
      // Clear form on success
      setMintRecipient("")
      setMintAmount("")
      setMintProjectId("")
      setShowMintForm(false)
    } catch (error) {
      console.error("Failed to mint credits:", error)
    }
  }

  const handleVerifyCredit = async (status: "verified" | "rejected") => {
    if (!verifyCreditId) return

    try {
      // await onVerifyCredit(verifyCreditId, status, verifyNotes)
      // Clear form on success
      setVerifyCreditId("")
      setVerifyNotes("")
      setShowVerifyForm(false)
    } catch (error) {
      console.error("Failed to verify credit:", error)
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
        {/* Data Refresh Section */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Refresh System Data
              </h3>
              <p className="text-sm text-gray-600 mt-1">Reload all data from the blockchain and backend API</p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing || isPending}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Mint Credits Section */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-green-800 flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Mint Carbon Credits
              </h3>
              <p className="text-sm text-green-600 mt-1">Issue new carbon credits to verified projects</p>
            </div>
            <Button
              onClick={() => setShowMintForm(!showMintForm)}
              variant="outline"
              className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-100"
            >
              <UserPlus className="w-4 h-4" />
              {showMintForm ? "Cancel" : "Mint Credits"}
            </Button>
          </div>

          {showMintForm && (
            <div className="mt-4 space-y-3">
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">Recipient Address</label>
                  <Input
                    type="text"
                    placeholder="0x..."
                    value={mintRecipient}
                    onChange={(e:any) => setMintRecipient(e.target.value)}
                    className="border-green-300 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">Amount (SCO2)</label>
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="100.000000"
                    value={mintAmount}
                    onChange={(e:any) => setMintAmount(e.target.value)}
                    className="border-green-300 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">Project ID</label>
                  <Input
                    type="text"
                    placeholder="PROJ-001"
                    value={mintProjectId}
                    onChange={(e:any) => setMintProjectId(e.target.value)}
                    className="border-green-300 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleMintCredits}
                  disabled={isPending || !mintRecipient || !mintAmount || !mintProjectId}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isPending ? "Minting..." : "Mint Credits"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Verify Credits Section */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Verify Carbon Credits
              </h3>
              <p className="text-sm text-blue-600 mt-1">Approve or reject carbon credit submissions</p>
            </div>
            <Button
              onClick={() => setShowVerifyForm(!showVerifyForm)}
              variant="outline"
              className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <CheckCircle className="w-4 h-4" />
              {showVerifyForm ? "Cancel" : "Verify Credits"}
            </Button>
          </div>

          {showVerifyForm && (
            <div className="mt-4 space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Credit ID</label>
                  <Input
                    type="text"
                    placeholder="credit_123456"
                    value={verifyCreditId}
                    onChange={(e:any) => setVerifyCreditId(e.target.value)}
                    className="border-blue-300 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Verification Notes</label>
                  <Input
                    type="text"
                    placeholder="Optional verification notes..."
                    value={verifyNotes}
                    onChange={(e:any) => setVerifyNotes(e.target.value)}
                    className="border-blue-300 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleVerifyCredit("verified")}
                  disabled={isPending || !verifyCreditId}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {isPending ? "Processing..." : "Approve"}
                </Button>
                <Button
                  onClick={() => handleVerifyCredit("rejected")}
                  disabled={isPending || !verifyCreditId}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  {isPending ? "Processing..." : "Reject"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* System Info */}
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="text-sm text-purple-800">
            <strong>Admin Functions:</strong> This section provides comprehensive administrative controls for the carbon
            credit system. All operations use API-first approach with optional blockchain integration for transparency
            and immutability.
          </div>
        </div>
      </div>
    </section>
  )
}
