"use client"

import { useEffect, useState } from "react"
import { useAccount, useWriteContract, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { ethers } from "ethers"
import { contractConfig } from "../lib/contract"
import {
  fetchCredits,
  fetchListings,
  fetchTransactions,
  fetchTransactionsByAddress,
  createListing as apiCreateListing,
  buyListing as apiBuyListing,
  cancelListing as apiCancelListing,
  retireCredits as apiRetireCredits,
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
import CO2KEN from "../abi/CO2ken.json"

const fmt = (n?: number | string | bigint, d = 6) => {
  return formatTokenAmount(n?.toString() || "0", d)
}

export default function Page() {
  const { address } = useAccount()
  const { writeContract, isPending } = useWriteContract()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  // Smart Contract States
  const [balance, setBalance] = useState<bigint>()
  const [decimals, setDecimals] = useState<number>(6)
  const [nextListingId, setNextListingId] = useState<bigint>()

  const [credits, setCredits] = useState<Credit[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [userCredits, setUserCredits] = useState<Credit[]>([])
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 🔹 Fetch balance, decimals, nextListingId directly from contract
  useEffect(() => {
    const loadOnChainData = async () => {
      try {
        if (!window.ethereum || !address) return
        const provider = new ethers.BrowserProvider(window.ethereum)

        const contract = new ethers.Contract(contractConfig.address, CO2KEN.abi, provider)

        const [rawBalance, rawDecimals, rawNextListingId] = await Promise.all([
          contract.balanceOf(address),
          contract.decimals(),
          contract.nextListingId(),
        ])

        setBalance(rawBalance)
        // setDecimals(Number(rawDecimals))
        setNextListingId(rawNextListingId)
      } catch (err) {
        console.error("[v0] Failed to load contract data:", err)
      }
    }
    loadOnChainData()
  }, [address])

  const d = decimals ?? 6

  // Load off-chain data from backend
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

  // ----------------
  // Actions
  // ----------------
  const createListing = async (amount: string, price: string) => {
    if (!validateAmount(amount) || !validateAmount(price)) {
      console.error("[v0] Invalid amount or price provided")
      return
    }

    try {
      console.log("[v0] Creating listing:", { amount, price })

      const listingData = {
        amount: (Number(amount) * 10 ** d).toString(),          
        pricePerToken: ethers.parseEther(price).toString(),    
      }

      await apiCreateListing(listingData)

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
      await apiBuyListing(listing)

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
      const parsedAmount = ethers.parseUnits(amount, 18);

      await apiRetireCredits(parsedAmount, reason);

      setTimeout(() => {
        console.log("[v0] Refreshing data after credit retirement")
        loadAllData()
        if (address) loadUserData(address)
      }, 2000)
    } catch (error) {
      console.error("[v0] Failed to retire credits:", error)
    }
  }

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

      setTimeout(() => {
        console.log("[v0] Refreshing data after credit minting")
        loadAllData()
      }, 1000)
    } catch (error) {
      console.error("[v0] Failed to mint credits:", handleAPIError(error))
    }
  }

  const verifyCredit = async (holder: string, verified: boolean, notes?: string) => {
    try {
      console.log("[v0] Admin verifying credit:", { holder, verified, notes })
      const result = await adminVerifyCredit({ holder, verified })
      console.log("[v0] Credit verification completed:", result)

      setTimeout(() => {
        console.log("[v0] Refreshing data after credit verification")
        loadAllData()
      }, 1000)
    } catch (error) {
      console.error("[v0] Failed to verify credit:", handleAPIError(error))
    }
  }

  // ----------------
  // UI Sections
  // ----------------
  const [activeSection, setActiveSection] = useState("portfolio")

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "portfolio":
        return (
          <CreditsSection
            userCredits={userCredits}
            address={address}
            onRetireCredits={retireCredits}
            isPending={isPending}
            fmt={fmt}
            decimals={d}
          />
        )
      case "marketplace":
        return (
          <MarketplaceSection
            listings={listings}
            address={address}
            onBuy={buyListing}
            onCancel={cancelListing}
            fmt={fmt}
            decimals={d}
            loading={loading}
          />
        )
      case "create-listing":
        return <CreateListingSection onCreateListing={createListing} isPending={isPending} />
      case "transactions":
        return <TransactionsSection transactions={userTransactions} />
      case "admin":
        return (
          <AdminSection
            onDataRefresh={loadAllData}
            onMintCredits={mintCredits}
            onVerifyCredit={verifyCredit}
            isPending={isPending}
          />
        )
      default:
        return (
          <CreditsSection
            userCredits={userCredits}
            address={address}
            onRetireCredits={retireCredits}
            isPending={isPending}
            fmt={fmt}
            decimals={d}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar address={address} activeSection={activeSection} onSectionChange={handleSectionChange}  onConnectWallet={() => connect({ connector: injected() })} />

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

        <WalletSection address={address} balance={balance} decimals={decimals} fmt={fmt} onDisconnect={disconnect} />

        {renderActiveSection()}
      </main>
    </div>
  )
}
