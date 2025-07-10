/**
 * Morpheus Staking Service - Official Integration
 * 
 * This service integrates with the official Morpheus AI smart contracts:
 * - Distribution Contract: Main staking and rewards on Ethereum L1
 * - Builder Contract: Custom builder pools on L2 (Arbitrum/Base)
 * - MOR Token: Official MOR token contract
 * 
 * Based on official Morpheus documentation and smart contracts
 */

import { 
    PublicClient, 
    WalletClient, 
    Address, 
    parseEther, 
    formatEther,
    getContract,
    Hash
} from 'viem';
import { arbitrumConfig } from '../config/networks/arbitrum';
import { baseConfig } from '../config/networks/base';
import { DISTRIBUTION_ABI } from '../contracts/abis/DistributionABI';
import { BUILDER_ABI } from '../contracts/abis/MorpheusBuilder';
import { MOR_TOKEN_ABI } from '../contracts/abis/MOR_TOKEN_ABI';

export interface StakeInfo {
    amount: bigint;
    lockEndTime: bigint;
    isLocked: boolean;
    pendingRewards: bigint;
    poolId: number;
}

export interface PoolInfo {
    id: string;
    name: string;
    totalDeposited: bigint;
    totalVirtualDeposited: bigint;
    payoutStart: bigint;
    decreaseInterval: bigint;
    withdrawLockPeriod: bigint;
    claimLockPeriod: bigint;
    initialReward: bigint;
    rewardDecrease: bigint;
    minimalStake: bigint;
    isPublic: boolean;
}

export interface BuilderPoolInfo {
    poolId: string;
    name: string;
    admin: Address;
    poolStart: bigint;
    withdrawLockPeriodAfterDeposit: bigint;
    claimLockEnd: bigint;
    minimalDeposit: bigint;
    totalDeposited: bigint;
    totalVirtualDeposited: bigint;
}

export class MorpheusStakingService {
    private publicClient: PublicClient;
    private walletClient?: WalletClient;
    private chainId: number;

    constructor(publicClient: PublicClient, walletClient?: WalletClient) {
        this.publicClient = publicClient;
        this.walletClient = walletClient;
        this.chainId = publicClient.chain?.id || 1;
    }

    /**
     * Get network configuration for current chain
     */
    private getNetworkConfig() {
        const networks = [arbitrumConfig, baseConfig];
        return networks.find(config => config.chainId === this.chainId);
    }

    /**
     * Get Distribution contract (main staking contract on L1)
     */
    private getDistributionContract() {
        const config = this.getNetworkConfig();
        if (!config?.contracts.distribution) {
            throw new Error('Distribution contract not configured for this network');
        }

        return getContract({
            address: config.contracts.distribution as Address,
            abi: DISTRIBUTION_ABI,
            client: {
                public: this.publicClient,
                wallet: this.walletClient,
            }
        });
    }

    /**
     * Get Builder contract (custom pools on L2)
     */
    private getBuilderContract() {
        const config = this.getNetworkConfig();
        if (!config?.contracts.builder) {
            throw new Error('Builder contract not configured for this network');
        }

        return getContract({
            address: config.contracts.builder as Address,
            abi: BUILDER_ABI,
            client: {
                public: this.publicClient,
                wallet: this.walletClient,
            }
        });
    }

    /**
     * Get MOR token contract
     */
    private getMORTokenContract() {
        const config = this.getNetworkConfig();
        if (!config?.tokens.MOR?.address) {
            throw new Error('MOR token not configured for this network');
        }

        return getContract({
            address: config.tokens.MOR.address as Address,
            abi: MOR_TOKEN_ABI,
            client: {
                public: this.publicClient,
                wallet: this.walletClient,
            }
        });
    }

    /**
     * Get MOR token balance for an address
     */
    async getMORBalance(address: Address): Promise<bigint> {
        const morToken = this.getMORTokenContract();
        return await morToken.read.balanceOf([address]) as bigint;
    }

    /**
     * Check MOR token allowance for Distribution contract
     */
    async checkMORAllowance(userAddress: Address): Promise<bigint> {
        const morToken = this.getMORTokenContract();
        const config = this.getNetworkConfig();
        
        if (!config?.contracts.distribution) {
            throw new Error('Distribution contract not configured');
        }

        return await morToken.read.allowance([
            userAddress, 
            config.contracts.distribution as Address
        ]) as bigint;
    }

