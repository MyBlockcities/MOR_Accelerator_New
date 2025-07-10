/**
 * Morpheus Staking Hook
 * 
 * React hook for interacting with Morpheus AI staking contracts
 * Integrates with official Distribution and Builder contracts
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAccount, useChainId, usePublicClient, useWalletClient } from 'wagmi';
import { Address, Hash } from 'viem';
import MorpheusStakingService, { StakeInfo, PoolInfo, BuilderPoolInfo } from '../services/MorpheusStakingService';

export interface UseMorpheusStakingReturn {
    // State
    isLoading: boolean;
    error: string | null;
    isConnected: boolean;
    currentChainId?: number;
    isStakingSupported: boolean;
    networkName: string;
    
    // Balances
    morBalance: bigint | null;
    morAllowance: bigint | null;
    
    // Distribution Pool Functions
    getMORBalance: () => Promise<bigint | null>;
    checkMORAllowance: () => Promise<bigint | null>;
    approveMOR: (amount: bigint) => Promise<Hash | null>;
    stakeToDistributionPool: (poolId: number, amount: bigint, lockPeriod?: bigint) => Promise<Hash | null>;
    getDistributionStakeInfo: (poolId: number) => Promise<StakeInfo | null>;
    getDistributionPoolInfo: (poolId: number) => Promise<PoolInfo | null>;
    claimDistributionRewards: (poolId: number) => Promise<Hash | null>;
    withdrawFromDistributionPool: (poolId: number, amount: bigint) => Promise<Hash | null>;
    getAvailableDistributionPools: () => Promise<PoolInfo[]>;
    
    // Builder Pool Functions  
    createBuilderPool: (name: string, initialDeposit: bigint, claimLockEnd: bigint) => Promise<Hash | null>;
    depositToBuilderPool: (poolId: string, amount: bigint) => Promise<Hash | null>;
    getBuilderPoolInfo: (poolId: string) => Promise<BuilderPoolInfo | null>;
    getBuilderStakeInfo: (poolId: string) => Promise<StakeInfo | null>;
    
    // Utility Functions
    formatMORAmount: (amount: bigint) => string;
    parseMORAmount: (amount: string) => bigint;
    clearError: () => void;
    refreshBalances: () => Promise<void>;
}

export function useMorpheusStaking(): UseMorpheusStakingReturn {
    const { address } = useAccount();
    const chainId = useChainId();
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [morBalance, setMorBalance] = useState<bigint | null>(null);
    const [morAllowance, setMorAllowance] = useState<bigint | null>(null);

    // Create staking service instance
    const stakingService = useMemo(() => {
        return publicClient ? new MorpheusStakingService(publicClient, walletClient || undefined) : null;
    }, [publicClient, walletClient]);

    const isStakingSupported = useMemo(() => {
        return stakingService?.isStakingSupported() || false;
    }, [stakingService]);
    
    const networkName = useMemo(() => {
        return stakingService?.getNetworkName() || 'Unknown Network';
    }, [stakingService]);

    /**
     * Handle errors consistently
     */
    const handleError = useCallback((err: any, context: string) => {
        console.error(`Error in ${context}:`, err);
        setError(`Failed to ${context}: ${err.message || 'Unknown error'}`);
        return null;
    }, []);

    /**
     * Get MOR token balance
     */
    const getMORBalance = useCallback(async (): Promise<bigint | null> => {
        if (!stakingService || !address) return null;

        try {
            setError(null);
            const balance = await stakingService.getMORBalance(address);
            setMorBalance(balance);
            return balance;
        } catch (err) {
            return handleError(err, 'get MOR balance');
        }
    }, [stakingService, address, handleError]);

    /**
     * Check MOR token allowance
     */
    const checkMORAllowance = useCallback(async (): Promise<bigint | null> => {
        if (!stakingService || !address) return null;

        try {
            setError(null);
            const allowance = await stakingService.checkMORAllowance(address);
            setMorAllowance(allowance);
            return allowance;
        } catch (err) {
            return handleError(err, 'check MOR allowance');
        }
    }, [stakingService, address, handleError]);

    /**
     * Approve MOR tokens for staking
     */
    const approveMOR = useCallback(async (amount: bigint): Promise<Hash | null> => {
        if (!stakingService) return null;

        try {
            setIsLoading(true);
            setError(null);
            
            const txHash = await stakingService.approveMOR(amount);
            
            // Refresh allowance after approval
            await checkMORAllowance();
            
            return txHash;
        } catch (err) {
            return handleError(err, 'approve MOR tokens');
        } finally {
            setIsLoading(false);
        }
    }, [stakingService, checkMORAllowance, handleError]);

    /**
     * Stake to Distribution pool
     */
    const stakeToDistributionPool = useCallback(async (
        poolId: number, 
        amount: bigint, 
        lockPeriod: bigint = 0n
    ): Promise<Hash | null> => {
        if (!stakingService) return null;

        try {
            setIsLoading(true);
            setError(null);
            
            const txHash = await stakingService.stakeToDistributionPool(poolId, amount, lockPeriod);
            
            // Refresh balances after staking
            await getMORBalance();
            await checkMORAllowance();
            
            return txHash;
        } catch (err) {
            return handleError(err, 'stake to distribution pool');
        } finally {
            setIsLoading(false);
        }
    }, [stakingService, getMORBalance, checkMORAllowance, handleError]);

    /**
     * Get Distribution pool stake info
     */
    const getDistributionStakeInfo = useCallback(async (poolId: number): Promise<StakeInfo | null> => {
        if (!stakingService || !address) return null;

        try {
            setError(null);
            return await stakingService.getDistributionStakeInfo(poolId, address);
        } catch (err) {
            return handleError(err, 'get distribution stake info');
        }
    }, [stakingService, address, handleError]);

    /**
     * Get Distribution pool info
     */
    const getDistributionPoolInfo = useCallback(async (poolId: number): Promise<PoolInfo | null> => {
        if (!stakingService) return null;

        try {
            setError(null);
            return await stakingService.getDistributionPoolInfo(poolId);
        } catch (err) {
            return handleError(err, 'get distribution pool info');
        }
    }, [stakingService, handleError]);

    /**
     * Claim rewards from Distribution pool
     */
    const claimDistributionRewards = useCallback(async (poolId: number): Promise<Hash | null> => {
        if (!stakingService) return null;

        try {
            setIsLoading(true);
            setError(null);
            
            const txHash = await stakingService.claimDistributionRewards(poolId);
            
            // Refresh balance after claiming
            await getMORBalance();
            
            return txHash;
        } catch (err) {
            return handleError(err, 'claim distribution rewards');
        } finally {
            setIsLoading(false);
        }
    }, [stakingService, getMORBalance, handleError]);

    /**
     * Withdraw from Distribution pool
     */
    const withdrawFromDistributionPool = useCallback(async (poolId: number, amount: bigint): Promise<Hash | null> => {
        if (!stakingService) return null;

        try {
            setIsLoading(true);
            setError(null);
            
            const txHash = await stakingService.withdrawFromDistributionPool(poolId, amount);
            
            // Refresh balance after withdrawal
            await getMORBalance();
            
            return txHash;
        } catch (err) {
            return handleError(err, 'withdraw from distribution pool');
        } finally {
            setIsLoading(false);
        }
    }, [stakingService, getMORBalance, handleError]);

    /**
     * Get available Distribution pools
     */
    const getAvailableDistributionPools = useCallback(async (): Promise<PoolInfo[]> => {
        if (!stakingService) return [];

        try {
            setError(null);
            return await stakingService.getAvailableDistributionPools();
        } catch (err) {
            handleError(err, 'get available distribution pools');
            return [];
        }
    }, [stakingService, handleError]);

    /**
     * Create Builder pool
     */
    const createBuilderPool = useCallback(async (
        name: string, 
        initialDeposit: bigint, 
        claimLockEnd: bigint
    ): Promise<Hash | null> => {
        if (!stakingService) return null;

        try {
            setIsLoading(true);
            setError(null);
            
            const txHash = await stakingService.createBuilderPool(name, initialDeposit, claimLockEnd);
            
            // Refresh balance after pool creation
            await getMORBalance();
            
            return txHash;
        } catch (err) {
            return handleError(err, 'create builder pool');
        } finally {
            setIsLoading(false);
        }
    }, [stakingService, getMORBalance, handleError]);

    /**
     * Deposit to Builder pool
     */
    const depositToBuilderPool = useCallback(async (poolId: string, amount: bigint): Promise<Hash | null> => {
        if (!stakingService) return null;

        try {
            setIsLoading(true);
            setError(null);
            
            const txHash = await stakingService.depositToBuilderPool(poolId, amount);
            
            // Refresh balance after deposit
            await getMORBalance();
            
            return txHash;
        } catch (err) {
            return handleError(err, 'deposit to builder pool');
        } finally {
            setIsLoading(false);
        }
    }, [stakingService, getMORBalance, handleError]);

    /**
     * Get Builder pool info
     */
    const getBuilderPoolInfo = useCallback(async (poolId: string): Promise<BuilderPoolInfo | null> => {
        if (!stakingService) return null;

        try {
            setError(null);
            return await stakingService.getBuilderPoolInfo(poolId);
        } catch (err) {
            return handleError(err, 'get builder pool info');
        }
    }, [stakingService, handleError]);

    /**
     * Get Builder pool stake info
     */
    const getBuilderStakeInfo = useCallback(async (poolId: string): Promise<StakeInfo | null> => {
        if (!stakingService || !address) return null;

        try {
            setError(null);
            return await stakingService.getBuilderStakeInfo(poolId, address);
        } catch (err) {
            return handleError(err, 'get builder stake info');
        }
    }, [stakingService, address, handleError]);

    /**
     * Format MOR amount for display
     */
    const formatMORAmount = useCallback((amount: bigint): string => {
        return stakingService?.formatMORAmount(amount) || '0';
    }, [stakingService]);

    /**
     * Parse MOR amount from string
     */
    const parseMORAmount = useCallback((amount: string): bigint => {
        return stakingService?.parseMORAmount(amount) || 0n;
    }, [stakingService]);

    /**
     * Clear error state
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Refresh all balances
     */
    const refreshBalances = useCallback(async () => {
        if (address) {
            await Promise.all([
                getMORBalance(),
                checkMORAllowance(),
            ]);
        }
    }, [address, getMORBalance, checkMORAllowance]);

    // Auto-refresh balances when wallet connects or chain changes
    useEffect(() => {
        if (address && stakingService && isStakingSupported) {
            refreshBalances();
        }
    }, [address, chainId, stakingService, isStakingSupported, refreshBalances]);

    return {
        // State
        isLoading,
        error,
        isConnected: !!address,
        currentChainId: chainId,
        isStakingSupported,
        networkName,
        
        // Balances
        morBalance,
        morAllowance,
        
        // Distribution Pool Functions
        getMORBalance,
        checkMORAllowance,
        approveMOR,
        stakeToDistributionPool,
        getDistributionStakeInfo,
        getDistributionPoolInfo,
        claimDistributionRewards,
        withdrawFromDistributionPool,
        getAvailableDistributionPools,
        
        // Builder Pool Functions
        createBuilderPool,
        depositToBuilderPool,
        getBuilderPoolInfo,
        getBuilderStakeInfo,
        
        // Utility Functions
        formatMORAmount,
        parseMORAmount,
        clearError,
        refreshBalances,
    };
}

export default useMorpheusStaking;