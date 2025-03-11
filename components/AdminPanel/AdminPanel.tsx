import React, { useState, useEffect, useCallback } from 'react';
import { BigNumber } from 'ethers';
import { useNetwork, useAccount } from 'wagmi';
import { useBuilderContract } from '../../hooks/useBuilderContract';
import { useTreasuryContract } from '../../hooks/useTreasuryContract';
import { handleContractError } from '../../utils/contractErrors';
import { SUPPORTED_CHAINS, isNetworkSupported } from '../../utils/networkSwitching';
import { BuilderPool } from '../../contracts/types/contracts';
import { utils } from 'ethers';

interface AdminStats {
    totalPools: number;
    totalStaked: BigNumber;
    totalRewards: BigNumber;
}

const AdminPanel = () => {
    const { chain } = useNetwork();
    const { address } = useAccount();
    const [builderPools, setBuilderPools] = useState<BuilderPool[]>([]);
    const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const builderContract = useBuilderContract(chain?.id || SUPPORTED_CHAINS.ARBITRUM);
    const treasuryContract = useTreasuryContract(chain?.id || SUPPORTED_CHAINS.ARBITRUM);

    const loadBuilderPools = useCallback(async () => {
        if (!builderContract || !treasuryContract || !chain?.id || !isNetworkSupported(chain.id)) return;

        try {
            setLoading(true);
            setError(null);

            // Get all pool creation events
            const filter = builderContract.filters.BuilderPoolCreated();
            const events = await builderContract.queryFilter(filter);

            // Load pool details
            const pools = await Promise.all(
                events.map(async (event) => {
                    const poolId = event.args?.[0];
                    return builderContract.getBuilderPool(poolId);
                })
            );

            // Calculate admin stats
            const stats: AdminStats = {
                totalPools: pools.length,
                totalStaked: pools.reduce((acc, pool) => acc.add(pool.totalStaked), BigNumber.from(0)),
                totalRewards: BigNumber.from(0)
            };

            // Get total rewards from treasury
            for (const event of events) {
                const poolId = event.args?.[0];
                const rewards = await treasuryContract.getBuilderRewards(poolId);
                stats.totalRewards = stats.totalRewards.add(rewards);
            }

            setBuilderPools(pools);
            setAdminStats(stats);
        } catch (err: any) {
            const contractError = handleContractError(err);
            setError(contractError.message);
        } finally {
            setLoading(false);
        }
    }, [builderContract, treasuryContract, chain]);

    useEffect(() => {
        loadBuilderPools();
        // Refresh every 30 seconds
        const interval = setInterval(loadBuilderPools, 30000);
        return () => clearInterval(interval);
    }, [loadBuilderPools]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">Builder Pool Administration</h2>

            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {adminStats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-600">Total Pools</h3>
                        <p className="text-3xl font-bold text-blue-600">{adminStats.totalPools}</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-600">Total Staked</h3>
                        <p className="text-3xl font-bold text-blue-600">
                            {utils.formatEther(adminStats.totalStaked)} MOR
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-600">Total Rewards</h3>
                        <p className="text-3xl font-bold text-blue-600">
                            {utils.formatEther(adminStats.totalRewards)} MOR
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {builderPools.map((pool, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold">{pool.name}</h3>
                                <p className="text-sm text-gray-500">Owner: {pool.owner}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded text-sm ${
                                    pool.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {pool.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Total Staked</p>
                                <p className="font-semibold">{utils.formatEther(pool.totalStaked)} MOR</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Reward Split</p>
                                <p className="font-semibold">{pool.rewardSplit.toString()}%</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Lock Period</p>
                                <p className="font-semibold">{Math.floor(pool.lockPeriod.toNumber() / 86400)} days</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Last Reward Claim</p>
                                <p className="font-semibold">
                                    {new Date(pool.lastRewardClaim.toNumber() * 1000).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPanel;