/**
 * Pure viem/wagmi v2 Contract Service
 * No ethers.js dependencies - fully migrated to viem
 */

import { getContract, type Address, type PublicClient, type WalletClient, type Hash } from 'viem';
import { BUILDER_ABI, BUILDER_ADDRESSES } from '../contracts/abis/MorpheusBuilder';
import { TREASURY_ABI, TREASURY_ADDRESSES } from '../contracts/abis/MorpheusTreasury';
import { NETWORK_CONFIG } from '../contracts/config/networks';

export class ContractService {
    private publicClient: PublicClient;
    private walletClient?: WalletClient;

    constructor(publicClient: PublicClient, walletClient?: WalletClient) {
        this.publicClient = publicClient;
        this.walletClient = walletClient;
    }

    /**
     * Get Builder contract using viem
     */
    getBuilderContract(chainId: number) {
        const addresses = chainId === 42161 ? BUILDER_ADDRESSES.arbitrum : BUILDER_ADDRESSES.base;
        
        return getContract({
            address: addresses.builder,
            abi: BUILDER_ABI,
            client: this.walletClient || this.publicClient,
        });
    }

    /**
     * Get Treasury contract using viem
     */
    getTreasuryContract(chainId: number) {
        const addresses = chainId === 42161 ? TREASURY_ADDRESSES.arbitrum : TREASURY_ADDRESSES.base;
        
        return getContract({
            address: addresses.treasury,
            abi: TREASURY_ABI,
            client: this.walletClient || this.publicClient,
        });
    }

    /**
     * Create a builder pool
     */
    async createBuilderPool(
        chainId: number,
        name: string,
        initialStake: bigint,
        lockPeriod: bigint,
        rewardSplit: bigint
    ): Promise<Hash> {
        if (!this.walletClient) {
            throw new Error('Wallet client required for write operations');
        }

        const contract = this.getBuilderContract(chainId);
        
        const { request } = await contract.simulate.createBuilderPool([
            name,
            initialStake,
            lockPeriod,
            rewardSplit
        ]);
        
        return this.walletClient.writeContract(request);
    }

    /**
     * Stake tokens to a builder pool
     */
    async stake(chainId: number, poolId: `0x${string}`, amount: bigint): Promise<Hash> {
        if (!this.walletClient) {
            throw new Error('Wallet client required for write operations');
        }

        const contract = this.getBuilderContract(chainId);
        
        const { request } = await contract.simulate.stake([poolId, amount]);
        
        return this.walletClient.writeContract(request);
    }

    /**
     * Unstake tokens from a builder pool
     */
    async unstake(chainId: number, poolId: `0x${string}`, amount: bigint): Promise<Hash> {
        if (!this.walletClient) {
            throw new Error('Wallet client required for write operations');
        }

        const contract = this.getBuilderContract(chainId);
        
        const { request } = await contract.simulate.unstake([poolId, amount]);
        
        return this.walletClient.writeContract(request);
    }

    /**
     * Claim rewards from a builder pool
     */
    async claimRewards(chainId: number, poolId: `0x${string}`, receiver: Address): Promise<Hash> {
        if (!this.walletClient) {
            throw new Error('Wallet client required for write operations');
        }

        const contract = this.getBuilderContract(chainId);
        
        // Real Morpheus Builders contract expects: claim(bytes32 poolId, address receiver)
        const { request } = await contract.simulate.claim([poolId, receiver]);
        
        return this.walletClient.writeContract(request);
    }

    /**
     * Get builder pool information
     */
    async getBuilderInfo(chainId: number, poolId: `0x${string}`) {
        const contract = this.getBuilderContract(chainId);
        
        // Note: This function needs to be verified against actual Builder contract ABI
        try {
            return await contract.read.getBuilderPool([poolId]);
        } catch (error) {
            throw new Error(`getBuilderInfo: Function not available in current contract ABI - ${error}`);
        }
    }

    /**
     * Get builder rewards from treasury
     */
    async getBuilderRewards(chainId: number, poolId: `0x${string}`): Promise<bigint> {
        const contract = this.getTreasuryContract(chainId);
        
        return await contract.read.getBuilderRewards([poolId]);
    }

    /**
     * Get network configuration
     */
    getNetworkConfig(chainId: number) {
        return Object.values(NETWORK_CONFIG).find(network => network.chainId === chainId);
    }

    /**
     * Check if network is supported
     */
    isNetworkSupported(chainId: number): boolean {
        return this.getNetworkConfig(chainId) !== undefined;
    }
}

/**
 * Factory function to create service with wagmi clients
 */
export function createContractService(
    publicClient: PublicClient,
    walletClient?: WalletClient
) {
    return new ContractService(publicClient, walletClient);
}

export default ContractService;