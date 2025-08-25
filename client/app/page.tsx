'use client'

import { useEffect, useState } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { contractConfig } from './lib/contract'
import {
  fetchCredits,
  fetchUserByWallet,
  fetchTransactionsByWallet,
  calculateFootprint,
} from './lib/api'

const fmt = (n?: number | string | bigint, d = 6) => {
  if (n === undefined) return '0'
  const v = typeof n === 'bigint' ? Number(n) : Number(n)
  return (v / 10 ** d).toLocaleString(undefined, { maximumFractionDigits: d })
}

export default function Page() {
  const { address } = useAccount()

  const { data: balance } = useReadContract({
    ...contractConfig,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  }) as { data?: bigint }

  const { data: decimals } = useReadContract({
    ...contractConfig,
    functionName: 'decimals',
  }) as { data?: number }

  const { data: nextListingId } = useReadContract({
    ...contractConfig,
    functionName: 'nextListingId',
  }) as { data?: bigint }

  const { writeContract, isPending } = useWriteContract()

  const [credits, setCredits] = useState<any[]>([])
  const [user, setUser] = useState<any | null>(null)
  const [txs, setTxs] = useState<any[]>([])
  const [energy, setEnergy] = useState('')
  const [carKm, setCarKm] = useState('')
  const [planeKm, setPlaneKm] = useState('')
  const [footprint, setFootprint] = useState<any | null>(null)

  const d = decimals ?? 6

useEffect(() => {
  fetchCredits()
    .then(setCredits)
    .catch(() => {})
}, [])

useEffect(() => {
  if (!address) return
  fetchUserByWallet(address)
    .then(setUser)
    .catch(() => setUser(null))

  fetchTransactionsByWallet(address)
    .then(setTxs)
    .catch(() => setTxs([]))
}, [address])


  const [listings, setListings] = useState<any[]>([])
  useEffect(() => {
    const w: any = (window as any).wagmi
    const load = async () => {
      if (!w?.readContract || typeof nextListingId === 'undefined') return
      const end = Number(nextListingId)
      const start = Math.max(0, end - 20)
      const rows = await Promise.all(
        Array.from({ length: end - start }, (_, i) => w.readContract({
          ...contractConfig,
          functionName: 'listings',
          args: [BigInt(start + i)],
        }).catch(() => null))
      )
      const active = rows.filter(Boolean).filter((r: any) => r.active)
      setListings(active.reverse())
    }
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [nextListingId])

  const calc = async () => {
  if (!address) return
  const data = await calculateFootprint({
    wallet: address,
    energyConsumption: Number(energy || 0),
    travel: { car: Number(carKm || 0), plane: Number(planeKm || 0) },
  })
  setFootprint(data)
}


  const [amt, setAmt] = useState('')
  const [price, setPrice] = useState('') 

  const createListing = async () => {
    if (!amt || !price) return
    const amount = BigInt(Math.floor(Number(amt) * 10 ** d))
    const pricePerTokenWei = BigInt(Math.floor(Number(price) * 1e18))
    await writeContract({
      ...contractConfig,
      functionName: 'createListing',
      args: [amount, pricePerTokenWei],
    })
  }

  const buy = async (lst: any) => {
    const total = BigInt(lst.amount) * BigInt(lst.pricePerToken)
    await writeContract({
      ...contractConfig,
      functionName: 'buyListing',
      args: [lst.id],
      value: total,
    })
  }

  const cancel = async (id: bigint) => {
    await writeContract({ ...contractConfig, functionName: 'cancelListing', args: [id] })
  }

  return (
    <main className="max-w-6xl mx-auto p-4 space-y-6">
      <section className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-lg font-semibold mb-3">Wallet & Balance</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-gray-500">Address</div>
            <div className="font-mono break-all">{address || '—'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Balance</div>
            <div className="font-semibold">{fmt(balance, d)} SCO2</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Decimals</div>
            <div className="font-semibold">{d}</div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-lg font-semibold mb-3">Footprint calculator (API)</h2>
        <div className="grid md:grid-cols-3 gap-2">
          <input placeholder="Energy kWh" className="border rounded p-2" value={energy} onChange={e=>setEnergy(e.target.value)} />
          <input placeholder="Car km" className="border rounded p-2" value={carKm} onChange={e=>setCarKm(e.target.value)} />
          <input placeholder="Plane km" className="border rounded p-2" value={planeKm} onChange={e=>setPlaneKm(e.target.value)} />
        </div>
        <button onClick={calc} className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg">Calculate</button>
        {footprint && (
          <div className="mt-3 text-sm bg-green-50 border border-green-200 rounded p-3">
            <div>Wallet: {footprint.wallet}</div>
            <div>Footprint: <b>{Number(footprint.footprint).toFixed(3)}</b> tCO₂</div>
            <div className="text-green-700">{String(footprint.recommendation)}</div>
          </div>
        )}
      </section>

      <section className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-lg font-semibold mb-3">Create listing (on‑chain)</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Amount (SCO2)</label>
            <input className="border rounded p-2 w-full" value={amt} onChange={e=>setAmt(e.target.value)} placeholder="e.g. 12.5" />
          </div>
          <div>
            <label className="text-sm">Price per token (ETH)</label>
            <input className="border rounded p-2 w-full" value={price} onChange={e=>setPrice(e.target.value)} placeholder="e.g. 0.002" />
          </div>
        </div>
        <button onClick={createListing} disabled={isPending} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">
          {isPending ? 'Pending…' : 'Create listing'}
        </button>
      </section>

      <section className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-lg font-semibold mb-3">On‑chain listings (latest)</h2>
        {!listings.length ? (
          <div className="text-sm text-gray-500">No active listings found.</div>
        ) : (
          <ul className="divide-y">
            {listings.map((l:any) => (
              <li key={String(l.id)} className="py-3 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm">Listing #{String(l.id)}</div>
                  <div className="text-xs text-gray-500">Seller: {l.seller}</div>
                  <div className="text-xs">Amount: <b>{fmt(l.amount, d)} SCO2</b></div>
                  <div className="text-xs">Price: <b>{Number(l.pricePerToken)/1e18} ETH</b> per token</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => buy(l)} className="px-3 py-1 rounded bg-emerald-600 text-white">Buy</button>
                  {address && address.toLowerCase() === l.seller.toLowerCase() && (
                    <button onClick={() => cancel(l.id)} className="px-3 py-1 rounded bg-gray-200">Cancel</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-lg font-semibold mb-3">My credits (API)</h2>
        <div className="text-xs text-gray-500 mb-2">GET /user/:wallet</div>
        {!user ? (
          <div className="text-sm text-gray-500">No user record yet. Run the calculator to create one.</div>
        ) : (
          <>
            <div className="text-sm mb-2">Footprint: <b>{user.footprint ?? 0}</b> tCO₂</div>
            <ul className="divide-y">
              {(user.credits || []).map((c:any) => (
                <li key={c.id} className="py-2">
                  <div className="font-medium text-sm">{c.projectId} • {c.vintage} • {c.certifier}</div>
                  <div className="text-xs text-gray-500">Amount: {c.amount} — Owner: {c.owner}</div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-lg font-semibold mb-3">My transactions (API)</h2>
        <div className="text-xs text-gray-500 mb-2">GET /transactions/:wallet</div>
        {!txs.length ? (
          <div className="text-sm text-gray-500">No transactions yet.</div>
        ) : (
          <ul className="divide-y">
            {txs.map((t:any) => (
              <li key={t.id} className="py-2 text-sm">
                <div>Credit #{t.creditId} — Amount: {t.amount}</div>
                <div className="text-xs text-gray-500">Seller: {t.seller} → Buyer: {t.buyer} • {new Date(t.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}