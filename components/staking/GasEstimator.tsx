import React from 'react';

interface GasEstimatorProps {
    contractFunction?: any;
    args?: any[];
}

export function GasEstimator({ contractFunction, args }: GasEstimatorProps) {
    // TODO: Implement proper gas estimation with correct types
    return (
        <div className="text-sm text-gray-500 p-2 bg-gray-100 rounded">
            Gas estimation temporarily disabled - Needs type fixes for wagmi v2
        </div>
    );
}

/* Original implementation - commented out until type issues are resolved
import React, { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { formatEther } from 'viem';
import { StakingContractWriteMethods } from '../../types/contracts';

interface GasEstimatorProps {
    contractFunction: keyof StakingContractWriteMethods;
    args: any[];
}

export function GasEstimator({ contractFunction, args }: GasEstimatorProps) {
    const [estimatedGas, setEstimatedGas] = useState<bigint | null>(null);
    const [gasPrice, setGasPrice] = useState<bigint | null>(null);
    const [error, setError] = useState<string | null>(null);
    const publicClient = usePublicClient();

    useEffect(() => {
        const estimateGas = async () => {
            try {
                setError(null);
                const [gasEstimate, currentGasPrice] = await Promise.all([
                    publicClient.estimateContractGas({
                        address: args[0],
                        abi: [], // This should be filled with the actual ABI
                        functionName: contractFunction,
                        args: args.slice(1)
                    }),
                    publicClient.getGasPrice()
                ]);

                setEstimatedGas(gasEstimate);
                setGasPrice(currentGasPrice);
            } catch (err) {
                setError('Failed to estimate gas');
                console.error('Gas estimation error:', err);
            }
        };

        if (contractFunction && args && publicClient) {
            estimateGas();
        }
    }, [contractFunction, args, publicClient]);

    if (error) {
        return <div className="text-red-500 text-sm">Gas estimation failed</div>;
    }

    if (!estimatedGas || !gasPrice) {
        return <div className="text-gray-500 text-sm">Estimating gas...</div>;
    }

    const totalCostWei = estimatedGas * gasPrice;
    const totalCostEth = formatEther(totalCostWei);

    return (
        <div className="text-sm text-gray-600 space-y-1">
            <div>Estimated Gas: {estimatedGas.toString()}</div>
            <div>Gas Price: {formatEther(gasPrice)} ETH</div>
            <div>Total Cost: {totalCostEth} ETH</div>
        </div>
    );
}
*/