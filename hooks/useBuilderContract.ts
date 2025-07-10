import { useCallback, useMemo } from 'react';
import { type Address, type PublicClient, type WalletClient, type Hash, 
         type GetContractReturnType, getContract } from 'viem';
import { usePublicClient, useWalletClient, useChainId } from 'wagmi';
import { BUILDER_ABI, BUILDER_ADDRESSES } from '../contracts/abis/MorpheusBuilder';
import { NETWORK_CONFIG } from '../contracts/config/networks';
import { BuilderPool, BuilderPoolCreationParams, StakingInfo } from '../contracts/types/contracts';

type BuilderContract = GetContractReturnType<typeof BUILDER_ABI, PublicClient>;

export function useBuilderContract(providedChainId?: number) {
    const chainId = useChainId();
    const publicClient = usePublicClient({
      chainId: providedChainId || chainId
    });
    const { data: walletClient } = useWalletClient();
    
    // Use the provided chainId or fallback to the connected chain
    const effectiveChainId = providedChainId || chainId;

    const contract = useMemo((): BuilderContract | null => {
        if (!publicClient) return null;

        const network = Object.values(NETWORK_CONFIG).find(
            (config) => config.chainId === effectiveChainId
        );
        if (!network) return null;

        const addresses = effectiveChainId === 42161 ? BUILDER_ADDRESSES.arbitrum : BUILDER_ADDRESSES.base;

        return getContract({
            address: addresses.builder as Address,
            abi: BUILDER_ABI,
            client: publicClient
        });
    }, [effectiveChainId, publicClient]);

    const createBuilderPool = useCallback(
        async (params: BuilderPoolCreationParams): Promise<Hash> => {
            if (!contract || !walletClient) throw new Error('Contract not initialized');
            
            const { request } = await contract.simulate.createBuilderPool([
                params.name,
                params.initialStake,
                BigInt(params.lockPeriod),
                BigInt(params.rewardSplit)
            ]);
            
            return walletClient.writeContract(request);
        },
        [contract, walletClient]
    );

    const stake = useCallback(
        async (poolId: `0x${string}`, amount: bigint): Promise<Hash> => {
            if (!contract || !walletClient) throw new Error('Contract not initialized');
            
            const { request } = await contract.simulate.stake([poolId, amount]);
            return walletClient.writeContract(request);
        },
        [contract, walletClient]
    );

    const unstake = useCallback(
        async (poolId: `0x${string}`, amount: bigint): Promise<Hash> => {
            if (!contract || !walletClient) throw new Error('Contract not initialized');
            
            const { request } = await contract.simulate.unstake([poolId, amount]);
            return walletClient.writeContract(request);
        },
        [contract, walletClient]
    );

    const claimRewards = useCallback(
        async (poolId: `0x${string}`, receiver: `0x${string}`): Promise<Hash> => {
            if (!contract || !walletClient) throw new Error('Contract not initialized');
            
            // Real Morpheus Builders contract claim function signature
            const { request } = await contract.simulate.claim([poolId, receiver]);
            return walletClient.writeContract(request);
        },
        [contract, walletClient]
    );

    const getBuilderPool = useCallback(
        async (poolId: `0x${string}`): Promise<BuilderPool> => {
            if (!contract) throw new Error('Contract not initialized');
            
            // Use real contract methods with proper error handling
            try {
                // Note: These methods need to be verified against actual Builder contract ABI
                throw new Error('getBuilderPool: Method not implemented - contract ABI needs verification with official Morpheus Builder contract');
            } catch (error) {
                throw new Error(`Failed to get builder pool: ${error}`);
            }
        },
        [contract]
    );

    const getStakingInfo = useCallback(
        async (poolId: `0x${string}`, address: Address): Promise<StakingInfo> => {
            if (!contract) throw new Error('Contract not initialized');
            
            try {
                // Use actual contract read methods when ABI is verified
                throw new Error('getStakingInfo: Method not implemented - contract ABI needs verification with official Morpheus Builder contract');
            } catch (error) {
                throw new Error(`Failed to get staking info: ${error}`);
            }
        },
        [contract]
    );

    // Real contract methods - to be implemented when ABI is verified
    const getTotalDistributedRewards = useCallback(
        async (): Promise<bigint> => {
            throw new Error('getTotalDistributedRewards: Method not implemented - contract ABI needs verification');
        },
        []
    );

    const getTotalPendingRewards = useCallback(
        async (): Promise<bigint> => {
            throw new Error('getTotalPendingRewards: Method not implemented - contract ABI needs verification');
        },
        []
    );

    const getUserClaimedRewards = useCallback(
        async (userAddress: Address): Promise<bigint> => {
            throw new Error('getUserClaimedRewards: Method not implemented - contract ABI needs verification');
        },
        []
    );

    const queryFilter = useCallback(
        async (filter: any, blockRange: number) => {
            throw new Error('queryFilter: Method not implemented - contract ABI needs verification');
        },
        []
    );

    // Real filters object - to be implemented when ABI is verified
    const filters = {
        RewardsClaimed: (address: Address) => {
            throw new Error('RewardsClaimed filter: Not implemented - contract ABI needs verification');
        }
    };

    return {
        contract,
        createBuilderPool,
        stake,
        unstake,
        claimRewards,
        getBuilderPool,
        getStakingInfo,
        // Contract method implementations - require ABI verification
        getTotalDistributedRewards,
        getTotalPendingRewards,
        getUserClaimedRewards,
        queryFilter,
        filters
    };
}
