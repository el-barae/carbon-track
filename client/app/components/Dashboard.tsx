'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Leaf, Users, DollarSign, Activity } from 'lucide-react'
import { useAccount, useBalance } from 'wagmi'
import CarbonFootprintChart from './CarbonFootprintChart'
import RecentTransactions from './RecentTransactions'
import CreditPortfolio from './CreditPortfolio'
import WalletInfo from './WalletInfo'
import { ConnectButton } from '@rainbow-me/rainbowkit'


interface DashboardStats {
  totalCredits: number
  carbonFootprint: number
  offsetCredits: number
  totalValue: number
}

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  
  const [stats, setStats] = useState<DashboardStats>({
    totalCredits: 0,
    carbonFootprint: 0,
    offsetCredits: 0,
    totalValue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isConnected && address) {
      // Charger les données spécifiques à l'utilisateur
      loadUserData(address)
    } else {
      // Données par défaut pour les utilisateurs non connectés
      setTimeout(() => {
        setStats({
          totalCredits: 0,
          carbonFootprint: 0,
          offsetCredits: 0,
          totalValue: 0
        })
        setLoading(false)
      }, 1000)
    }
  }, [isConnected, address])

  const loadUserData = async (userAddress: string) => {
    try {
      setLoading(true)
      // Appel à votre API pour récupérer les données utilisateur
      const response = await fetch(`/api/user/${userAddress}`)
      if (response.ok) {
        const userData = await response.json()
        setStats({
          totalCredits: userData.totalCredits || 150.5,
          carbonFootprint: userData.footprint || 12.3,
          offsetCredits: userData.offsetCredits || 45.2,
          totalValue: userData.totalValue || 3750
        })
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      // Données par défaut en cas d'erreur
      setStats({
        totalCredits: 150.5,
        carbonFootprint: 12.3,
        offsetCredits: 45.2,
        totalValue: 3750
      })
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, title, value, change, color }: any) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-1 text-sm ${
              change.positive ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {change.value}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <Leaf className="h-20 w-20 text-primary-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to CarbonTrack</h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect your wallet to start tracking and offsetting your carbon footprint
        </p>
        <div className="max-w-md mx-auto">
          <ConnectButton />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Carbon Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your carbon footprint and manage credits</p>
        </div>
        <WalletInfo />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Leaf}
          title="Total Credits"
          value={`${stats.totalCredits} CO2`}
          change={{ positive: true, value: '+12%' }}
          color="bg-green-500"
        />
        <StatCard
          icon={Activity}
          title="Carbon Footprint"
          value={`${stats.carbonFootprint}t CO2`}
          change={{ positive: false, value: '-5%' }}
          color="bg-red-500"
        />
        <StatCard
          icon={Users}
          title="Offset Credits"
          value={`${stats.offsetCredits} CO2`}
          change={{ positive: true, value: '+8%' }}
          color="bg-blue-500"
        />
        <StatCard
          icon={DollarSign}
          title="Portfolio Value"
          value={`${stats.totalValue.toLocaleString()}`}
          change={{ positive: true, value: '+15%' }}
          color="bg-purple-500"
        />
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CarbonFootprintChart />
        </div>
        <div>
          <CreditPortfolio />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentTransactions />
    </div>
  )
}