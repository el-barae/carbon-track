'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { Coins, Recycle, Plus } from 'lucide-react'
import { useContract, useContractRead } from '../hooks/useContract'

export default function CreditActions() {
  const { address } = useAccount()
  const { balance, symbol } = useContractRead(address)
  const { mintCredits, retireCredits, isPending, isConfirming, isSuccess, error } = useContract()
  
  const [mintForm, setMintForm] = useState({
    amount: '',
    projectId: '',
    vintage: '2024',
    certifier: 'Verra'
  })
  
  const [retireForm, setRetireForm] = useState({
    amount: '',
    reason: ''
  })

  const [activeAction, setActiveAction] = useState<'mint' | 'retire' | null>(null)

  const handleMint = () => {
    if (!address || !mintForm.amount || !mintForm.projectId) return
    
    const amount = parseEther(mintForm.amount)
    mintCredits(
      address,
      amount,
      mintForm.projectId,
      mintForm.vintage,
      mintForm.certifier
    )
  }

  const handleRetire = () => {
    if (!retireForm.amount || !retireForm.reason) return
    
    const amount = parseEther(retireForm.amount)
    retireCredits(amount, retireForm.reason)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Carbon Credit Actions</h3>
        <div className="text-right">
          <p className="text-sm text-gray-600">Your Balance</p>
          <p className="text-xl font-bold text-green-600">
            {balance ? formatEther(balance) : '0'} {symbol || 'CO2'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setActiveAction(activeAction === 'mint' ? null : 'mint')}
          className={`flex items-center justify-center space-x-2 p-4 rounded-lg border-2 transition-all ${
            activeAction === 'mint'
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-200 hover:border-green-300 text-gray-700'
          }`}
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">Mint Credits</span>
        </button>
        
        <button
          onClick={() => setActiveAction(activeAction === 'retire' ? null : 'retire')}
          className={`flex items-center justify-center space-x-2 p-4 rounded-lg border-2 transition-all ${
            activeAction === 'retire'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-blue-300 text-gray-700'
          }`}
        >
          <Recycle className="h-5 w-5" />
          <span className="font-medium">Retire Credits</span>
        </button>
      </div>

      {/* Transaction Status */}
      {(isPending || isConfirming || isSuccess || error) && (
        <div className="mb-4">
          {isPending && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800">Transaction pending confirmation...</p>
            </div>
          )}
          {isConfirming && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800">Transaction confirming on blockchain...</p>
            </div>
          )}
          {isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800">Transaction successful!</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800">Error: {error.message}</p>
            </div>
          )}
        </div>
      )}

      {/* Mint Form */}
      {activeAction === 'mint' && (
        <div className="border border-green-200 rounded-lg p-4 bg-green-50">
          <h4 className="font-medium text-green-800 mb-4">Mint New Credits</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (tCO2)
                </label>
                <input
                  type="number"
                  value={mintForm.amount}
                  onChange={(e) => setMintForm({...mintForm, amount: e.target.value})}
                  className="input"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project ID
                </label>
                <input
                  type="text"
                  value={mintForm.projectId}
                  onChange={(e) => setMintForm({...mintForm, projectId: e.target.value})}
                  className="input"
                  placeholder="PROJ-001"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vintage
                </label>
                <select
                  value={mintForm.vintage}
                  onChange={(e) => setMintForm({...mintForm, vintage: e.target.value})}
                  className="input"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certifier
                </label>
                <select
                  value={mintForm.certifier}
                  onChange={(e) => setMintForm({...mintForm, certifier: e.target.value})}
                  className="input"
                >
                  <option value="Verra">Verra</option>
                  <option value="Gold Standard">Gold Standard</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={handleMint}
              disabled={isPending || isConfirming || !mintForm.amount || !mintForm.projectId}
              className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending || isConfirming ? 'Processing...' : 'Mint Credits'}
            </button>
          </div>
        </div>
      )}

      {/* Retire Form */}
      {activeAction === 'retire' && (
        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
          <h4 className="font-medium text-blue-800 mb-4">Retire Credits</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount to Retire (tCO2)
              </label>
              <input
                type="number"
                value={retireForm.amount}
                onChange={(e) => setRetireForm({...retireForm, amount: e.target.value})}
                className="input"
                placeholder="50"
                max={balance ? formatEther(balance) : undefined}
              />
              <p className="text-xs text-gray-600 mt-1">
                Available: {balance ? formatEther(balance) : '0'} {symbol || 'CO2'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Retirement Reason
              </label>
              <textarea
                value={retireForm.reason}
                onChange={(e) => setRetireForm({...retireForm, reason: e.target.value})}
                className="input h-20 resize-none"
                placeholder="Offsetting annual carbon footprint..."
              />
            </div>
            
            <button
              onClick={handleRetire}
              disabled={isPending || isConfirming || !retireForm.amount || !retireForm.reason}
              className="w-full btn bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending || isConfirming ? 'Processing...' : 'Retire Credits'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
