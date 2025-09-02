// lib/api.ts - Enhanced API service using fetch for comprehensive on-chain data backend
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000"
import { ethers } from "ethers";
import CO2KEN from "../abi/CO2ken.json";
import { CONTRACT_ADDRESS } from "./contract";

export interface ListingDataResponse {
  id: number;
  amount: string;
  pricePerToken: string;
  totalPrice: string;
}

// Types for on-chain data
export interface CreditMintEvent {
  to: string
  amount: string
  projectId: string
  vintage: string
  certifier: string
  txHash: string
  blockNumber: number
}

export interface ActiveListing {
  id: number
  seller: string
  amount: string
  pricePerToken: string
  active?: boolean
}

export interface TransferEvent {
  from: string
  to: string
  value: string
  txHash: string
  blockNumber: number
}

export interface AdminMintRequest {
  to: string
  amount: string
  projectId: string
  vintage: string
  certifier: string
}

export interface AdminVerifyRequest {
  holder: string
  verified: boolean
}

export interface AdminMintResponse {
  txHash: string
  blockNumber: number
}

export interface AdminVerifyResponse {
  txHash: string
  blockNumber: number
}

export interface CreateListingRequest {
  amount: string
  pricePerToken: string
}

export interface ListingTransactionResponse {
  txHash: string
  blockNumber: number
}

export interface CarbonFootprintRequest {
  energy: string; 
}

export interface CarbonFootprintResponse {
  energy: string;
  footprint: string;
  unit: string;
}

// API Error class
class APIError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "APIError"
  }
}

// Generic API request using fetch
async function apiRequest<T>(endpoint: string, options: { method?: "GET" | "POST"; data?: any } = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  console.log(`Making API request to: ${url}`) // Debug log

  try {
    const fetchOptions: RequestInit = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }

    if (options.data) {
      fetchOptions.body = JSON.stringify(options.data)
    }

    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      throw new APIError(response.status, `API request failed: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`API response from ${endpoint}:`, data)
    return data
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(`No response from API server at ${API_BASE}`)
    }

    throw new Error(`Request error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// ---- Credits API ----

// GET /credits - Fetch all credit mint events
export async function fetchCredits(): Promise<CreditMintEvent[]> {
  return apiRequest<CreditMintEvent[]>("/credits")
}

// Retire Credits
export async function retireCredits(amount: bigint, reason: string) {
  if (!window.ethereum) throw new Error("Metamask not found");
  const provider = new ethers.BrowserProvider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CO2KEN.abi, signer);
  const tx = await contract.retireCredits(amount, reason);

  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
  };
}

// ---- Listings API ----

// GET /listings - Fetch all active listings
export async function fetchListings(): Promise<ActiveListing[]> {
  return apiRequest<ActiveListing[]>("/listings")
}

// GET /listings/:id - Fetch specific listing by ID
export async function fetchListingById(id: number): Promise<ActiveListing> {
  return apiRequest<ActiveListing>(`/listings/${id}`)
}

// POST /listings - Create new listing
export async function createListing(data: CreateListingRequest): Promise<ListingTransactionResponse> {
  return apiRequest<ListingTransactionResponse>("/listings", {
    method: "POST",
    data,
  })
}

// Purchase a listing
// Achat d'une annonce
export async function buyListing(listing: Listing) {
  if (!window.ethereum) throw new Error("Metamask not found")

  const provider = new ethers.BrowserProvider(window.ethereum, "any")
  await provider.send("eth_requestAccounts", [])
  const signer = await provider.getSigner()

  const contract = new ethers.Contract(CONTRACT_ADDRESS, CO2KEN.abi, signer)

  // Ici on suppose que listing.pricePerToken est déjà en wei
  const pricePerTokenWei = BigInt(listing.pricePerToken)
  const expectedTotal = BigInt(listing.amount) * pricePerTokenWei

  console.log("[buyListing] listingId:", listing.id)
  console.log("[buyListing] amount:", listing.amount)
  console.log("[buyListing] pricePerTokenWei:", pricePerTokenWei.toString())
  console.log("[buyListing] expectedTotal (wei):", expectedTotal.toString())

  try {
    await contract.buyListing.staticCall(listing.id, {
      value: expectedTotal,
    })
  } catch (err) {
    console.error("[buyListing] Simulation failed:", err)
    throw new Error("Impossible d'acheter : " + (err as any).message)
  }

  const tx = await contract.buyListing(listing.id, {
    value: expectedTotal,
  })
  const receipt = await tx.wait()

  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
  }
}



