import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Providers } from './providers';
import './globals.css';
import { icons } from 'lucide-react';

export const metadata = {
  icons: "/logo.png",
  title: "CarbonTrack",
  description: "Carbon credit DApp (API + CO2ken smart contract)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body className="min-h-screen bg-gray-50 font-sans" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
