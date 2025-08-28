"use client"

import { useEffect, useState } from "react"
import { useAccount, useReadContract, useWriteContract } from "wagmi"
import { contractConfig } from "../lib/contract"
import {
  fetchCredits,
  fetchListings,
  fetchTransactions,
  fetchTransactionsByAddress,
  createListing as apiCreateListing,
  buyListing as apiBuyListing,
  cancelListing as apiCancelListing,
  adminMintCredits,
  adminVerifyCredit,
  formatTokenAmount,
  validateAddress,
  validateAmount,
  handleAPIError,
  type Credit,
  type Listing,
  type Transaction,
} from "../lib/api"
import Navbar from "./components/Navbar"
import WalletSection from "./components/WalletSection"
import CreateListingSection from "./components/CreateListingSection"
import MarketplaceSection from "./components/MarketplaceSection"
import CreditsSection from "./components/CreditsSection"
import TransactionsSection from "./components/TransactionsSection"
import AdminSection from "./components/AdminSection"

const fmt = (n?: number | string | bigint, d = 6) => {
  return formatTokenAmount(n?.toString() || "0", d)
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

  const [credits, setCredits] = useState<Credit[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [userCredits, setUserCredits] = useState<Credit[]>([])
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const d = decimals ?? 6

  // Load on-chain data from backend
  useEffect(() => {
    loadAllData()
  }, [])

  useEffect(() => {
    if (address && validateAddress(address)) {
      loadUserData(address)
    }
  }, [address, credits])

  const loadAllData = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("[v0] Loading all data from enhanced API service")
      const [creditsData, listingsData, transactionsData] = await Promise.all([
        fetchCredits(),
        fetchListings(),
        fetchTransactions(),
      ])

      console.log("[v0] Successfully loaded data:", {
        credits: creditsData.length,
        listings: listingsData.length,
        transactions: transactionsData.length,
      })

      setCredits(creditsData)
      setListings(listingsData)
      setTransactions(transactionsData)
    } catch (error) {
      console.error("[v0] Failed to load data:", error)
      setError("Failed to load blockchain data. Please try again.")
    }
    setLoading(false)
  }

  const loadUserData = async (userAddress: string) => {
    if (!validateAddress(userAddress)) {
      console.error("[v0] Invalid address provided:", userAddress)
      return
    }

    try {
      console.log("[v0] Loading user data for address:", userAddress)
      const [userTransactionsData] = await Promise.all([fetchTransactionsByAddress(userAddress)])

      // Filter credits minted to this user
      const userCreditsData = credits.filter((credit) => credit.to.toLowerCase() === userAddress.toLowerCase())

      console.log("[v0] User data loaded:", {
        userCredits: userCreditsData.length,
        userTransactions: userTransactionsData.length,
      })

      setUserCredits(userCreditsData)
      setUserTransactions(userTransactionsData)
    } catch (error) {
      console.error("[v0] Failed to load user data:", error)
      setUserCredits([])
      setUserTransactions([])
    }
  }

  const createListing = async (amount: string, price: string) => {
    if (!validateAmount(amount) || !validateAmount(price)) {
      console.error("[v0] Invalid amount or price provided")
      return
    }

    try {
      console.log("[v0] Creating listing:", { amount, price })

      const listingData = {
        amount: (Number(amount) * 10 ** d).toString(),
        pricePerToken: (Number(price) * 1e18).toString(),
      }

      await apiCreateListing(listingData)

      // Also create on-chain listing
      const tokenAmount = BigInt(Math.floor(Number(amount) * 10 ** d))
      const pricePerTokenWei = BigInt(Math.floor(Number(price) * 1e18))

      await writeContract({
        ...contractConfig,
        functionName: "createListing",
        args: [tokenAmount, pricePerTokenWei],
      })

      // Refresh data after transaction
      setTimeout(() => {
        console.log("[v0] Refreshing data after listing creation")
        loadAllData()
      }, 2000)
    } catch (error) {
      console.error("[v0] Failed to create listing:", handleAPIError(error))
    }
  }

  const buyListing = async (listing: Listing) => {
    try {
      console.log("[v0] Buying listing:", listing.id)

      await apiBuyListing(listing.id)

      // Also execute on-chain transaction
      const total = BigInt(listing.amount) * BigInt(listing.pricePerToken)

      await writeContract({
        ...contractConfig,
        functionName: "buyListing",
        args: [listing.id],
        value: total,
      })

      // Refresh data after transaction
      setTimeout(() => {
        console.log("[v0] Refreshing data after listing purchase")
        loadAllData()
      }, 2000)
    } catch (error) {
      console.error("[v0] Failed to buy listing:", handleAPIError(error))
    }
  }

  const cancelListing = async (id: number) => {
    try {
      console.log("[v0] Cancelling listing:", id)

      await apiCancelListing(id)

      // Also cancel on-chain listing
      await writeContract({
        ...contractConfig,
        functionName: "cancelListing",
        args: [BigInt(id)],
      })

      // Refresh data after transaction
      setTimeout(() => {
        console.log("[v0] Refreshing data after listing cancellation")
        loadAllData()
      }, 2000)
    } catch (error) {
      console.error("[v0] Failed to cancel listing:", handleAPIError(error))
    }
  }

  const retireCredits = async (amount: string, reason: string) => {
    if (!validateAmount(amount) || !reason.trim()) {
      console.error("[v0] Invalid amount or reason provided")
      return
    }

    try {
      console.log("[v0] Retiring credits:", { amount, reason })
      const tokenAmount = BigInt(Math.floor(Number(amount) * 10 ** d))

      await writeContract({
        ...contractConfig,
        functionName: "retireCredits",
        args: [tokenAmount, reason],
      })

      // Refresh data after transaction
      setTimeout(() => {
        console.log("[v0] Refreshing data after credit retirement")
        loadAllData()
        if (address) loadUserData(address)
      }, 2000)
    } catch (error) {
      console.error("[v0] Failed to retire credits:", error)
    }
  }

  // Admin functions for minting and verification
  const mintCredits = async (to: string, amount: string, projectId: string) => {
    if (!validateAddress(to) || !validateAmount(amount)) {
      console.error("[v0] Invalid recipient or amount provided")
      return
    }

    try {
      console.log("[v0] Admin minting credits:", { to, amount, projectId })

      const result = await adminMintCredits({
        to,
        amount,
        projectId,
        certifier: "Admin",
        vintage: new Date().getFullYear().toString(),
      })

      console.log("[v0] Credits minted successfully:", result)

      // Refresh data after minting
      setTimeout(() => {
        console.log("[v0] Refreshing data after credit minting")
        loadAllData()
      }, 1000)
    } catch (error) {
      console.error("[v0] Failed to mint credits:", handleAPIError(error))
    }
  }

  // const verifyCredit = async (creditId: string, status: "verified" | "rejected", notes?: string) => {
  //   try {
  //     console.log("[v0] Admin verifying credit:", { creditId, status, notes })

  //     const result = await adminVerifyCredit({
  //       creditId,
  //       status,
  //       notes,
  //     })

  //     console.log("[v0] Credit verification completed:", result)

  //     // Refresh data after verification
  //     setTimeout(() => {
  //       console.log("[v0] Refreshing data after credit verification")
  //       loadAllData()
  //     }, 1000)
  //   } catch (error) {
  //     console.error("[v0] Failed to verify credit:", handleAPIError(error))
  //   }
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar address={address} />

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

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
          <AdminSection
            onDataRefresh={loadAllData}
            onMintCredits={mintCredits}
            // onVerifyCredit={verifyCredit}
            isPending={isPending}
          />
        </div>
      </main>
    </div>
  )
}
