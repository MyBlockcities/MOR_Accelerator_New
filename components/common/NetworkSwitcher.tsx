import React, { useState, useEffect } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { arbitrum, base, arbitrumSepolia, baseGoerli } from 'wagmi/chains';
import { SUPPORTED_CHAINS, getNetworkConfig } from '../../utils/networkSwitching';

// Define the networks we support
const NETWORKS = [
  {
    id: arbitrum.id,
    name: arbitrum.name,
    icon: '/images/networks/arbitrum.svg',
    isTestnet: false
  },
  {
    id: base.id,
    name: base.name,
    icon: '/images/networks/base.svg',
    isTestnet: false
  },
  {
    id: arbitrumSepolia.id,
    name: arbitrumSepolia.name,
    icon: '/images/networks/arbitrum.svg',
    isTestnet: true
  },
  {
    id: baseGoerli.id,
    name: baseGoerli.name,
    icon: '/images/networks/base.svg',
    isTestnet: true
  }
];

// Check if we're in testnet mode
const isTestnetMode = 
  process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ||
  process.env.ENABLE_TESTNET === 'true';

export const NetworkSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  
  // Filter networks based on testnet mode
  const availableNetworks = NETWORKS.filter(network => 
    isTestnetMode || !network.isTestnet
  );
  
  // Get current network info
  const currentNetwork = availableNetworks.find(network => network.id === chainId) || 
    {
      id: chainId || 0,
      name: 'Unknown Network',
      icon: '/images/networks/unknown.svg',
      isTestnet: false
    };
  
  // Store preferred network in local storage
  useEffect(() => {
    if (chainId && mounted) {
      localStorage.setItem('preferredNetworkId', chainId.toString());
    }
  }, [chainId, mounted]);
  
  // Check for preferred network on mount
  useEffect(() => {
    setMounted(true);
    const preferredNetworkId = localStorage.getItem('preferredNetworkId');
    
    if (preferredNetworkId && parseInt(preferredNetworkId) !== chainId && isConnected) {
      const networkId = parseInt(preferredNetworkId);
      const networkExists = NETWORKS.some(network => network.id === networkId);
      
      if (networkExists) {
        switchChain({ chainId: networkId });
      }
    }
  }, [isConnected, chainId, switchChain]);
  
  if (!mounted) return null;
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 py-1.5 px-3 rounded-lg transition-all duration-200
          ${currentNetwork.isTestnet 
            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-600/30'
            : 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white'
          }`}
      >
        <img 
          src={currentNetwork.icon}
          alt={currentNetwork.name}
          className="w-4 h-4 rounded-full"
          onError={(e) => {
            e.currentTarget.src = '/images/networks/unknown.svg';
          }}
        />
        <span className="text-sm font-medium">{currentNetwork.name}</span>
        {currentNetwork.isTestnet && (
          <span className="ml-1 text-xs font-medium bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100 px-1 py-0.5 rounded">
            TEST
          </span>
        )}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-40 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700">
          <div className="p-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            Switch Network
          </div>
          <div className="py-1">
            {availableNetworks.map((network) => (
              <button
                key={network.id}
                onClick={() => {
                  if (network.id !== chainId) {
                    switchChain({ chainId: network.id });
                  }
                  setIsOpen(false);
                }}
                disabled={isPending || network.id === chainId}
                className={`w-full flex items-center px-4 py-2 text-sm ${
                  network.id === chainId
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <img 
                  src={network.icon}
                  alt={network.name}
                  className="w-4 h-4 mr-2 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = '/images/networks/unknown.svg';
                  }}
                />
                <span>{network.name}</span>
                {network.isTestnet && (
                  <span className="ml-1 text-xs font-medium bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100 px-1 py-0.5 rounded">
                    TEST
                  </span>
                )}
                {network.id === chainId && (
                  <svg className="ml-auto h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkSwitcher; 