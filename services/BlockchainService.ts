import { 
  type Address, 
  type Hash, 
  type PublicClient, 
  type WalletClient,
  type Account,
  getContract,
  formatEther
} from 'viem';
import { NETWORK_CONFIG } from '../config/networks';
import { BUILDER_ABI } from '../contracts/abis/MorpheusBuilder';
// TODO: Re-enable when ABIs are available
// import { TREASURY_ABI } from '../contracts/abis/MorpheusTreasury';
// import { FEE_CONFIG_ABI } from '../contracts/abis/FeeConfig';
// import { FEATURE_MARKET_ABI } from '../contracts/abis/FeatureMarket';

/**
 * Centralized service for blockchain interactions using viem/wagmi
 * This replaces the ethers.js based ContractService
 */
export class BlockchainService {
  private publicClient: PublicClient;
  private walletClient: WalletClient | null;

  constructor(publicClient: PublicClient, walletClient: WalletClient | null = null) {
    this.publicClient = publicClient;
    this.walletClient = walletClient;
  }

  /**
   * Set or update the wallet client
   */
  setWalletClient(walletClient: WalletClient | null) {
    this.walletClient = walletClient;
  }

  /**
   * Get builder contract instance
   */
  getBuilderContract(chainId: number) {
    const network = this.getNetworkByChainId(chainId);
    return getContract({
      address: network.contracts.builders as Address,
      abi: BUILDER_ABI,
      client: this.publicClient
    });
  }

  /**
   * Get treasury contract instance
   */
  getTreasuryContract(chainId: number) {
    const network = this.getNetworkByChainId(chainId);
    // TODO: Import TREASURY_ABI when available
    throw new Error('Treasury contract not available - ABI missing');
  }

  /**
   * Get fee config contract instance
   */
  getFeeConfigContract(chainId: number) {
    const network = this.getNetworkByChainId(chainId);
    // TODO: Import FEE_CONFIG_ABI when available
    throw new Error('Fee config contract not available - ABI missing');
  }

  /**
   * Get feature market contract instance
   */
  getFeatureMarketContract(chainId: number) {
    const featureMarketAddress = this.getFeatureMarketAddress(chainId);
    if (!featureMarketAddress) {
      throw new Error(`Feature market address not found for chain ID ${chainId}`);
    }
    
    // TODO: Import FEATURE_MARKET_ABI when available
    throw new Error('Feature market contract not available - ABI missing');
  }

