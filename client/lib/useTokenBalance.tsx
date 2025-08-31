import { useEffect, useState } from "react"
import { ethers } from "ethers"
import CO2KEN from "../abi/CO2ken.json"
import { CONTRACT_ADDRESS } from "./contract"

// provider (ici Metamask ou ton RPC public)
const provider = new ethers.BrowserProvider(window.ethereum)
const contract = new ethers.Contract(CONTRACT_ADDRESS, CO2KEN.abi, provider)

export function useTokenBalance(address?: string) {
  const [balance, setBalance] = useState<bigint | null>(null)
  const [decimals, setDecimals] = useState<number>(6)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!address) return
    setLoading(true)

    async function fetchBalance() {
      try {
        const [bal, dec] = await Promise.all([
          contract.balanceOf(address),
          contract.decimals()
        ])
        setBalance(bal)
        setDecimals(dec)
      } catch (err) {
        console.error("Error fetching balance:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
  }, [address])

  return { balance, decimals, loading }
}
