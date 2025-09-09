"use client"
import WalletConnection from "./ui/WalletConnection"
import { useState } from "react"
import { Menu, X, Leaf, Wallet, TrendingUp, FileText, Settings} from "lucide-react"

interface NavbarProps {
  address?: string
  activeSection?: string
  onSectionChange?: (section: string) => void
  onConnectWallet?: () => void
}

export default function Navbar({
  address,
  activeSection = "portfolio",
  onSectionChange,
  onConnectWallet,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const navItems = [
    { name: "Portfolio", icon: Wallet, section: "portfolio" },
    { name: "Marketplace", icon: TrendingUp, section: "marketplace" },
    // { name: "Create Listing", icon: Plus, section: "create-listing" },
    { name: "Transactions", icon: FileText, section: "transactions" },
    { name: "Administration", icon: Settings, section: "admin" },
  ]

  const handleNavClick = (section: string) => {
    onSectionChange?.(section)
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
                onClick={() => handleNavClick(item.section)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeSection === item.section
                    ? "text-green-600 bg-green-50 border border-green-200"
                    : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </button>
            ))}
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center gap-4">
            <WalletConnection address={address} onConnectWallet={onConnectWallet} formatAddress={formatAddress} />


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
                  onClick={() => handleNavClick(item.section)}
                  className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full text-left ${
                    activeSection === item.section
                      ? "text-green-600 bg-green-50 border border-green-200"
                      : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                  }`}
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