// POST /listings/:id/cancel - Cancel a listing
export async function cancelListing(listingId: number): Promise<ListingTransactionResponse> {
  return apiRequest<ListingTransactionResponse>(`/listings/${listingId}/cancel`, {
    method: "POST",
    data: {}, // Empty body as required by backend
  })
}

// ---- Transactions API ----

// GET /transactions - Fetch all transfer events
export async function fetchTransactions(): Promise<TransferEvent[]> {
  return apiRequest<TransferEvent[]>("/transactions")
}

// GET /transactions/:address - Fetch transactions for specific address
export async function fetchTransactionsByAddress(address: string): Promise<TransferEvent[]> {
  return apiRequest<TransferEvent[]>(`/transactions/${address}`)
}

// ---- Admin API ----

// POST /admin/mint - Admin mint new credits
export async function adminMintCredits(data: AdminMintRequest): Promise<AdminMintResponse> {
  return apiRequest<AdminMintResponse>("/admin/mint", {
    method: "POST",
    data,
  })
}

// POST /admin/verify - Admin verify credit holder
export async function adminVerifyCredit(data: AdminVerifyRequest): Promise<AdminVerifyResponse> {
  return apiRequest<AdminVerifyResponse>("/admin/verify", {
    method: "POST",
    data,
  })
}

// GET /footprint
export async function getCarbonFootprint(
  energy: string,
  carKm: string = "0",
  flightKm: string = "0"
): Promise<CarbonFootprintResponse> {
  const params = new URLSearchParams({
    energy,
    carKm,
    flightKm,
  });

  return apiRequest<CarbonFootprintResponse>(`/footprint?${params.toString()}`, {
    method: "GET",
  });
}


// ---- Utility functions ----

export function formatTokenAmount(amount: string, decimals = 6): string {
  const value = Number(amount) / 10 ** decimals
  return value.toLocaleString(undefined, { maximumFractionDigits: decimals })
}

export function formatWeiToEth(weiAmount: string): string {
  const ethValue = Number(weiAmount) / 1e18
  return ethValue.toFixed(6)
}

