import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import { Providers } from './providers' 

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonTrack - Carbon Credit DApp',
  description: 'Transparent blockchain-based carbon credit platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 👇 Tout ton app DOIT être dans Providers */}
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
