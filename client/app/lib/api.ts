import { Credit } from "../types"
import { CarbonFootprintData } from "../types"
import { User } from "../types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export async function fetchCredits(): Promise<Credit[]> {
  const response = await fetch(`${API_BASE_URL}/credits`)
  if (!response.ok) {
    throw new Error('Failed to fetch credits')
  }
  return response.json()
}

export async function calculateFootprint(data: {
  wallet: string
  energyConsumption: number
  travel: { car?: number; plane?: number }
}): Promise<CarbonFootprintData> {
  const response = await fetch(`${API_BASE_URL}/footprint/calculate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    throw new Error('Failed to calculate footprint')
  }
  
  return response.json()
}

export async function fetchUser(wallet: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/user/${wallet}`)
  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }
  return response.json()
}

export async function createCredit(creditData: {
  projectId: string
  vintage: string
  certifier: string
  amount: number
  owner: string
}): Promise<Credit> {
  const response = await fetch(`${API_BASE_URL}/credits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(creditData),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create credit')
  }
  
  return response.json()
}