export function formatWalletAddress(address: string, chars = 4): string {
  if (!address) return ""
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function calculateListingTotal(
  amount: string,
  pricePerToken: string,
  decimals = 6,
): {
  totalTokens: string
  totalETH: string
  totalWei: string
} {
  const tokens = Number(amount) / 10 ** decimals
  const pricePerTokenEth = Number(pricePerToken) / 1e18
  const totalEth = tokens * pricePerTokenEth
  const totalWei = (Number(amount) * Number(pricePerToken)).toString()

  return {
    totalTokens: tokens.toLocaleString(undefined, {
      maximumFractionDigits: decimals,
    }),
    totalETH: totalEth.toFixed(6),
    totalWei: totalWei,
  }
}

export function groupCreditsByHolder(credits: CreditMintEvent[]): Record<string, CreditMintEvent[]> {
  return credits.reduce(
    (acc, credit) => {
      if (!acc[credit.to]) {
        acc[credit.to] = []
      }
      acc[credit.to].push(credit)
      return acc
    },
    {} as Record<string, CreditMintEvent[]>,
  )
}

export function filterUserTransfers(
  transfers: TransferEvent[],
  userAddress: string,
): {
  received: TransferEvent[]
  sent: TransferEvent[]
  mints: TransferEvent[]
  burns: TransferEvent[]
} {
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
  const userAddr = userAddress.toLowerCase()

  const received = transfers.filter((t) => t.to.toLowerCase() === userAddr && t.from.toLowerCase() !== ZERO_ADDRESS)

  const sent = transfers.filter((t) => t.from.toLowerCase() === userAddr && t.to.toLowerCase() !== ZERO_ADDRESS)

  const mints = transfers.filter((t) => t.to.toLowerCase() === userAddr && t.from.toLowerCase() === ZERO_ADDRESS)

  const burns = transfers.filter((t) => t.from.toLowerCase() === userAddr && t.to.toLowerCase() === ZERO_ADDRESS)

  return { received, sent, mints, burns }
}

export function calculateTotalVolume(transfers: TransferEvent[], decimals = 6): number {
  return transfers.reduce((total, transfer) => total + Number(transfer.value) / 10 ** decimals, 0)
}

export function calculateUserBalance(transfers: TransferEvent[], userAddress: string, decimals = 6): number {
  const { received, sent, mints, burns } = filterUserTransfers(transfers, userAddress)

  const receivedAmount = calculateTotalVolume(received, decimals)
  const mintedAmount = calculateTotalVolume(mints, decimals)
  const sentAmount = calculateTotalVolume(sent, decimals)
  const burnedAmount = calculateTotalVolume(burns, decimals)

  return receivedAmount + mintedAmount - sentAmount - burnedAmount
}

export function sortListingsByPrice(listings: ActiveListing[], ascending = true): ActiveListing[] {
  return [...listings].sort((a, b) => {
    const priceA = Number(a.pricePerToken)
    const priceB = Number(b.pricePerToken)
    return ascending ? priceA - priceB : priceB - priceA
  })
}

export function filterListingsByPriceRange(
  listings: ActiveListing[],
  minPriceWei?: string,
  maxPriceWei?: string,
): ActiveListing[] {
  return listings.filter((listing) => {
    const price = Number(listing.pricePerToken)
    const minPrice = minPriceWei ? Number(minPriceWei) : 0
    const maxPrice = maxPriceWei ? Number(maxPriceWei) : Number.POSITIVE_INFINITY
    return price >= minPrice && price <= maxPrice
  })
}

export function filterListingsBySeller(listings: ActiveListing[], sellerAddress: string): ActiveListing[] {
  return listings.filter((listing) => listing.seller.toLowerCase() === sellerAddress.toLowerCase())
}

export function getListingStatistics(listings: ActiveListing[]): {
  totalListings: number
  totalVolume: string
  averagePrice: string
  medianPrice: string
  lowestPrice: string
  highestPrice: string
} {
  if (listings.length === 0) {
    return {
      totalListings: 0,
      totalVolume: "0",
      averagePrice: "0",
      medianPrice: "0",
      lowestPrice: "0",
      highestPrice: "0",
    }
  }

  const prices = listings.map((l) => Number(l.pricePerToken)).sort((a, b) => a - b)
  const totalVolume = listings.reduce((sum, l) => sum + Number(l.amount), 0)
  const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length
  const medianPrice = prices[Math.floor(prices.length / 2)]

  return {
    totalListings: listings.length,
    totalVolume: totalVolume.toString(),
    averagePrice: averagePrice.toString(),
    medianPrice: medianPrice.toString(),
    lowestPrice: prices[0].toString(),
    highestPrice: prices[prices.length - 1].toString(),
  }
}

// Error handling utilities
export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError
}

export function handleAPIError(error: unknown): string {
  if (isAPIError(error)) {
    return `API Error (${error.status}): ${error.message}`
  } else if (error instanceof Error) {
    return error.message
  } else {
    return "An unknown error occurred"
  }
}

// Validation utilities
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function isValidAmount(amount: string): boolean {
  const num = Number(amount)
  return !isNaN(num) && num > 0 && Number.isFinite(num)
}

export function parseTokenAmount(amount: string, decimals = 6): string {
  const value = Number.parseFloat(amount)
  if (isNaN(value) || value <= 0) {
    throw new Error("Invalid amount")
  }
  return (value * 10 ** decimals).toString()
}

export function parseEthToWei(ethAmount: string): string {
  const value = Number.parseFloat(ethAmount)
  if (isNaN(value) || value <= 0) {
    throw new Error("Invalid ETH amount")
  }
  return (value * 1e18).toString()
}

export function validateAddress(address: string): boolean {
  return isValidEthereumAddress(address)
}

export function validateAmount(amount: string): boolean {
  return isValidAmount(amount)
}

export type Credit = CreditMintEvent
export type Listing = ActiveListing
export type Transaction = TransferEvent
