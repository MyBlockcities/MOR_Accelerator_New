import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Rewards: NextPage = () => {
  const { isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Rewards | Morpheus Builder</title>
        <meta name="description" content="View and claim your rewards in the Morpheus ecosystem" />
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
              <span className="text-gradient">Builder Rewards</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Track and claim your rewards from building in the Morpheus ecosystem
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
                Connect your wallet to view and claim your rewards
              </p>
              <ConnectButton />
            </motion.div>
          ) : (
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* Total Rewards Card */}
                <div className="glassmorphism p-6 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Total Rewards</h3>
                  <p className="text-3xl font-bold text-white">
                    1,234.56 <span className="text-[#00FF84]">MOR</span>
                  </p>
                  <p className="text-sm text-gray-400 mt-2">Last updated: 2 hours ago</p>
                </div>

                {/* Claimable Rewards Card */}
                <div className="glassmorphism p-6 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Claimable Rewards</h3>
                  <p className="text-3xl font-bold text-white">
                    567.89 <span className="text-[#00FF84]">MOR</span>
                  </p>
                  <button className="mt-4 w-full px-4 py-2 bg-[#00FF84] text-gray-900 rounded-lg font-semibold hover-glow transition-all">
                    Claim Rewards
                  </button>
                </div>

                {/* Staking APR Card */}
                <div className="glassmorphism p-6 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Current APR</h3>
                  <p className="text-3xl font-bold text-white">12.5%</p>
                  <p className="text-sm text-gray-400 mt-2">Based on current pool performance</p>
                </div>
              </motion.div>

              {/* Rewards History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glassmorphism p-8 rounded-xl"
              >
                <h2 className="text-2xl font-semibold text-white mb-6">Rewards History</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Date</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Type</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Amount</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-700">
                        <td className="px-6 py-4 text-sm text-gray-300">2024-03-15</td>
                        <td className="px-6 py-4 text-sm text-gray-300">Builder Reward</td>
                        <td className="px-6 py-4 text-sm text-[#00FF84]">+100.00 MOR</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-2 py-1 text-xs font-medium bg-green-900 text-green-300 rounded-full">
                            Claimed
                          </span>
                        </td>
                      </tr>
                      {/* Add more rows as needed */}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Rewards; 