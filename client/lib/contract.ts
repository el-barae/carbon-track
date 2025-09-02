import CO2KEN from "../abi/CO2ken.json"

// Assure-toi d'avoir NEXT_PUBLIC_CONTRACT_ADDRESS dans .env.local
export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS 
  ||"0xdD3346b7CcDAa5D608131d349349Dc318FD8DE36"
) as `0x${string}`

export const contractConfig = {
  address: CONTRACT_ADDRESS,
  abi: CO2KEN as any,
}
