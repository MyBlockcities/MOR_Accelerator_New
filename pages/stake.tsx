import type { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { StakingInterface } from '../components/StakingInterface';
import { LoadingState } from '../components/common/LoadingState';
import { useStakingContract } from '../hooks/useStakingContract';
import { useEffect, useState } from 'react';

interface StakingStats {
    totalStaked: string;
    totalStakers: number;
    averageLockTime: number;
    yourStake: string;
    yourRewards: string;
}

const Stake: NextPage = () => {
    const { address, isConnected } = useAccount();
    const { contract: stakingContract, isLoading: contractLoading } = useStakingContract(42161); // Default to Arbitrum
    const [stats, setStats] = useState<StakingStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            if (!stakingContract || !isConnected) {
                setLoading(false);
                return;
            }
            
            try {
                const [
                    totalStaked,
                    totalStakers,
                    averageLockTime,
                    userStake,
                    userRewards
                ] = await Promise.all([
                    stakingContract.getTotalStaked(),
                    stakingContract.getTotalStakers(),
                    stakingContract.getAverageLockTime(),
                    stakingContract.getStake(address),
                    stakingContract.getPendingRewards(address)
                ]);

                setStats({
                    totalStaked: totalStaked.toString(),
                    totalStakers: totalStakers.toNumber(),
                    averageLockTime: averageLockTime.toNumber(),
                    yourStake: userStake.toString(),
                    yourRewards: userRewards.toString()
                });
            } catch (error) {
                console.error('Error loading staking stats:', error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, [stakingContract, isConnected, address]);

    if (contractLoading || loading) {
        return (
            <div className="relative min-h-screen bg-dark-bg bg-grid-pattern">
                <div className="bg-gradient-glow" />
                <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <LoadingState message={contractLoading ? "Loading staking contract..." : "Loading staking information..."} />
                </main>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Stake | Morpheus Builder</title>
                <meta name="description" content="Stake MOR tokens in builder pools" />
            </Head>

            <div className="relative min-h-screen bg-dark-bg bg-grid-pattern">
                <div className="bg-gradient-glow" />
                
                <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl font-bold text-white mb-4">
                            <span className="text-gradient">Stake MOR</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8">
                            Stake your MOR tokens to earn rewards and support builders
                        </p>
                    </motion.div>

                    {stats && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                        >
                            <div className="glassmorphism p-6 rounded-xl">
                                <h3 className="text-sm font-medium text-gray-300">Total Staked</h3>
                                <p className="mt-2 text-3xl font-semibold text-white">{stats.totalStaked} <span className="text-[#00FF84]">MOR</span></p>
                            </div>
                            <div className="glassmorphism p-6 rounded-xl">
                                <h3 className="text-sm font-medium text-gray-300">Total Stakers</h3>
                                <p className="mt-2 text-3xl font-semibold text-white">{stats.totalStakers}</p>
                            </div>
                            <div className="glassmorphism p-6 rounded-xl">
                                <h3 className="text-sm font-medium text-gray-300">Average Lock Time</h3>
                                <p className="mt-2 text-3xl font-semibold text-white">{stats.averageLockTime} <span className="text-gray-300">days</span></p>
                            </div>
                            <div className="glassmorphism p-6 rounded-xl">
                                <h3 className="text-sm font-medium text-gray-300">Your Stake</h3>
                                <p className="mt-2 text-3xl font-semibold text-white">{stats.yourStake} <span className="text-[#00FF84]">MOR</span></p>
                                <p className="mt-2 text-sm text-gray-300">Pending Rewards: <span className="text-[#00FF84]">{stats.yourRewards} MOR</span></p>
                            </div>
                        </motion.div>
                    )}

                    {!isConnected ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="glassmorphism p-8 rounded-xl text-center max-w-2xl mx-auto"
                        >
                            <h2 className="text-2xl font-semibold text-white mb-6">Connect Your Wallet</h2>
                            <p className="text-gray-300 mb-8">
                                Connect your wallet to start staking and earning rewards
                            </p>
                            <ConnectButton />
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <StakingInterface />
                        </motion.div>
                    )}
                </main>
            </div>
        </>
    );
};

export default Stake; 