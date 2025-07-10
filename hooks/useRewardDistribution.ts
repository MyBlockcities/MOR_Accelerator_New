import { useCallback, useMemo } from 'react';
import { REWARD_DISTRIBUTION, LIQUIDITY_RULES, MINIMUM_STAKING_THRESHOLD } from '../contracts/config/rewardDistribution';
import { type Address } from 'viem';
import { useAccount } from 'wagmi';
import { useMORToken } from './useMORToken';

/**
 * Hook for managing reward distribution and liquidity rules
 */
export function useRewardDistribution() {
  const { address } = useAccount();
  const { getBalance } = useMORToken();

  // Get reward distribution percentages
  const getRewardDistribution = useCallback(() => {
    return REWARD_DISTRIBUTION;
  }, []);

  // Check if user meets minimum staking threshold
  const meetsMinimumStakingThreshold = useCallback(async () => {
    if (!address) return false;
    try {
      const balance = await getBalance(address);
      const formattedBalance = (balance / BigInt(10**18)).toString(); // Convert from wei to MOR
      return parseFloat(formattedBalance) >= parseFloat(MINIMUM_STAKING_THRESHOLD);
    } catch (error) {
      console.error('Error checking minimum staking threshold:', error);
      return false;
    }
  }, [address, getBalance]);

  // Calculate reward amounts based on total rewards
  const calculateRewardAmounts = useCallback((totalRewards: bigint) => {
    return {
      stakersAmount: (totalRewards * BigInt(REWARD_DISTRIBUTION.STAKERS)) / BigInt(100),
      maintainerAmount: (totalRewards * BigInt(REWARD_DISTRIBUTION.MAINTAINER)) / BigInt(100),
      mentorsAmount: (totalRewards * BigInt(REWARD_DISTRIBUTION.MENTORS)) / BigInt(100),
      operationsAmount: (totalRewards * BigInt(REWARD_DISTRIBUTION.OPERATIONS)) / BigInt(100),
    };
  }, []);

  // Check if wallet is a maintainer and calculate required staking amount
  const calculateMaintainerStakingRequirement = useCallback(
    (isMaintainer: boolean, totalMaintainerBalance: bigint) => {
      if (!isMaintainer) return BigInt(0);
      
      // 50% of maintainer rewards must be staked
      return (totalMaintainerBalance * BigInt(LIQUIDITY_RULES.MAINTAINER.STAKED)) / BigInt(100);
    },
    []
  );

  // Check if maintainer meets staking requirements
  const maintainerMeetsStakingRequirement = useCallback(
    (isMaintainer: boolean, totalMaintainerBalance: bigint, stakedAmount: bigint) => {
      if (!isMaintainer) return true;
      
      const requiredStaking = calculateMaintainerStakingRequirement(isMaintainer, totalMaintainerBalance);
      return stakedAmount >= requiredStaking;
    },
    [calculateMaintainerStakingRequirement]
  );

  // Get liquidity rules for a specific wallet type
  const getLiquidityRules = useCallback((walletType: 'MAINTAINER' | 'MENTORS' | 'OPERATIONS') => {
    return LIQUIDITY_RULES[walletType];
  }, []);

  return {
    rewardDistribution: REWARD_DISTRIBUTION,
    liquidityRules: LIQUIDITY_RULES,
    minimumStakingThreshold: MINIMUM_STAKING_THRESHOLD,
    meetsMinimumStakingThreshold,
    calculateRewardAmounts,
    calculateMaintainerStakingRequirement,
    maintainerMeetsStakingRequirement,
    getLiquidityRules
  };
}
