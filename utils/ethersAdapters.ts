/**
 * Ethers.js to Viem Adapters
 * 
 * These adapters bridge wagmi v2/viem with ethers.js v6 for backward compatibility
 * This solves the fundamental incompatibility between wagmi v2 and ethers.js
 */

import { useWalletClient, usePublicClient } from 'wagmi'
import { BrowserProvider, JsonRpcProvider } from 'ethers'
import type { PublicClient, WalletClient } from 'viem'
import { useMemo } from 'react'

/**
 * Converts a viem PublicClient to an ethers.js Provider
 * Use this to replace the deprecated useProvider() hook
 */
export function useEthersProvider() {
  const publicClient = usePublicClient()
  
  return useMemo(() => {
    if (!publicClient) return null
    
    // Create a JsonRpcProvider from the viem transport
    return new BrowserProvider(publicClient.transport as any)
  }, [publicClient])
}

/**
 * Converts a viem WalletClient to an ethers.js Signer
 * Use this to replace the deprecated useSigner() hook
 */
export function useEthersSigner() {
  const { data: walletClient } = useWalletClient()
  
  return useMemo(() => {
    if (!walletClient) return null
    
    // Create a BrowserProvider and get the signer
    const provider = new BrowserProvider(walletClient.transport as any)
    return provider.getSigner()
  }, [walletClient])
}

/**
 * Direct conversion functions for when you already have viem clients
 */
export function publicClientToProvider(publicClient: PublicClient) {
  return new BrowserProvider(publicClient.transport as any)
}

export function walletClientToSigner(walletClient: WalletClient) {
  const provider = new BrowserProvider(walletClient.transport as any)
  return provider.getSigner()
}

/**
 * Utility to get contract instance with ethers.js patterns
 * This maintains compatibility with existing contract interaction code
 */
export function useEthersContract(address: string, abi: any) {
  const provider = useEthersProvider()
  const signer = useEthersSigner()
  
  return useMemo(() => {
    if (!address || !abi) return null
    
    // Return contract with signer if available, otherwise with provider
    const ethers = require('ethers')
    return new ethers.Contract(address, abi, signer || provider)
  }, [address, abi, signer, provider])
}

/**
 * Migration helpers for common patterns
 */
export const EthersAdapters = {
  // For components that used useProvider()
  useProvider: useEthersProvider,
  
  // For components that used useSigner()
  useSigner: useEthersSigner,
  
  // For contract instances
  useContract: useEthersContract,
  
  // Direct conversions
  publicClientToProvider,
  walletClientToSigner
}

export default EthersAdapters