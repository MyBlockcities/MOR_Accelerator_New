import { useCallback, useMemo } from 'react';
import { usePublicClient, useWalletClient, useChainId } from 'wagmi';
import { type Address, type Hash, parseEther, formatEther } from 'viem';
import { NETWORK_CONFIG } from '../contracts/config/networks';
import { handleContractError } from '../utils/contractErrors';

interface CreatePoolParams {
  name: string;
  minStake: string;
  maxStake: string;
  apr: string;
  description: string;
}

interface PoolData {
  id: string;
  name: string;
  owner: Address;
  token: Address;
  maxParticipants: number;
  totalStaked: bigint;
  minStake: bigint;
  maxStake: bigint;
  isActive: boolean;
  apr?: number;
  status?: 'active' | 'paused' | 'closed';
  description?: string;
  rewardRate?: bigint;
  lockPeriod?: number;
}

type PoolStatus = 'active' | 'paused' | 'closed';
const POOL_STATUSES: PoolStatus[] = ['active', 'paused', 'closed'];

export function useBuilderPool() {
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const contract = useMemo(() => {
    if (!publicClient) return null;

    const network = Object.values(NETWORK_CONFIG).find(
      (config) => config.chainId === chainId
    );
    if (!network) return null;

    return {
      address: network.contracts.builder as Address,
      publicClient,
      walletClient
    };
  }, [chainId, publicClient, walletClient]);

  const createPool = useCallback(
    async (params: CreatePoolParams): Promise<Hash> => {
      if (!contract || !walletClient || !publicClient) {
        throw new Error('Contract not initialized');
      }

      try {
        const { request } = await publicClient.simulateContract({
          address: contract.address,
          abi: [
            {
              inputs: [
                { name: 'name', type: 'string' },
                { name: 'minStake', type: 'uint256' },
                { name: 'maxStake', type: 'uint256' },
                { name: 'apr', type: 'uint256' },
                { name: 'description', type: 'string' }
              ],
              name: 'createPool',
              outputs: [{ name: 'poolId', type: 'bytes32' }],
              stateMutability: 'nonpayable',
              type: 'function'
            }
          ],
          functionName: 'createPool',
          args: [
            params.name,
            parseEther(params.minStake),
            parseEther(params.maxStake),
            BigInt(Math.floor(Number(params.apr) * 100)), // Convert APR to basis points
            params.description
          ]
        });

        return await walletClient.writeContract(request);
      } catch (error) {
        throw handleContractError(error);
      }
    },
    [contract, publicClient, walletClient]
  );

  const getPool = useCallback(
    async (poolId: string): Promise<PoolData> => {
      if (!contract || !publicClient) {
        throw new Error('Contract not initialized');
      }

      try {
        // TODO: Replace with actual contract method when available
        // Current contract doesn't have getPool method, so we return mock data
        console.warn('getPool: Using mock data - contract lacks getPool method');
        
        // Return mock pool data based on poolId
        const mockPool: PoolData = {
          id: poolId,
          name: poolId.includes('1234') ? 'Main Builder Pool' : 'High Yield Pool',
          owner: contract.address,
          token: contract.address,
          maxParticipants: 100,
          totalStaked: BigInt('1000000000000000000000'), // 1000 MOR
          minStake: BigInt('100000000000000000000'), // 100 MOR
          maxStake: BigInt('10000000000000000000000'), // 10000 MOR
          isActive: true,
          apr: 15,
          status: 'active',
          description: 'Mock pool for testing',
          rewardRate: BigInt('150'),
          lockPeriod: 30
        };

        return mockPool;
      } catch (error) {
        console.error('Error in getPool:', error);
        throw handleContractError(error);
      }
    },
    [contract, publicClient]
  );

  const getPools = useCallback(async (): Promise<PoolData[]> => {
    if (!contract || !publicClient) {
      throw new Error('Contract not initialized');
    }

    try {
      // TODO: Replace with actual contract method when available
      // Current contract doesn't have pool discovery methods, so we return mock data
      console.warn('getPools: Using mock data - contract lacks pool discovery methods');
      
      // Return mock pools for testing
      const mockPools: PoolData[] = [
        {
          id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          name: 'Main Builder Pool',
          owner: contract.address,
          token: contract.address,
          maxParticipants: 100,
          totalStaked: BigInt('1000000000000000000000'), // 1000 MOR
          minStake: BigInt('100000000000000000000'), // 100 MOR
          maxStake: BigInt('10000000000000000000000'), // 10000 MOR
          isActive: true,
          apr: 15,
          status: 'active',
          description: 'Main staking pool for builders',
          rewardRate: BigInt('150'),
          lockPeriod: 30
        },
        {
          id: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          name: 'High Yield Pool',
          owner: contract.address,
          token: contract.address,
          maxParticipants: 50,
          totalStaked: BigInt('500000000000000000000'), // 500 MOR
          minStake: BigInt('500000000000000000000'), // 500 MOR
          maxStake: BigInt('5000000000000000000000'), // 5000 MOR
          isActive: true,
          apr: 25,
          status: 'active',
          description: 'High yield staking pool with higher returns',
          rewardRate: BigInt('250'),
          lockPeriod: 60
        }
      ];
      
      return mockPools;
    } catch (error) {
      console.error('Error in getPools:', error);
      // Return empty array on error to prevent crashes
      return [];
    }
  }, [contract, publicClient]);

  return {
    createPool,
    getPool,
    getPools
  };
} 