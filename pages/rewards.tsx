import { type NextPage } from 'next';
import Head from 'next/head';
import { useAccount } from 'wagmi';
import MainLayout from '../components/layout/MainLayout';
import { RewardsTracker } from '../components/RewardsTracker';
import LoadingState from '../components/common/LoadingState';
import { useBuilderContract } from '../hooks/useBuilderContract';
import { useStakingContract } from '../hooks/useStakingContract';
import { useMORToken } from '../hooks/useMORToken';
import { useEffect, useState } from 'react';
import ClientOnly from '../components/common/ClientOnly';
import { formatEther } from 'viem';
import { toast } from 'react-hot-toast';

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
    const { formattedBalance, loading: tokenLoading } = useMORToken();
    const [stats, setStats] = useState<RewardsStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);
    
    // Fix hydration issues - only render on client
    useEffect(() => {
        setIsClient(true);
    }, []);

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

                // Handle potential null/undefined values more safely
                const recentClaims = (recentClaimEvents || []).map(event => ({
                    amount: event.args?.amount?.toString() || '0',
                    timestamp: event.args?.timestamp?.toNumber() || Date.now(),
                    txHash: event.transactionHash || ''
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
                toast.error('Failed to load rewards data');
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, [builderContract, stakingContract, isConnected, address]);

    if (loading || tokenLoading || !isClient) {
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
                <ClientOnly fallback={<div className="text-center py-6">Loading rewards data...</div>}>
                    {/* MOR Balance Card */}
                    {isConnected && formattedBalance && (
                        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Your MOR Balance</h2>
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-3 rounded-full mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Available Balance</p>
                                    <p className="text-2xl font-bold">{formattedBalance} MOR</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {!isConnected ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600 dark:text-gray-400">Please connect your wallet to view rewards</p>
                        </div>
                    ) : (
                        <RewardsTracker />
                    )}
                    
                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                            <div className="bg-white shadow-md rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-700">Total Rewards Distributed</h3>
                                <p className="mt-2 text-3xl font-bold text-indigo-600">
                                    {formatEther(BigInt(stats.totalDistributed || '0'))} MOR
                                </p>
                            </div>
                            <div className="bg-white shadow-md rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-700">Total Pending Rewards</h3>
                                <p className="mt-2 text-3xl font-bold text-green-600">
                                    {formatEther(BigInt(stats.totalPending || '0'))} MOR
                                </p>
                            </div>
                            <div className="bg-white shadow-md rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-700">Your Total Claimed</h3>
                                <p className="mt-2 text-3xl font-bold text-blue-600">
                                    {formatEther(BigInt(stats.yourTotalClaimed || '0'))} MOR
                                </p>
                            </div>
                            <div className="bg-white shadow-md rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-700">Your Pending Rewards</h3>
                                <p className="mt-2 text-3xl font-bold text-yellow-600">
                                    {formatEther(BigInt(stats.yourPendingRewards || '0'))} MOR
                                </p>
                            </div>
                        </div>
                    )}
                </ClientOnly>
            </div>
        </MainLayout>
    );
};

export default Rewards;
