'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Leaf, Menu, X } from 'lucide-react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isConnected } = useAccount()

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">CarbonTrack</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium">
              Dashboard
            </Link>
            <Link href="/marketplace" className="text-gray-700 hover:text-primary-600 font-medium">
              Marketplace
            </Link>
            <Link href="/calculator" className="text-gray-700 hover:text-primary-600 font-medium">
              Calculator
            </Link>
            {isConnected && (
              <Link href="/admin" className="text-gray-700 hover:text-primary-600 font-medium">
                Admin
              </Link>
            )}
          </div>

          {/* Wallet Connection - RainbowKit */}
          <div className="hidden md:flex items-center space-x-4">
            <ConnectButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-4">
              <Link href="/" className="block text-gray-700 hover:text-primary-600 font-medium">
                Dashboard
              </Link>
              <Link href="/marketplace" className="block text-gray-700 hover:text-primary-600 font-medium">
                Marketplace
              </Link>
              <Link href="/calculator" className="block text-gray-700 hover:text-primary-600 font-medium">
                Calculator
              </Link>
              {isConnected && (
                <Link href="/admin" className="block text-gray-700 hover:text-primary-600 font-medium">
                  Admin
                </Link>
              )}
              <div className="pt-4">
                <ConnectButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
