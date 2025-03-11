import { useCallback, useMemo } from 'react';
import { type Address, type PublicClient, type WalletClient, type Hash, 
         type GetContractReturnType, getContract } from 'viem';
import { usePublicClient, useWalletClient, useChainId } from 'wagmi';
import { NETWORK_CONFIG } from '../contracts/config/networks';
import { TREASURY_ABI, TREASURY_ADDRESSES } from '../contracts/abis/MorpheusTreasury';

type TreasuryContract = GetContractReturnType<typeof TREASURY_ABI, PublicClient>;

export function useTreasuryContract(chainId: number) {
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();

    const contract = useMemo((): TreasuryContract | null => {
        if (!publicClient) return null;

        const network = Object.values(NETWORK_CONFIG).find(
            (config) => config.chainId === chainId
        );
        if (!network) return null;

        const addresses = chainId === 42161 ? TREASURY_ADDRESSES.arbitrum : TREASURY_ADDRESSES.base;

        return getContract({
            address: addresses.treasury as Address,
            abi: TREASURY_ABI,
            client: publicClient
        });
    }, [chainId, publicClient]);

    const distributeRewards = useCallback(
        async (builderIds: `0x${string}`[], amounts: bigint[]): Promise<Hash> => {
            if (!contract || !walletClient) throw new Error('Contract not initialized');
            
            const { request } = await contract.simulate.distributeRewards([builderIds, amounts]);
            return walletClient.writeContract(request);
        },
        [contract, walletClient]
    );

    const getBuilderRewards = useCallback(
        async (builderId: `0x${string}`): Promise<bigint> => {
            if (!contract) throw new Error('Contract not initialized');
            return contract.read.getBuilderRewards([builderId]);
        },
        [contract]
    );

    const getFeePercentage = useCallback(
        async (): Promise<number> => {
            if (!contract) throw new Error('Contract not initialized');
            const feePercentage = await contract.read.getFeePercentage();
            return Number(feePercentage);
        },
        [contract]
    );

    return {
        contract,
        distributeRewards,
        getBuilderRewards,
        getFeePercentage
    };
} 