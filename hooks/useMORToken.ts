import { useCallback, useMemo } from 'react';
import { 
  Address,
  Hash,
  getContract,
  type PublicClient
} from 'viem';
import { usePublicClient, useWalletClient, useChainId } from 'wagmi';
import { MOR_TOKEN_ABI } from '../contracts/abis/MorToken';

// Define MOR token addresses by chain ID
const MOR_TOKEN_ADDRESSES: Record<number, Address> = {
  1: process.env.NEXT_PUBLIC_MOR_TOKEN_ETHEREUM as Address, // Ethereum
  42161: process.env.NEXT_PUBLIC_MOR_TOKEN_ARBITRUM as Address, // Arbitrum
  8453: process.env.NEXT_PUBLIC_MOR_TOKEN_BASE as Address, // Base
  // Add testnet addresses if needed
  421614: process.env.NEXT_PUBLIC_MOR_TOKEN_ARBITRUM_TESTNET as Address || '0x0000000000000000000000000000000000000000' as Address, // Arbitrum Sepolia
  84531: process.env.NEXT_PUBLIC_MOR_TOKEN_BASE_TESTNET as Address || '0x0000000000000000000000000000000000000000' as Address, // Base Goerli
};

export function useMORToken(providedChainId?: number) {
  const chainId = useChainId();
  const publicClient = usePublicClient({
    chainId: providedChainId || chainId
  });
  const { data: walletClient } = useWalletClient();
  
  // Use the provided chainId or fallback to the connected chain
  const effectiveChainId = providedChainId || chainId;

  // Get the token address for the current chain
  const tokenAddress = useMemo(() => {
    return MOR_TOKEN_ADDRESSES[effectiveChainId] || '0x0000000000000000000000000000000000000000' as Address;
  }, [effectiveChainId]);

  // Initialize the contract
  const tokenContract = useMemo(() => {
    if (!publicClient || !tokenAddress) return null;

    return getContract({
      address: tokenAddress,
      abi: MOR_TOKEN_ABI,
      client: publicClient as PublicClient,
    });
  }, [publicClient, tokenAddress]);

  // Approve tokens for spending
  const approve = useCallback(
    async (spender: Address, amount: bigint): Promise<Hash> => {
      if (!tokenContract || !walletClient) {
        throw new Error('Token contract not initialized or wallet not connected');
      }

      const { request } = await tokenContract.simulate.approve([spender, amount], {
        account: walletClient.account.address,
      });

      return walletClient.writeContract(request);
    },
    [tokenContract, walletClient]
  );

  // Get token balance
  const getBalance = useCallback(
    async (address: Address): Promise<bigint> => {
      if (!tokenContract) {
        throw new Error('Token contract not initialized');
      }

      const result = await tokenContract.read.balanceOf([address]);
      return result as bigint;
    },
    [tokenContract]
  );

  // Get token allowance
  const getAllowance = useCallback(
    async (owner: Address, spender: Address): Promise<bigint> => {
      if (!tokenContract) {
        return BigInt(0);
      }

      const result = await tokenContract.read.allowance([owner, spender]);
      return result as bigint;
    },
    [tokenContract]
  );

  // Transfer tokens
  const transfer = useCallback(
    async (to: Address, amount: bigint): Promise<Hash> => {
      if (!tokenContract || !walletClient) {
        throw new Error('Token contract not initialized or wallet not connected');
      }

      const { request } = await tokenContract.simulate.transfer([to, amount], {
        account: walletClient.account.address,
      });

      return walletClient.writeContract(request);
    },
    [tokenContract, walletClient]
  );

  return {
    tokenContract,
    tokenAddress,
    approve,
    getBalance,
    getAllowance,
    transfer,
  };
}

export default useMORToken;
