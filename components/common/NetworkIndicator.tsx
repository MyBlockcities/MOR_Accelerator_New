import React, { useState, useEffect } from 'react';
import { useAccount, useChainId, useConfig } from 'wagmi';
import { SUPPORTED_CHAINS, isNetworkSupported } from '../../utils/networkSwitching';

export const NetworkIndicator = () => {
    const [mounted, setMounted] = useState(false);
    const chainId = useChainId();
    const { isConnected } = useAccount();
    const config = useConfig();
    
    // Check if we're in testnet mode based on environment variable or chain
    const isTestnet = 
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ||
        process.env.ENABLE_TESTNET === 'true' ||
        (chainId && (
            chainId === 421614 || // Arbitrum Sepolia
            chainId === 84531  // Base Goerli
        ));

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // Return null on server-side
    }

    if (!isConnected) {
        return (
            <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Not Connected</span>
            </div>
        );
    }

    const isSupported = isNetworkSupported(chainId || 0);
    const chain = config.chains.find(c => c.id === chainId);
    const networkName = chain?.name || 'Unknown Network';
    
    return (
        <div className={`
            px-3 py-1.5 rounded-lg flex items-center space-x-2 
            ${isTestnet 
                ? 'bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-600/30' 
                : isSupported 
                    ? 'bg-green-100 dark:bg-green-900/20' 
                    : 'bg-red-100 dark:bg-red-900/20'
            }
        `}>
            <div className={`w-2.5 h-2.5 rounded-full ${
                isTestnet 
                    ? 'bg-yellow-500 dark:bg-yellow-400' 
                    : isSupported 
                        ? 'bg-green-500 dark:bg-green-400' 
                        : 'bg-red-500 dark:bg-red-400'
            }`} />
            <span className={`text-sm ${
                isTestnet 
                    ? 'text-yellow-700 dark:text-yellow-300' 
                    : isSupported 
                        ? 'text-green-700 dark:text-green-300' 
                        : 'text-red-700 dark:text-red-300'
            }`}>
                {networkName}
            </span>
            
            {/* Add testnet badge */}
            {isTestnet && (
                <span className="text-xs font-medium bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100 px-1.5 py-0.5 rounded">
                    TESTNET
                </span>
            )}
            
            {!isSupported && (
                <span className="text-xs font-medium bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-100 px-1.5 py-0.5 rounded">
                    UNSUPPORTED
                </span>
            )}
        </div>
    );
};

export default NetworkIndicator; 