import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { parseEther, formatEther, Hash, zeroAddress } from 'viem';
import { useAccount, useChainId, usePublicClient, useBalance } from 'wagmi';
import { useBuilderContract } from '../hooks/useBuilderContract';
import { useMORToken } from '../hooks/useMORToken';
import { handleContractError } from '../utils/contractErrors';
import { SUPPORTED_CHAINS, isNetworkSupported } from '../utils/networkSwitching';
import { BuilderPoolCreationParams } from '../contracts/types/contracts';

interface BuilderPoolFormData {
    name: string;
    initialStake: string;
    rewardSplit: string;
    lockPeriod: string;
}

export function BuilderPoolCreation() {
    const chainId = useChainId();
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const [isLoading, setIsLoading] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [allowance, setAllowance] = useState<bigint>(BigInt(0));
    
    // Get the builder contract
    const { contract: builderContract } = useBuilderContract(chainId || SUPPORTED_CHAINS.ARBITRUM);
    
    // Get the MOR token contract
    const { tokenContract, approve, getAllowance } = useMORToken(chainId || SUPPORTED_CHAINS.ARBITRUM);
    
    // Get MOR token balance
    const { data: morBalance } = useBalance({
        address: address as `0x${string}`,
        token: tokenContract?.address
    });

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm<BuilderPoolFormData>();

    // Watch the initial stake input to compare with allowance
    const watchedInitialStake = watch('initialStake', '0');
    const initialStakeBigInt = parseEther(watchedInitialStake || '0');
    
    // Check if we have enough allowance
    const hasEnoughAllowance = allowance >= initialStakeBigInt;
    
    // Get the current allowance
    useEffect(() => {
        const fetchAllowance = async () => {
            if (!address || !builderContract?.address || !isConnected) return;
            
            try {
                const currentAllowance = await getAllowance(
                    address as `0x${string}`, 
                    builderContract.address
                );
                setAllowance(currentAllowance);
            } catch (err) {
                console.error('Error fetching allowance:', err);
            }
        };
        
        fetchAllowance();
    }, [address, builderContract?.address, isConnected, getAllowance, isApproving]);

    // Handle token approval
    const handleApprove = async () => {
        if (!tokenContract || !builderContract?.address || !address) {
            setError('Token contract or builder contract not available');
            return;
        }

        try {
            setIsApproving(true);
            setError(null);
            
            const amount = parseEther(watchedInitialStake || '0');
            const tx = await approve(
                builderContract.address, 
                amount
            );
            
            // Wait for confirmation
            if (publicClient) {
                await publicClient.waitForTransactionReceipt({ hash: tx });
            }
            
            // Update allowance
            const newAllowance = await getAllowance(
                address as `0x${string}`, 
                builderContract.address
            );
            setAllowance(newAllowance);
            
        } catch (err: unknown) {
            const contractError = handleContractError(err as Error);
            setError(`Approval failed: ${contractError.message}`);
        } finally {
            setIsApproving(false);
        }
    };

    const onSubmit = async (data: BuilderPoolFormData) => {
        if (!builderContract || !chainId || !isNetworkSupported(chainId) || !address || !publicClient) {
            setError('Please connect to a supported network');
            return;
        }

        // Check allowance first
        if (!hasEnoughAllowance) {
            setError('Please approve MOR tokens first');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            setSuccess(false);

            const params = [
                data.name,
                parseEther(data.initialStake),
                BigInt(parseInt(data.lockPeriod) * 86400), // Convert days to seconds
                BigInt(parseInt(data.rewardSplit))
            ] as const;

            const hash = await builderContract.write.createBuilderPool(params, {
                account: address as `0x${string}`,
                chain: publicClient.chain
            });

            // Wait for transaction confirmation
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            
            if (receipt.status === 'success') {
                setSuccess(true);
                reset();
            } else {
                setError('Transaction failed');
            }
        } catch (err: unknown) {
            const contractError = handleContractError(err as Error);
            setError(contractError.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isConnected) {
        return (
            <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
                <p className="text-gray-600 dark:text-gray-300">Connect your wallet to create a builder pool</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Create Builder Pool</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 rounded-md">
                    Builder pool created successfully!
                </div>
            )}

            {/* MOR Balance Display */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Your MOR Balance</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {morBalance 
                        ? `${parseFloat(formatEther(morBalance.value)).toFixed(2)} MOR` 
                        : 'Loading...'}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Pool Name
                    </label>
                    <input
                        type="text"
                        {...register('name', { required: 'Pool name is required' })}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Initial Stake (MOR)
                    </label>
                    <input
                        type="number"
                        step="0.000000000000000001"
                        {...register('initialStake', {
                            required: 'Initial stake is required',
                            min: { value: 0, message: 'Initial stake must be positive' }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {errors.initialStake && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.initialStake.message}</p>
                    )}
                    
                    {/* Token approval section */}
                    {watchedInitialStake && parseFloat(watchedInitialStake) > 0 && !hasEnoughAllowance && (
                        <div className="mt-2">
                            <button
                                type="button"
                                onClick={handleApprove}
                                disabled={isApproving}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {isApproving ? 'Approving...' : 'Approve MOR Tokens'}
                            </button>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                You need to approve MOR tokens before creating a pool
                            </p>
                        </div>
                    )}
                    
                    {hasEnoughAllowance && (
                        <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                            ✓ Tokens approved
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Lock Period (Days)
                    </label>
                    <input
                        type="number"
                        {...register('lockPeriod', {
                            required: 'Lock period is required',
                            min: { value: 1, message: 'Lock period must be at least 1 day' }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {errors.lockPeriod && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lockPeriod.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Reward Split (%)
                    </label>
                    <input
                        type="number"
                        {...register('rewardSplit', {
                            required: 'Reward split is required',
                            min: { value: 0, message: 'Reward split must be between 0 and 100' },
                            max: { value: 100, message: 'Reward split must be between 0 and 100' }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {errors.rewardSplit && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.rewardSplit.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading || isApproving || !hasEnoughAllowance}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isLoading ? 'Creating...' : 'Create Pool'}
                </button>
            </form>
        </div>
    );
} 