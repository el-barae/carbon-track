import CO2KEN from '../../abi/CO2ken.json'

// Assure-toi d'avoir NEXT_PUBLIC_CONTRACT_ADDRESS dans .env.local
export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x32179495c41341e09BC056F847437916E3B7d48b') as `0x${string}`

export const contractConfig = {
  address: CONTRACT_ADDRESS,
  abi: CO2KEN as any,
}