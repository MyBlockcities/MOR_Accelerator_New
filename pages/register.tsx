import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Register: NextPage = () => {
  const { isConnected } = useAccount();

  return (
    <>
      <Head>
        <title>Register as Builder | Morpheus Builder</title>
        <meta name="description" content="Join the Morpheus Builder ecosystem and start building Smart Agents" />
      </Head>

      <div className="relative min-h-screen bg-dark-bg bg-grid-pattern">
        <div className="bg-gradient-glow" />
        
        <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Become a <span className="text-gradient">Morpheus Builder</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Join our ecosystem and start building the next generation of Smart Agents
            </p>
          </motion.div>

          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glassmorphism p-8 rounded-xl text-center"
            >
              <h2 className="text-2xl font-semibold text-white mb-6">Connect Your Wallet</h2>
              <p className="text-gray-300 mb-8">
                Connect your wallet to register as a Morpheus Builder
              </p>
              <ConnectButton />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glassmorphism p-8 rounded-xl"
            >
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Project Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full rounded-lg bg-dark-surface border-dark-surface focus:border-[#00FF84] focus:ring-[#00FF84] text-white"
                    placeholder="Enter your project name"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                    Project Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    className="mt-1 block w-full rounded-lg bg-dark-surface border-dark-surface focus:border-[#00FF84] focus:ring-[#00FF84] text-white"
                    placeholder="Describe your Smart Agent project"
                  />
                </div>

                <div>
                  <label htmlFor="initialStake" className="block text-sm font-medium text-gray-300">
                    Initial Stake (MOR)
                  </label>
                  <input
                    type="number"
                    id="initialStake"
                    className="mt-1 block w-full rounded-lg bg-dark-surface border-dark-surface focus:border-[#00FF84] focus:ring-[#00FF84] text-white"
                    placeholder="Enter initial stake amount"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-3 bg-[#00FF84] text-gray-900 rounded-lg font-semibold hover-glow transition-all"
                >
                  Register Project
                </button>
              </form>
            </motion.div>
          )}
        </main>
      </div>
    </>
  );
};

export default Register; 