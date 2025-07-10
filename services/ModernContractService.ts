/**
 * Modern Contract Service with pure wagmi v2 and viem integration
 * Fully migrated from ethers.js to viem
 */

import { getContract, type Address, type PublicClient, type WalletClient, type Hash } from 'viem';
import { NETWORK_CONFIG } from '../contracts/config/networks';

// Import ABIs
import IMorpheusBuilderABI from '../contracts/abis/IMorpheusBuilder.json';
import IMorpheusTreasuryABI from '../contracts/abis/IMorpheusTreasury.json';
import { STAKING_ABI } from '../contracts/abis/MorpheusStaking';
import MOR_TOKEN_ABI from '../contracts/abis/MOR_TOKEN_ABI';
import { DISTRIBUTION_ABI } from '../contracts/abis/DistributionABI';

export class ModernContractService {
    private publicClient: PublicClient;
    private walletClient?: WalletClient;

    constructor(publicClient: PublicClient, walletClient?: WalletClient) {
        this.publicClient = publicClient;
        this.walletClient = walletClient;
    }

    /**
     * Get Builder contract using viem
     */
    getBuilderContract(networkId: number) {
        const networkConfig = this.getNetworkConfig(networkId);
        if (!networkConfig) {
            throw new Error(`Network ${networkId} not supported`);
        }
        
        // Use contract addresses from network config
        const contractAddresses = networkConfig.contracts;
        if (!contractAddresses?.builder) {
            throw new Error(`Builder contract not configured for network ${networkId}`);
        }
        
        return getContract({
            address: contractAddresses.builder as Address,
            abi: IMorpheusBuilderABI,
            client: this.walletClient || this.publicClient,
        });
    }

    /**
     * Get Treasury contract using viem
     */
    getTreasuryContract(networkId: number) {
        const networkConfig = this.getNetworkConfig(networkId);
        if (!networkConfig) {
            throw new Error(`Network ${networkId} not supported`);
        }
        
        const contractAddresses = networkConfig.contracts;
        if (!contractAddresses?.treasury) {
            throw new Error(`Treasury contract not configured for network ${networkId}`);
        }
        
        return getContract({
            address: contractAddresses.treasury as Address,
            abi: IMorpheusTreasuryABI,
            client: this.walletClient || this.publicClient,
        });
    }

    /**
     * Create a builder pool
     */
    async createBuilderPool(
        networkId: number,
        name: string,
        initialStake: bigint,
        editDeadline: number
    ) {
        const builderContract = this.getBuilderContract(networkId);
        
        // Using viem contract call
        return await builderContract.write.createPool([
            name,
            initialStake,
            BigInt(editDeadline)
        ]);
    }

    /**
     * Stake tokens to a pool
     */
    async stakeToPool(
        networkId: number,
        poolId: bigint,
        amount: bigint
    ) {
        const builderContract = this.getBuilderContract(networkId);
        
        return await builderContract.write.stake([poolId, amount]);
    }

    /**
     * Get pool information
     */
    async getPoolInfo(networkId: number, poolId: bigint) {
        const builderContract = this.getBuilderContract(networkId);
        
        return await builderContract.read.getPool([poolId]);
    }

    /**
     * Get user stake information
     */
    async getUserStake(networkId: number, poolId: bigint, userAddress: Address) {
        const builderContract = this.getBuilderContract(networkId);
        
        return await builderContract.read.getUserStake([poolId, userAddress]);
    }

    /**
     * Get total rewards for a user
     */
    async getUserRewards(networkId: number, userAddress: Address) {
        const treasuryContract = this.getTreasuryContract(networkId);
        
        return await treasuryContract.read.getUserRewards([userAddress]);
    }

    /**
     * Claim rewards
     */
    async claimRewards(networkId: number) {
        const treasuryContract = this.getTreasuryContract(networkId);
        
        return await treasuryContract.write.claimRewards();
    }

    /**
     * Get network configuration
     */
    getNetworkConfig(networkId: number) {
        return Object.values(NETWORK_CONFIG).find(network => network.id === networkId);
    }

    /**
     * Get MOR token contract
     */
    getMORTokenContract(networkId: number) {
        const networkConfig = this.getNetworkConfig(networkId);
        if (!networkConfig?.tokens?.MOR?.address) {
            throw new Error(`MOR token address not found for network ${networkId}`);
        }

        return getContract({
            address: networkConfig.tokens.MOR.address as Address,
            abi: MOR_TOKEN_ABI.abi,
            client: this.walletClient || this.publicClient,
        });
    }

    /**
     * Check MOR token approval
     */
    async checkMORTokenApproval(
        networkId: number,
        userAddress: Address,
        spenderAddress: Address
    ) {
        const morToken = this.getMORTokenContract(networkId);
        
        return await morToken.read.allowance([userAddress, spenderAddress]);
    }

    /**
     * Approve MOR token spending
     */
    async approveMORTokenSpending(
        networkId: number,
        spenderAddress: Address,
        amount: bigint
    ) {
        const morToken = this.getMORTokenContract(networkId);
        
        return await morToken.write.approve([spenderAddress, amount]);
    }

    /**
     * Get MOR token balance
     */
    async getMORTokenBalance(networkId: number, userAddress: Address) {
        const morToken = this.getMORTokenContract(networkId);
        
        return await morToken.read.balanceOf([userAddress]);
    }

    /**
     * Get Distribution Contract (Ethereum L1)
     */
    getDistributionContract() {
        const distributionAddress = process.env.NEXT_PUBLIC_DISTRIBUTION_ETHEREUM as Address;
        if (!distributionAddress) {
            throw new Error('Distribution contract address not configured');
        }

        return getContract({
            address: distributionAddress,
            abi: DISTRIBUTION_ABI,
            client: this.walletClient || this.publicClient,
        });
    }

    /**
     * Check if user has approved token spending (generic)
     */
    async checkTokenApproval(
        networkId: number,
        tokenAddress: Address,
        userAddress: Address,
        spenderAddress: Address
    ) {
        // For MOR tokens, use specific MOR token method
        if (this.isMORTokenAddress(networkId, tokenAddress)) {
            return await this.checkMORTokenApproval(networkId, userAddress, spenderAddress);
        }
        
        // Generic ERC20 approval check would go here
        throw new Error('Generic token approval not implemented');
    }

    /**
     * Approve token spending (generic)
     */
    async approveTokenSpending(
        networkId: number,
        tokenAddress: Address,
        spenderAddress: Address,
        amount: bigint
    ) {
        // For MOR tokens, use specific MOR token method
        if (this.isMORTokenAddress(networkId, tokenAddress)) {
            return await this.approveMORTokenSpending(networkId, spenderAddress, amount);
        }
        
        // Generic ERC20 approval would go here
        throw new Error('Generic token approval not implemented');
    }

    /**
     * Check if address is MOR token for given network
     */
    private isMORTokenAddress(networkId: number, tokenAddress: Address): boolean {
        const networkConfig = this.getNetworkConfig(networkId);
        return networkConfig?.tokens?.MOR?.address?.toLowerCase() === tokenAddress.toLowerCase();
    }
}

/**
 * Factory function to create service with wagmi clients
 */
export function createContractService(
    publicClient: PublicClient,
    walletClient?: WalletClient
) {
    return new ModernContractService(publicClient, walletClient);
}

export default ModernContractService;