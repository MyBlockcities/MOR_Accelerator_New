import React from 'react';
import Head from 'next/head';

// TODO: Re-implement with proper Chakra UI v3 and wagmi v2 compatibility

const FeatureMarket = () => {
  return (
    <>
      <Head>
        <title>Feature Market - Morpheus Builder</title>
        <meta name="description" content="Feature market coming soon" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Feature Market
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Feature marketplace coming soon. Please check back later.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <p className="text-gray-500 dark:text-gray-400">
                This page is being updated to use the latest libraries and will be available soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeatureMarket;