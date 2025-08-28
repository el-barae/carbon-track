import CO2KEN from "../abi/CO2ken.json"

// Assure-toi d'avoir NEXT_PUBLIC_CONTRACT_ADDRESS dans .env.local
export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x8bD854B05ed0Ba4289a9efAdA418488697fF2aaa") as `0x${string}`

export const contractConfig = {
  address: CONTRACT_ADDRESS,
  abi: CO2KEN as any,
}
