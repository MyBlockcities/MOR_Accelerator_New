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
    Hash,
    createPublicClient,
    createWalletClient,
    http
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
     * Get Distribution contract address
     */
    private getDistributionContractAddress(): Address {
        const config = this.getNetworkConfig();
        if (!config?.contracts.distribution) {
            throw new Error('Distribution contract not configured for this network');
        }
        return config.contracts.distribution as Address;
    }

    /**
     * Get Builder contract address
     */
    private getBuilderContractAddress(): Address {
        const config = this.getNetworkConfig();
        if (!config?.contracts.builder) {
            throw new Error('Builder contract not configured for this network');
        }
        return config.contracts.builder as Address;
    }

    /**
     * Get MOR token contract address
     */
    private getMORTokenAddress(): Address {
        const config = this.getNetworkConfig();
        if (!config?.tokens.MOR?.address) {
            throw new Error('MOR token not configured for this network');
        }
        return config.tokens.MOR.address as Address;
    }

    /**
     * Get MOR token balance for an address
     */
    async getMORBalance(address: Address): Promise<bigint> {
        const result = await this.publicClient.readContract({
            address: this.getMORTokenAddress(),
            abi: MOR_TOKEN_ABI,
            functionName: 'balanceOf',
            args: [address]
        });
        return result as bigint;
    }

    /**
     * Check MOR token allowance for Distribution contract
     */
    async checkMORAllowance(userAddress: Address): Promise<bigint> {
        const result = await this.publicClient.readContract({
            address: this.getMORTokenAddress(),
            abi: MOR_TOKEN_ABI,
            functionName: 'allowance',
            args: [userAddress, this.getDistributionContractAddress()] as any
        });
        return result as bigint;
    }

    /**
     * Approve MOR tokens for staking
     */
    async approveMOR(amount: bigint): Promise<Hash> {
        if (!this.walletClient) {
            throw new Error('Wallet client required for transactions');
        }

        const txHash = await this.walletClient.writeContract({
            address: this.getMORTokenAddress(),
            abi: MOR_TOKEN_ABI,
            functionName: 'approve',
            args: [this.getDistributionContractAddress(), amount] as any,
            chain: undefined,
            account: this.walletClient.account!
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

        const txHash = await this.walletClient.writeContract({
            address: this.getDistributionContractAddress(),
            abi: DISTRIBUTION_ABI,
            functionName: 'stake',
            args: [BigInt(poolId), amount] as any,
            chain: undefined,
            account: this.walletClient.account!
        });
        
        return txHash;
    }

    /**
     * Get user's stake info for a Distribution pool
     */
    async getDistributionStakeInfo(poolId: number, userAddress: Address): Promise<StakeInfo> {
        try {
            const pendingRewards = await this.publicClient.readContract({
                address: this.getDistributionContractAddress(),
                abi: DISTRIBUTION_ABI,
                functionName: 'getCurrentUserReward',
                args: [BigInt(poolId), userAddress] as any
            });
            
            return {
                amount: 0n, // TODO: Get from actual contract when user data methods are available
                lockEndTime: 0n, // TODO: Get from actual contract when user data methods are available
                isLocked: false, // TODO: Calculate from lock end time
                pendingRewards: pendingRewards as bigint,
                poolId: poolId
            };
        } catch (error) {
            console.error('Error fetching distribution stake info:', error);
            return {
                amount: 0n,
                lockEndTime: 0n,
                isLocked: false,
                pendingRewards: 0n,
                poolId: poolId
            };
        }
    }

    /**
     * Get Distribution pool information
     */
    async getDistributionPoolInfo(poolId: number): Promise<PoolInfo> {
        try {
            // TODO: Re-enable when Distribution ABI has proper pool data methods
            // const pool = await this.publicClient.readContract({
            //     address: this.getDistributionContractAddress(),
            //     abi: DISTRIBUTION_ABI,
            //     functionName: 'getPool',
            //     args: [BigInt(poolId)]
            // });
            
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
        } catch (error) {
            console.error('Error fetching distribution pool info:', error);
            return {
                id: poolId.toString(),
                name: `Pool ${poolId}`,
                totalDeposited: 0n,
                totalVirtualDeposited: 0n,
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
    }

    /**
     * Claim rewards from Distribution pool
     */
    async claimDistributionRewards(poolId: number): Promise<Hash> {
        if (!this.walletClient) {
            throw new Error('Wallet client required for transactions');
        }
        
        const txHash = await this.walletClient.writeContract({
            address: this.getDistributionContractAddress(),
            abi: DISTRIBUTION_ABI,
            functionName: 'claim',
            args: [BigInt(poolId)] as any,
            chain: undefined,
            account: this.walletClient.account!
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
        
        const txHash = await this.walletClient.writeContract({
            address: this.getDistributionContractAddress(),
            abi: DISTRIBUTION_ABI,
            functionName: 'withdraw',
            args: [BigInt(poolId), amount] as any,
            chain: undefined,
            account: this.walletClient.account!
        });
        
        return txHash;
    }

    /**
     * Create a custom Builder pool
     */
    async createBuilderPool(
        name: string,
        initialDeposit: bigint,
        claimLockEnd: bigint,
        rewardSplit: bigint = BigInt(50) // Default 50% reward split
    ): Promise<Hash> {
        if (!this.walletClient) {
            throw new Error('Wallet client required for transactions');
        }
        
        const txHash = await this.walletClient.writeContract({
            address: this.getBuilderContractAddress(),
            abi: BUILDER_ABI,
            functionName: 'createBuilderPool',
            args: [name, initialDeposit, claimLockEnd, rewardSplit],
            chain: undefined,
            account: this.walletClient.account!
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
        
        const txHash = await this.walletClient.writeContract({
            address: this.getBuilderContractAddress(),
            abi: BUILDER_ABI,
            functionName: 'stake',
            args: [poolId as Hash, amount],
            chain: undefined,
            account: this.walletClient.account!
        });
        
        return txHash;
    }

    /**
     * Get Builder pool information
     */
    async getBuilderPoolInfo(poolId: string): Promise<BuilderPoolInfo> {
        const pool = await this.publicClient.readContract({
            address: this.getBuilderContractAddress(),
            abi: BUILDER_ABI,
            functionName: 'builderPools',
            args: [poolId as Hash]
        });
        
        const poolData = await this.publicClient.readContract({
            address: this.getBuilderContractAddress(),
            abi: BUILDER_ABI,
            functionName: 'buildersPoolData',
            args: [poolId as Hash]
        });
        
        const poolArray = pool as any[];
        const poolDataArray = poolData as any[];
        
        return {
            poolId,
            name: poolArray[0],
            admin: poolArray[1],
            poolStart: poolArray[2],
            withdrawLockPeriodAfterDeposit: poolArray[3],
            claimLockEnd: poolArray[4],
            minimalDeposit: poolArray[5],
            totalDeposited: poolDataArray[1],
            totalVirtualDeposited: poolDataArray[2]
        };
    }

    /**
     * Get user's Builder pool stake info
     */
    async getBuilderStakeInfo(poolId: string, userAddress: Address): Promise<StakeInfo> {
        const userData = await this.publicClient.readContract({
            address: this.getBuilderContractAddress(),
            abi: BUILDER_ABI,
            functionName: 'usersData' as any,
            args: [userAddress, poolId as Hash] as any
        });
        
        const pendingRewards = await this.publicClient.readContract({
            address: this.getBuilderContractAddress(),
            abi: BUILDER_ABI,
            functionName: 'getCurrentUserReward' as any,
            args: [poolId as Hash, userAddress] as any
        });
        
        const userDataArray = userData as any[];
        
        return {
            amount: userDataArray[2], // deposited
            lockEndTime: userDataArray[1], // claimLockStart  
            isLocked: userDataArray[1] > BigInt(Math.floor(Date.now() / 1000)),
            pendingRewards: pendingRewards as bigint,
            poolId: 0 // Builder pools don't use numeric IDs
        };
    }

    /**
     * Get all available Distribution pools
     */
    async getAvailableDistributionPools(): Promise<PoolInfo[]> {
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