    /**
     * Approve MOR tokens for staking
     */
    async approveMOR(amount: bigint): Promise<Hash> {
        if (!this.walletClient) {
            throw new Error('Wallet client required for transactions');
        }

        const morToken = this.getMORTokenContract();
        const config = this.getNetworkConfig();
        
        if (!config?.contracts.distribution) {
            throw new Error('Distribution contract not configured');
        }

        const txHash = await this.walletClient.writeContract({
            address: config.tokens.MOR.address as Address,
            abi: MOR_TOKEN_ABI,
            functionName: 'approve',
            args: [config.contracts.distribution as Address, amount],
            chain: null,
            account: this.walletClient.account || null
        });
        
        return txHash;
    }

    /**
     * Stake MOR tokens to a Distribution pool
     * @param poolId Pool ID (0 = capital pool, 1 = code pool, etc.)
     * @param amount Amount to stake in wei
     * @param claimLockEnd Lock period end timestamp (0 for no lock)
     */
    async stakeToDistributionPool(
        poolId: number, 
        amount: bigint, 
        claimLockEnd: bigint = 0n
    ): Promise<Hash> {
        if (!this.walletClient) {
            throw new Error('Wallet client required for transactions');
        }

        const config = this.getNetworkConfig();
        if (!config?.contracts.distribution) {
            throw new Error('Distribution contract not configured');
        }
        
        const txHash = await this.walletClient.writeContract({
            address: config.contracts.distribution as Address,
            abi: DISTRIBUTION_ABI,
            functionName: 'stake',
            args: [BigInt(poolId), amount],
            chain: null,
            account: this.walletClient.account || null
        });
        
        return txHash;
    }

    /**
     * Get user's stake info for a Distribution pool
     */
    async getDistributionStakeInfo(poolId: number, userAddress: Address): Promise<StakeInfo> {
        const distribution = this.getDistributionContract();
        
        // TODO: Re-enable when Distribution ABI has proper user data methods
        const pendingRewards = await distribution.read.getCurrentUserReward([BigInt(poolId), userAddress]);
        
        return {
            amount: 0n, // TODO: Get from actual contract
            lockEndTime: 0n, // TODO: Get from actual contract
            isLocked: false, // TODO: Calculate from lock end time
            pendingRewards: pendingRewards,
            poolId: poolId
        };
    }

    /**
     * Get Distribution pool information
     */
    async getDistributionPoolInfo(poolId: number): Promise<PoolInfo> {
        const distribution = this.getDistributionContract();
        
        // TODO: Re-enable when Distribution ABI has proper pool data methods
        // const pool = await distribution.read.getPool([BigInt(poolId)]);
        
        return {
            id: poolId.toString(),
            name: `Pool ${poolId}`,
            totalDeposited: 0n, // TODO: Get from actual contract
            totalVirtualDeposited: 0n, // TODO: Get from actual contract
            payoutStart: 0n,
            decreaseInterval: 0n,
            withdrawLockPeriod: 0n,
            claimLockPeriod: 0n,
            initialReward: 0n,
            rewardDecrease: 0n,
            minimalStake: 0n,
            isPublic: true
        };
    }

    /**
     * Claim rewards from Distribution pool
     */
    async claimDistributionRewards(poolId: number): Promise<Hash> {
        if (!this.walletClient) {
            throw new Error('Wallet client required for transactions');
        }

        const distribution = this.getDistributionContract();
        
        const config = this.getNetworkConfig();
        if (!config?.contracts.distribution) {
            throw new Error('Distribution contract not configured');
        }
        
        const txHash = await this.walletClient.writeContract({
            address: config.contracts.distribution as Address,
            abi: DISTRIBUTION_ABI,
            functionName: 'claim',
            args: [BigInt(poolId)],
            chain: null,
            account: this.walletClient.account || null
        });
        
        return txHash;
    }

    /**
     * Withdraw stake from Distribution pool
     */
    async withdrawFromDistributionPool(poolId: number, amount: bigint): Promise<Hash> {
        if (!this.walletClient) {
            throw new Error('Wallet client required for transactions');
        }

        const distribution = this.getDistributionContract();
        
        const config = this.getNetworkConfig();
        if (!config?.contracts.distribution) {
            throw new Error('Distribution contract not configured');
        }
        
        const txHash = await this.walletClient.writeContract({
            address: config.contracts.distribution as Address,
            abi: DISTRIBUTION_ABI,
            functionName: 'withdraw',
            args: [BigInt(poolId), amount],
            chain: null,
            account: this.walletClient.account || null
        });
        
        return txHash;
    }

