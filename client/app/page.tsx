"use client"

import { useEffect, useState } from "react"
import { useAccount, useReadContract, useWriteContract } from "wagmi"
import { contractConfig } from "./lib/contract"
import * as api from "./lib/api"
import Navbar from "./components/Navbar"
import WalletSection from "./components/WalletSection"
import CreateListingSection from "./components/CreateListingSection"
import MarketplaceSection from "./components/MarketplaceSection"
import CreditsSection from "./components/CreditsSection"
import TransactionsSection from "./components/TransactionsSection"
import AdminSection from "./components/AdminSection"

const fmt = (n?: number | string | bigint, d = 6) => {
  if (n === undefined) return "0"
  const v = typeof n === "bigint" ? Number(n) : Number(n)
  return (v / 10 ** d).toLocaleString(undefined, { maximumFractionDigits: d })
}

export default function Page() {
  const { address } = useAccount()

  // Smart Contract States
  const { data: balance } = useReadContract({
    ...contractConfig,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  }) as { data?: bigint }

  const { data: decimals } = useReadContract({
    ...contractConfig,
    functionName: "decimals",
  }) as { data?: number }

  const { data: nextListingId } = useReadContract({
    ...contractConfig,
    functionName: "nextListingId",
  }) as { data?: bigint }

  const { writeContract, isPending } = useWriteContract()

  // On-Chain Data States (from backend)
  const [credits, setCredits] = useState<any[]>([])
  const [listings, setListings] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [userCredits, setUserCredits] = useState<any[]>([])
  const [userTransactions, setUserTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const d = decimals ?? 6

  // Load on-chain data from backend
  useEffect(() => {
    loadAllData()
  }, [])

  useEffect(() => {
    if (address) {
      loadUserData(address)
    }
  }, [address, credits])

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [creditsData, listingsData, transactionsData] = await Promise.all([
        api.fetchCredits(),
        api.fetchListings(),
        api.fetchTransactions(),
      ])
      setCredits(creditsData)
      setListings(listingsData)
      setTransactions(transactionsData)
    } catch (error) {
      console.error("Failed to load data:", error)
    }
    setLoading(false)
  }

  const loadUserData = async (userAddress: string) => {
    try {
      const [userTransactionsData] = await Promise.all([api.fetchTransactionsByAddress(userAddress)])

      // Filter credits minted to this user
      const userCreditsData = credits.filter((credit) => credit.to.toLowerCase() === userAddress.toLowerCase())

      setUserCredits(userCreditsData)
      setUserTransactions(userTransactionsData)
    } catch (error) {
      console.error("Failed to load user data:", error)
      setUserCredits([])
      setUserTransactions([])
    }
  }

  // Smart Contract Functions
  const createListing = async (amount: string, price: string) => {
    if (!amount || !price) return
    try {
      const tokenAmount = BigInt(Math.floor(Number(amount) * 10 ** d))
      const pricePerTokenWei = BigInt(Math.floor(Number(price) * 1e18))
      await writeContract({
        ...contractConfig,
        functionName: "createListing",
        args: [tokenAmount, pricePerTokenWei],
      })
      // Refresh data after transaction
      setTimeout(loadAllData, 2000)
    } catch (error) {
      console.error("Failed to create listing:", error)
    }
  }

  const buyListing = async (listing: any) => {
    try {
      const total = BigInt(listing.amount) * BigInt(listing.pricePerToken)
      await writeContract({
        ...contractConfig,
        functionName: "buyListing",
        args: [listing.id],
        value: total,
      })
      // Refresh data after transaction
      setTimeout(loadAllData, 2000)
    } catch (error) {
      console.error("Failed to buy listing:", error)
    }
  }

  const cancelListing = async (id: number) => {
    try {
      await writeContract({
        ...contractConfig,
        functionName: "cancelListing",
        args: [BigInt(id)],
      })
      // Refresh data after transaction
      setTimeout(loadAllData, 2000)
    } catch (error) {
      console.error("Failed to cancel listing:", error)
    }
  }

  const retireCredits = async (amount: string, reason: string) => {
    if (!amount || !reason) return
    try {
      const tokenAmount = BigInt(Math.floor(Number(amount) * 10 ** d))
      await writeContract({
        ...contractConfig,
        functionName: "retireCredits",
        args: [tokenAmount, reason],
      })
      // Refresh data after transaction
      setTimeout(() => {
        loadAllData()
        if (address) loadUserData(address)
      }, 2000)
    } catch (error) {
      console.error("Failed to retire credits:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar address={address} />

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        <WalletSection address={address} balance={balance} decimals={d} fmt={fmt} />

        <div id="create-listing">
          <CreateListingSection onCreateListing={createListing} isPending={isPending} />
        </div>

        <div id="marketplace">
          <MarketplaceSection
            listings={listings}
            address={address}
            onBuy={buyListing}
            onCancel={cancelListing}
            fmt={fmt}
            decimals={d}
            loading={loading}
          />
        </div>

        <div id="credits">
          <CreditsSection
            userCredits={userCredits}
            address={address}
            onRetireCredits={retireCredits}
            isPending={isPending}
            fmt={fmt}
            decimals={d}
          />
        </div>

        <div id="transactions">
          <TransactionsSection transactions={transactions} />
        </div>

        <div id="admin">
          <AdminSection onDataRefresh={loadAllData} />
        </div>
      </main>
    </div>
  )
}
