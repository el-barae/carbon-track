const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000"

export async function fetchCredits() {
  const res = await fetch(`${API_BASE}/credits`)
  return res.json()
}

export async function createCredit(data: any) {
  const res = await fetch(`${API_BASE}/credits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function fetchTransactions() {
  const res = await fetch(`${API_BASE}/transactions`)
  return res.json()
}

export async function fetchTransactionsByWallet(wallet: string) {
  const res = await fetch(`${API_BASE}/transactions/${wallet}`)
  return res.json()
}

export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/users`)
  return res.json()
}

export async function fetchUserByWallet(wallet: string) {
  const res = await fetch(`${API_BASE}/users/${wallet}`)
  return res.json()
}

export async function calculateFootprint(data: any) {
  const res = await fetch(`${API_BASE}/users/footprint/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}
