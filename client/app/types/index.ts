export interface Credit {
  id: number
  projectId: string
  vintage: string
  certifier: string
  amount: number
  owner: string
  createdAt: string
}

export interface User {
  id: number
  wallet: string
  footprint: number
  createdAt: string
  credits?: Credit[]
}

export interface CarbonFootprintData {
  wallet: string
  footprint: number
  recommendation: string
}

export interface Transaction {
  id: number
  type: 'buy' | 'sell' | 'retire'
  amount: number
  project: string
  price: string
  date: string
  status: 'completed' | 'pending' | 'failed'
}