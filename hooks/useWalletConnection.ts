// hooks/useWalletConnection.ts

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useEthersProvider, useEthersSigner } from '../utils/ethersAdapters';

/**
 * Modern wallet connection hook using wagmi v2 with ethers.js adapter compatibility
 * This replaces the legacy direct ethers.js integration
 */
export function useWalletConnection() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [error, setError] = useState<string | null>(null);
  
  // Get ethers.js compatible provider and signer for backward compatibility
  const provider = useEthersProvider();
  const signer = useEthersSigner();

  const connectWallet = async () => {
    try {
      setError(null);
      const connector = connectors[0]; // Use first available connector
      if (connector) {
        connect({ connector });
      } else {
        setError('No wallet connector available');
      }
    } catch (err) {
      setError('Failed to connect wallet');
      console.error(err);
    }
  };

  const disconnectWallet = () => {
    disconnect();
    setError(null);
  };

  // Return wagmi data with ethers.js compatibility
  return { 
    account: address || null, 
    isConnected,
    error, 
    connectWallet, 
    disconnectWallet,
    // Ethers.js compatibility
    provider,
    signer
  };
}