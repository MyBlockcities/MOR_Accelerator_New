import { type NextPage } from 'next';
import Head from 'next/head';
import { useAccount } from 'wagmi';
import { type Address, formatEther } from 'viem';
import MainLayout from '../components/layout/MainLayout';
import { RewardsTracker } from '../components/RewardsTracker';
import LoadingState from '../components/common/LoadingState';
import { useBuilderContract } from '../hooks/useBuilderContract';
import { useStakingContract } from '../hooks/useStakingContract';
import { useMORToken } from '../hooks/useMORToken';
import { useEffect, useState } from 'react';
import ClientOnly from '../components/common/ClientOnly';
import { toast } from 'react-hot-toast';
import ImprovedConnectWallet from '../components/ConnectWallet/ImprovedConnectWallet';

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

    // Mock data for demonstration
    useEffect(() => {
        if (isClient && isConnected) {
            // Simulate loading data
            const timer = setTimeout(() => {
                setStats({
                    totalDistributed: '1000000000000000000000',  // 1000 MOR
                    totalPending: '500000000000000000000',       // 500 MOR
                    yourTotalClaimed: '100000000000000000000',   // 100 MOR
                    yourPendingRewards: '50000000000000000000',  // 50 MOR
                    recentClaims: [
                        {
                            amount: '50000000000000000000',
                            timestamp: Date.now() - 86400000, // Yesterday
                            txHash: '0x1234567890123456789012345678901234567890123456789012345678901234'
                        }
                    ]
                });
                setLoading(false);
            }, 1000);
            
            return () => clearTimeout(timer);
        } else if (isClient) {
            setLoading(false);
        }
    }, [isClient, isConnected]);

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
                <h1 className="text-3xl font-bold mb-8 text-white">Rewards Dashboard</h1>
                <ClientOnly fallback={<div className="text-center py-6">Loading rewards data...</div>}>
                    {!isConnected ? (
                        <div className="glassmorphism p-8 rounded-xl text-center max-w-2xl mx-auto">
                            <h2 className="text-2xl font-semibold text-white mb-6">Connect Your Wallet</h2>
                            <p className="text-gray-300 mb-8">
                                Connect your wallet to view and claim your rewards
                            </p>
                            <div className="flex justify-center">
                                <ImprovedConnectWallet />
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* MOR Balance Card */}
                            {formattedBalance && (
                                <div className="glassmorphism p-6 rounded-xl mb-8 border border-gray-700/30 backdrop-blur-lg">
                                    <h2 className="text-xl font-semibold mb-4 text-white">Your MOR Balance</h2>
                                    <div className="flex items-center">
                                        <div className="bg-purple-900/50 p-3 rounded-full mr-4 border border-purple-500/30">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Available Balance</p>
                                            <p className="text-2xl font-bold text-white">{formattedBalance} <span className="text-purple-400">MOR</span></p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Rewards Tracker with updated styling */}
                            <div className="mb-8">
                                <RewardsTracker />
                            </div>
                            
                            {/* Stats Cards */}
                            {stats && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                                    <div className="glassmorphism border border-indigo-500/20 rounded-xl p-6 hover:border-indigo-500/40 transition-all duration-300 backdrop-blur-lg">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-medium text-gray-300">Total Rewards Distributed</h3>
                                            <div className="bg-indigo-900/40 p-2 rounded-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-3xl font-bold text-white">
                                            {formatEther(BigInt(stats.totalDistributed || '0'))} <span className="text-indigo-400">MOR</span>
                                        </p>
                                    </div>
                                    <div className="glassmorphism border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-300 backdrop-blur-lg">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-medium text-gray-300">Total Pending Rewards</h3>
                                            <div className="bg-green-900/40 p-2 rounded-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-3xl font-bold text-white">
                                            {formatEther(BigInt(stats.totalPending || '0'))} <span className="text-green-400">MOR</span>
                                        </p>
                                    </div>
                                    <div className="glassmorphism border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all duration-300 backdrop-blur-lg">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-medium text-gray-300">Your Total Claimed</h3>
                                            <div className="bg-blue-900/40 p-2 rounded-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-3xl font-bold text-white">
                                            {formatEther(BigInt(stats.yourTotalClaimed || '0'))} <span className="text-blue-400">MOR</span>
                                        </p>
                                    </div>
                                    <div className="glassmorphism border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all duration-300 backdrop-blur-lg">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-medium text-gray-300">Your Pending Rewards</h3>
                                            <div className="bg-yellow-900/40 p-2 rounded-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-3xl font-bold text-white">
                                            {formatEther(BigInt(stats.yourPendingRewards || '0'))} <span className="text-yellow-400">MOR</span>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Recent Claims Section */}
                            {stats && stats.recentClaims.length > 0 && (
                                <div className="mt-12">
                                    <h2 className="text-2xl font-bold mb-6 text-white">Recent Claims</h2>
                                    <div className="glassmorphism rounded-xl overflow-hidden border border-gray-700/30">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-700/30">
                                                <thead>
                                                    <tr>
                                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Transaction</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-700/30">
                                                    {stats.recentClaims.map((claim, index) => (
                                                        <tr key={index}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                                {formatEther(BigInt(claim.amount))} <span className="text-purple-400">MOR</span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                                {new Date(claim.timestamp).toLocaleString()}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                <a 
                                                                    href={`https://arbiscan.io/tx/${claim.txHash}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                                                >
                                                                    {claim.txHash.substring(0, 6)}...{claim.txHash.substring(claim.txHash.length - 6)}
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </ClientOnly>
            </div>
        </MainLayout>
    );
};

export default Rewards;
