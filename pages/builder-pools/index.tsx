import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const BuilderPools: NextPage = () => {
    const { isConnected } = useAccount();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading state
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head>
                <title>Builder Pools | Morpheus Builder</title>
                <meta name="description" content="Explore and join builder pools in the Morpheus ecosystem" />
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
                            <span className="text-gradient">Builder Pools</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8">
                            Join or create builder pools to collaborate and earn rewards
                        </p>
                    </motion.div>

                    {!isConnected ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glassmorphism p-8 rounded-xl text-center max-w-2xl mx-auto"
                        >
                            <h2 className="text-2xl font-semibold text-white mb-6">Connect Your Wallet</h2>
                            <p className="text-gray-300 mb-8">
                                Connect your wallet to view and interact with builder pools
                            </p>
                            <ConnectButton />
                        </motion.div>
                    ) : (
                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glassmorphism p-8 rounded-xl"
                            >
                                <h2 className="text-2xl font-semibold text-white mb-6">Create New Pool</h2>
                                <form className="space-y-6">
                                    <div>
                                        <label htmlFor="poolName" className="block text-sm font-medium text-gray-300">
                                            Pool Name
                                        </label>
                                        <input
                                            type="text"
                                            id="poolName"
                                            className="mt-1 block w-full rounded-lg bg-dark-surface border-dark-surface focus:border-[#00FF84] focus:ring-[#00FF84] text-white"
                                            placeholder="Enter pool name"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="poolDescription" className="block text-sm font-medium text-gray-300">
                                            Pool Description
                                        </label>
                                        <textarea
                                            id="poolDescription"
                                            rows={4}
                                            className="mt-1 block w-full rounded-lg bg-dark-surface border-dark-surface focus:border-[#00FF84] focus:ring-[#00FF84] text-white"
                                            placeholder="Describe your builder pool"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="minStake" className="block text-sm font-medium text-gray-300">
                                            Minimum Stake (MOR)
                                        </label>
                                        <input
                                            type="number"
                                            id="minStake"
                                            className="mt-1 block w-full rounded-lg bg-dark-surface border-dark-surface focus:border-[#00FF84] focus:ring-[#00FF84] text-white"
                                            placeholder="Enter minimum stake amount"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full px-8 py-3 bg-[#00FF84] text-gray-900 rounded-lg font-semibold hover-glow transition-all"
                                    >
                                        Create Pool
                                    </button>
                                </form>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="glassmorphism p-8 rounded-xl"
                            >
                                <h2 className="text-2xl font-semibold text-white mb-6">Active Pools</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Sample pool cards - replace with actual data */}
                                    <div className="glassmorphism p-6 rounded-lg hover-glow transition-all cursor-pointer">
                                        <h3 className="text-xl font-semibold text-white mb-2">AI Agents Pool</h3>
                                        <p className="text-gray-300 mb-4">Collaborative pool for AI agent developers</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">Min Stake: 1000 MOR</span>
                                            <span className="text-sm text-[#00FF84]">4 Members</span>
                                        </div>
                                    </div>
                                    {/* Add more pool cards as needed */}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default BuilderPools; 