    /**
     * Create a custom Builder pool
     */
    async createBuilderPool(
        name: string,
        initialDeposit: bigint,
        claimLockEnd: bigint
    ): Promise<Hash> {
        if (!this.walletClient) {
            throw new Error('Wallet client required for transactions');
        }

        const builder = this.getBuilderContract();
        
        const config = this.getNetworkConfig();
        if (!config?.contracts.builder) {
            throw new Error('Builder contract not configured');
        }
        
        const txHash = await this.walletClient.writeContract({
            address: config.contracts.builder as Address,
            abi: BUILDER_ABI,
            functionName: 'createPool',
            args: [name, initialDeposit, claimLockEnd],
            chain: null,
            account: this.walletClient.account || null
        });
        
        return txHash;
    }

    /**
     * Deposit to a Builder pool
     */
    async depositToBuilderPool(poolId: string, amount: bigint): Promise<Hash> {
        if (!this.walletClient) {
            throw new Error('Wallet client required for transactions');
        }

        const builder = this.getBuilderContract();
        
        const config = this.getNetworkConfig();
        if (!config?.contracts.builder) {
            throw new Error('Builder contract not configured');
        }
        
        const txHash = await this.walletClient.writeContract({
            address: config.contracts.builder as Address,
            abi: BUILDER_ABI,
            functionName: 'deposit',
            args: [poolId as Hash, amount],
            chain: null,
            account: this.walletClient.account || null
        });
        
        return txHash;
    }

    /**
     * Get Builder pool information
     */
    async getBuilderPoolInfo(poolId: string): Promise<BuilderPoolInfo> {
        const builder = this.getBuilderContract();
        
        const pool = await builder.read.builderPools([poolId as Hash]);
        const poolData = await builder.read.buildersPoolData([poolId as Hash]);
        
        return {
            poolId,
            name: pool[0],
            admin: pool[1],
            poolStart: pool[2],
            withdrawLockPeriodAfterDeposit: pool[3],
            claimLockEnd: pool[4],
            minimalDeposit: pool[5],
            totalDeposited: poolData[1],
            totalVirtualDeposited: poolData[2]
        };
    }

    /**
     * Get user's Builder pool stake info
     */
    async getBuilderStakeInfo(poolId: string, userAddress: Address): Promise<StakeInfo> {
        const builder = this.getBuilderContract();
        
        const userData = await builder.read.usersData([userAddress, poolId as Hash]);
        const pendingRewards = await builder.read.getCurrentUserReward([poolId as Hash, userAddress]);
        
        return {
            amount: userData[2], // deposited
            lockEndTime: userData[1], // claimLockStart  
            isLocked: userData[1] > BigInt(Math.floor(Date.now() / 1000)),
            pendingRewards: pendingRewards,
            poolId: 0 // Builder pools don't use numeric IDs
        };
    }

    /**
     * Get all available Distribution pools
     */
    async getAvailableDistributionPools(): Promise<PoolInfo[]> {
        const distribution = this.getDistributionContract();
        
        // Get pool count - typically there are pools 0, 1, 2, etc.
        // For now, we'll check the first few pools
        const pools: PoolInfo[] = [];
        
        for (let i = 0; i < 4; i++) {
            try {
                const poolInfo = await this.getDistributionPoolInfo(i);
                pools.push(poolInfo);
            } catch (error) {
                // Pool doesn't exist, stop checking
                break;
            }
        }
        
        return pools;
    }

    /**
     * Format amount for display
     */
    formatMORAmount(amount: bigint): string {
        return formatEther(amount);
    }

    /**
     * Parse amount from string
     */
    parseMORAmount(amount: string): bigint {
        return parseEther(amount);
    }

    /**
     * Check if current network supports staking
     */
    isStakingSupported(): boolean {
        const config = this.getNetworkConfig();
        return !!(config?.contracts.distribution || config?.contracts.builder);
    }

    /**
     * Get network name
     */
    getNetworkName(): string {
        const config = this.getNetworkConfig();
        return config?.name || 'Unknown Network';
    }
}

export default MorpheusStakingService;