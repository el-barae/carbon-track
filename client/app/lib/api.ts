// lib/api.ts - API service using Axios for on-chain data backend
import axios, { AxiosError } from "axios"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000"

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

export interface AdminMintResponse {
  txHash: string
  blockNumber: number
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

// Axios instance
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
})

// Generic API request
async function apiRequest<T>(
  endpoint: string,
  options: { method?: "GET" | "POST"; data?: any } = {},
): Promise<T> {
  console.log(`Making API request to: ${API_BASE}${endpoint}`) // Debug log
  try {
    const response = await apiClient.request<T>({
      url: endpoint,
      method: options.method || "GET",
      data: options.data,
    })
    console.log(`API response from ${endpoint}:`, response.data)
    return response.data
  } catch (err) {
    const error = err as AxiosError

    if (error.response) {
      // Server responded with error
      throw new APIError(
        error.response.status,
        `API request failed: ${JSON.stringify(error.response.data)}`,
      )
    } else if (error.request) {
      // No response from server
      throw new Error(`No response from API server at ${API_BASE}`)
    } else {
      // Request config error
      throw new Error(`Request error: ${error.message}`)
    }
  }
}

// ---- API Methods ----

// Credits API
export async function fetchCredits(): Promise<CreditMintEvent[]> {
  return apiRequest<CreditMintEvent[]>("/credits")
}

// Listings API
export async function fetchListings(): Promise<ActiveListing[]> {
  return apiRequest<ActiveListing[]>("/listings")
}

export async function fetchListingById(id: number): Promise<ActiveListing> {
  return apiRequest<ActiveListing>(`/listings/${id}`)
}

// Transactions API
export async function fetchTransactions(): Promise<TransferEvent[]> {
  return apiRequest<TransferEvent[]>("/transactions")
}

export async function fetchTransactionsByAddress(
  address: string,
): Promise<TransferEvent[]> {
  return apiRequest<TransferEvent[]>(`/transactions/${address}`)
}

// Admin API
export async function adminMintCredits(
  data: AdminMintRequest,
): Promise<AdminMintResponse> {
  return apiRequest<AdminMintResponse>("/admin/mint", {
    method: "POST",
    data,
  })
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
} {
  const tokens = Number(amount) / 10 ** decimals
  const pricePerTokenEth = Number(pricePerToken) / 1e18
  const totalEth = tokens * pricePerTokenEth

  return {
    totalTokens: tokens.toLocaleString(undefined, {
      maximumFractionDigits: decimals,
    }),
    totalETH: totalEth.toFixed(6),
  }
}

export function groupCreditsByHolder(
  credits: CreditMintEvent[],
): Record<string, CreditMintEvent[]> {
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
} {
  const received = transfers.filter(
    (t) =>
      t.to.toLowerCase() === userAddress.toLowerCase() &&
      t.from !== "0x0000000000000000000000000000000000000000",
  )
  const sent = transfers.filter(
    (t) =>
      t.from.toLowerCase() === userAddress.toLowerCase() &&
      t.to !== "0x0000000000000000000000000000000000000000",
  )
  return { received, sent }
}

export function calculateTotalVolume(
  transfers: TransferEvent[],
  decimals = 6,
): number {
  return transfers.reduce(
    (total, transfer) => total + Number(transfer.value) / 10 ** decimals,
    0,
  )
}
