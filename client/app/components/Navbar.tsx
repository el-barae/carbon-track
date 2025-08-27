"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Menu, X, Leaf, Wallet, TrendingUp, FileText, Settings, Plus } from "lucide-react"

interface NavbarProps {
  address?: string
  onConnectWallet?: () => void
}

export default function Navbar({ address, onConnectWallet }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const navItems = [
    { name: "Create Listing", icon: Plus, href: "#create-listing" },
    { name: "Marketplace", icon: TrendingUp, href: "#marketplace" },
    { name: "Portfolio", icon: Wallet, href: "#credits" },
    { name: "Transactions", icon: FileText, href: "#transactions" },
    { name: "Admin", icon: Settings, href: "#admin" },
  ]

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-xl">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CarbonTrack</h1>
              <p className="text-xs text-gray-500">Carbon Credit DApp</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </button>
            ))}
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center gap-4">
            {mounted && address ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">{formatAddress(address)}</span>
                </div>
                <div className="sm:hidden">
                  <div className="w-8 h-8 bg-green-100 border-2 border-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            ) : (
              <Button onClick={onConnectWallet} className="bg-green-600 hover:bg-green-700 text-white font-semibold">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 w-full text-left"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