  /**
   * Create a builder pool
   */
  async createBuilderPool(
    chainId: number,
    name: string,
    initialStake: bigint,
    lockPeriod: number,
    rewardSplit: number
  ): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet client not initialized');
    }

    const contract = this.getBuilderContract(chainId);
    if (!this.walletClient.account) {
      throw new Error('Wallet account not initialized');
    }

    const { request } = await contract.simulate.createBuilderPool([
      name,
      initialStake,
      BigInt(lockPeriod),
      BigInt(rewardSplit)
    ], {
      account: this.walletClient.account.address
    });

    // Add account to the request to fix TypeScript errors
    if (!this.walletClient.account) {
      throw new Error('Wallet account not initialized');
    }
    
    return this.walletClient.writeContract({
      ...request,
      account: this.walletClient.account
    });
  }

  /**
   * Stake tokens in a builder pool
   */
  async stake(chainId: number, builderId: string, amount: bigint): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet client not initialized');
    }

    const contract = this.getBuilderContract(chainId);
    if (!this.walletClient.account) {
      throw new Error('Wallet account not initialized');
    }

    const { request } = await contract.simulate.stake([builderId as Address, amount], {
      account: this.walletClient.account.address
    });

    // Add account to the request to fix TypeScript errors
    if (!this.walletClient.account) {
      throw new Error('Wallet account not initialized');
    }
    
    return this.walletClient.writeContract({
      ...request,
      account: this.walletClient.account
    });
  }

  /**
   * Unstake tokens from a builder pool
   */
  async unstake(chainId: number, builderId: string, amount: bigint): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet client not initialized');
    }

    const contract = this.getBuilderContract(chainId);
    if (!this.walletClient.account) {
      throw new Error('Wallet account not initialized');
    }

    const { request } = await contract.simulate.unstake([builderId as Address, amount], {
      account: this.walletClient.account.address
    });

    // Add account to the request to fix TypeScript errors
    if (!this.walletClient.account) {
      throw new Error('Wallet account not initialized');
    }
    
    return this.walletClient.writeContract({
      ...request,
      account: this.walletClient.account
    });
  }

  /**
   * Claim rewards from a builder pool
   */
  async claimRewards(chainId: number, builderId: string): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet client not initialized');
    }

    const contract = this.getBuilderContract(chainId);
    if (!this.walletClient.account) {
      throw new Error('Wallet account not initialized');
    }

    const { request } = await contract.simulate.claimRewards([builderId as Address], {
      account: this.walletClient.account.address
    });

    // Add account to the request to fix TypeScript errors
    if (!this.walletClient.account) {
      throw new Error('Wallet account not initialized');
    }
    
    return this.walletClient.writeContract({
      ...request,
      account: this.walletClient.account
    });
  }

  /**
   * Create a proposal in the feature market
   */
  async createProposal(
    chainId: number,
    title: string,
    description: string,
    budget: bigint,
    deadline: number,
    stakeAmount: bigint,
    milestones: number
  ): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet client not initialized');
    }

    // TODO: Re-enable when feature market contract is available
    throw new Error('Feature market contract not available');
  }

  /**
   * Submit a bid for a proposal
   */
  async submitBid(
    chainId: number,
    proposalId: string,
    amount: bigint,
    timeEstimate: number,
    proposal: string,
    stakeAmount: bigint
  ): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet client not initialized');
    }

    // TODO: Re-enable when feature market contract is available
    throw new Error('Feature market contract not available');
  }

  // Private helper methods
  private getNetworkByChainId(chainId: number) {
    const network = Object.values(NETWORK_CONFIG).find(
      (config) => config.id === chainId
    );
    
    if (!network) {
      throw new Error(`Network with chain ID ${chainId} not supported`);
    }
    
    return network;
  }

  private getFeatureMarketAddress(chainId: number): string | undefined {
    // This would be replaced with actual addresses from environment or config
    const featureMarketAddresses: Record<number, string> = {
      42161: process.env.NEXT_PUBLIC_FEATURE_MARKET_ADDRESS_ARBITRUM || '',
      8453: process.env.NEXT_PUBLIC_FEATURE_MARKET_ADDRESS_BASE || '',
      // Default to the generic environment variable if chain-specific ones aren't available
      1: process.env.NEXT_PUBLIC_FEATURE_MARKET_ADDRESS || '',
    };
    
    return featureMarketAddresses[chainId] || process.env.NEXT_PUBLIC_FEATURE_MARKET_ADDRESS;
  }

  /**
   * Get all proposals from the feature market
   */
  async getAllProposals(chainId: number): Promise<any[]> {
    // TODO: Re-enable when feature market contract is available
    throw new Error('Feature market contract not available');
  }
  
  /**
   * Get a specific proposal by ID
   */
  async getProposal(chainId: number, proposalId: string): Promise<any> {
    // TODO: Re-enable when feature market contract is available
    throw new Error('Feature market contract not available');
  }
  
  /**
   * Get bids for a specific proposal
   */
  async getBidsForProposal(chainId: number, proposalId: string): Promise<any[]> {
    // TODO: Re-enable when feature market contract is available
    throw new Error('Feature market contract not available');
  }
  
  /**
   * Accept a bid for a proposal
   */
  async acceptBid(chainId: number, proposalId: string, bidderAddress: string): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet client not initialized');
    }
    
    // TODO: Re-enable when feature market contract is available
    throw new Error('Feature market contract not available');
  }
  
  /**
   * Complete a milestone for a proposal
   */
  async completeMilestone(chainId: number, proposalId: string, milestoneId: string): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet client not initialized');
    }
    
    // TODO: Re-enable when feature market contract is available
    throw new Error('Feature market contract not available');
  }
  
  /**
   * Get builder information
   */
  async getBuilderInfo(chainId: number, builderId: string, userAddress?: string): Promise<any> {
    // TODO: Re-enable when proper builder contract methods are available
    throw new Error('Builder contract read methods not available');
  }

  /**
   * Get builder rewards
   */
  async getBuilderRewards(chainId: number, builderId: string, userAddress: string): Promise<string> {
    // TODO: Re-enable when proper builder contract methods are available
    throw new Error('Builder contract read methods not available');
  }
}

// Export a hook for using the blockchain service
export function useBlockchainService(publicClient: PublicClient, walletClient: WalletClient | null = null) {
  return new BlockchainService(publicClient, walletClient);
}
