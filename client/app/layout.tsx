import './globals.css'
import { Providers } from './providers'


export const metadata = {
title: 'CarbonTrack',
description: 'Carbon credit DApp (API + CO2ken smart contract)',
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body className="min-h-screen bg-gray-50">
<Providers>
{children}
</Providers>
</body>
</html>
)
}