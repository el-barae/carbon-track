import CO2KEN from "../../abi/CO2ken.json"

// Assure-toi d'avoir NEXT_PUBLIC_CONTRACT_ADDRESS dans .env.local
export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x1FA4f78a5c73970A20D4A81A77523e33E359f2eE") as `0x${string}`

export const contractConfig = {
  address: CONTRACT_ADDRESS,
  abi: CO2KEN as any,
}
