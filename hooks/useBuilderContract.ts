import { useCallback, useMemo } from 'react';
import { type Address, type PublicClient, type WalletClient, type Hash, 
         type GetContractReturnType, getContract } from 'viem';
import { usePublicClient, useWalletClient, useChainId } from 'wagmi';
import { BUILDER_ABI, BUILDER_ADDRESSES } from '../contracts/abis/MorpheusBuilder';
import { NETWORK_CONFIG } from '../contracts/config/networks';
import { BuilderPool, BuilderPoolCreationParams, StakingInfo } from '../contracts/types/contracts';

type BuilderContract = GetContractReturnType<typeof BUILDER_ABI, PublicClient>;

export function useBuilderContract(chainId: number) {
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();

    const contract = useMemo((): BuilderContract | null => {
        if (!publicClient) return null;

        const network = Object.values(NETWORK_CONFIG).find(
            (config) => config.chainId === chainId
        );
        if (!network) return null;

        const addresses = chainId === 42161 ? BUILDER_ADDRESSES.arbitrum : BUILDER_ADDRESSES.base;

        return getContract({
            address: addresses.builder as Address,
            abi: BUILDER_ABI,
            client: publicClient
        });
    }, [chainId, publicClient]);

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
        async (poolId: `0x${string}`): Promise<Hash> => {
            if (!contract || !walletClient) throw new Error('Contract not initialized');
            
            const { request } = await contract.simulate.claimRewards([poolId]);
            return walletClient.writeContract(request);
        },
        [contract, walletClient]
    );

    const getBuilderPool = useCallback(
        async (poolId: `0x${string}`): Promise<BuilderPool> => {
            if (!contract) throw new Error('Contract not initialized');
            return contract.read.getBuilderPool([poolId]);
        },
        [contract]
    );

    const getStakingInfo = useCallback(
        async (poolId: `0x${string}`, address: Address): Promise<StakingInfo> => {
            if (!contract) throw new Error('Contract not initialized');
            
            const [amount, isLocked, lockEndTime, pendingRewards] = await Promise.all([
                contract.read.getStakerAmount([poolId, address]),
                contract.read.isLocked([poolId, address]),
                contract.read.getLockEndTime([poolId, address]),
                contract.read.getPendingRewards([poolId, address])
            ]);
            
            return {
                amount,
                lockEndTime,
                pendingRewards
            };
        },
        [contract]
    );

    return {
        contract,
        createBuilderPool,
        stake,
        unstake,
        claimRewards,
        getBuilderPool,
        getStakingInfo
    };
} 