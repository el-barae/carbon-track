'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'

// ABI de votre contrat SimpleCO2ken
const CO2_CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "string", "name": "projectId", "type": "string"},
      {"internalType": "string", "name": "vintage", "type": "string"},
      {"internalType": "string", "name": "certifier", "type": "string"}
    ],
    "name": "mintCredits",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "string", "name": "reason", "type": "string"}
    ],
    "name": "retireCredits",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

const CONTRACT_ADDRESS = '0x...' // Remplacez par l'adresse de votre contrat déployé

export function useContract() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const mintCredits = (
    to: string,
    amount: bigint,
    projectId: string,
    vintage: string,
    certifier: string
  ) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CO2_CONTRACT_ABI,
      functionName: 'mintCredits',
      args: [to as `0x${string}`, amount, projectId, vintage, certifier],
    })
  }

  const retireCredits = (amount: bigint, reason: string) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CO2_CONTRACT_ABI,
      functionName: 'retireCredits',
      args: [amount, reason],
    })
  }

  return {
    mintCredits,
    retireCredits,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash
  }
}

// Hook pour lire les données du contrat
export function useContractRead(address: `0x${string}` | undefined) {
  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CO2_CONTRACT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  const { data: name } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CO2_CONTRACT_ABI,
    functionName: 'name',
  })

  const { data: symbol } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CO2_CONTRACT_ABI,
    functionName: 'symbol',
  })

  return {
    balance,
    name,
    symbol
  }
}