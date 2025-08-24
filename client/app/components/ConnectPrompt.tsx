'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Leaf, Shield, Coins, TrendingUp } from 'lucide-react'

export default function ConnectPrompt() {
  return (
    <div className="text-center py-20">
      <Leaf className="h-20 w-20 text-primary-500 mx-auto mb-6" />
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to CarbonTrack</h1>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
        The first blockchain-based platform for transparent carbon credit tokenization and trading
      </p>
      
      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Verified Credits</h3>
          <p className="text-gray-600 text-sm">
            All carbon credits are verified by recognized certifiers like Verra and Gold Standard
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Coins className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Tokenized Trading</h3>
          <p className="text-gray-600 text-sm">
            Trade fractional carbon credits as ERC-20 tokens on the blockchain
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Track Impact</h3>
          <p className="text-gray-600 text-sm">
            Monitor your carbon footprint and offset impact in real-time
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-lg border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get Started</h2>
        <p className="text-gray-600 mb-6">
          Connect your wallet to access the dashboard and start trading carbon credits
        </p>
        <ConnectButton />
      </div>
    </div>
  )
}