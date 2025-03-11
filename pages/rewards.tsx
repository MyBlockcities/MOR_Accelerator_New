import { type NextPage } from 'next';
import Head from 'next/head';
import { useAccount } from 'wagmi';
import MainLayout from '../components/layout/MainLayout';
import { RewardsTracker } from '../components/RewardsTracker';
import LoadingState from '../components/common/LoadingState';
import { useBuilderContract } from '../hooks/useBuilderContract';
import { useStakingContract } from '../hooks/useStakingContract';
import { useEffect, useState } from 'react';

interface RewardsStats {
    totalDistributed: string;
    totalPending: string;
    yourTotalClaimed: string;
    yourPendingRewards: string;
    recentClaims: {
        amount: string;
        timestamp: number;
        txHash: string;
    }[];
}

const Rewards: NextPage = () => {
    const { address, isConnected } = useAccount();
    const { contract: builderContract } = useBuilderContract();
    const { contract: stakingContract } = useStakingContract();
    const [stats, setStats] = useState<RewardsStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            if (!builderContract || !stakingContract || !isConnected) {
                setLoading(false);
                return;
            }
            
            try {
                const [
                    totalDistributed,
                    totalPending,
                    userClaimed,
                    userPending,
                    recentClaimEvents
                ] = await Promise.all([
                    builderContract.getTotalDistributedRewards(),
                    builderContract.getTotalPendingRewards(),
                    builderContract.getUserClaimedRewards(address),
                    stakingContract.getPendingRewards(address),
                    builderContract.queryFilter(
                        builderContract.filters.RewardsClaimed(address),
                        -1000
                    )
                ]);

                const recentClaims = recentClaimEvents.map(event => ({
                    amount: event.args.amount.toString(),
                    timestamp: event.args.timestamp.toNumber(),
                    txHash: event.transactionHash
                }));

                setStats({
                    totalDistributed: totalDistributed.toString(),
                    totalPending: totalPending.toString(),
                    yourTotalClaimed: userClaimed.toString(),
                    yourPendingRewards: userPending.toString(),
                    recentClaims
                });
            } catch (error) {
                console.error('Error loading rewards stats:', error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, [builderContract, stakingContract, isConnected, address]);

    if (loading) {
        return (
            <MainLayout>
                <LoadingState message="Loading rewards information..." />
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head>
                <title>Rewards | MOR Protocol</title>
                <meta name="description" content="Track and claim your rewards in the MOR Protocol" />
            </Head>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Rewards Dashboard</h1>
                {!isConnected ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600 dark:text-gray-400">Please connect your wallet to view rewards</p>
                    </div>
                ) : (
                    <RewardsTracker />
                )}
            </div>
        </MainLayout>
    );
};

export default Rewards; 