import { NetworkConfig } from './types';

export const baseConfig: NetworkConfig = {
    name: 'Base',
    chainId: 8453,
    rpcUrl: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    contracts: {
        builder: '0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9',
        treasury: '0x9eba628581896ce086cb8f1A513ea6097A8FC561',
        feeConfig: '0x845FBB4B3e2207BF03087b8B94D2430AB11088eE',
        distribution: '0x47176B2Af9885dC6C4575d4eFd63895f7Aaa4790' // Main L1 Distribution
    },
    params: {
        editPoolDeadline: 86400, // 24 hours
        withdrawLockPeriod: 604800, // 7 days
        feePercentage: 100, // 1%
        minimumStake: '100000000000000000000' // 100 MOR
    },
    tokens: {
        MOR: {
            address: '0x7431ada8a591c955a994a21710752ef9b882b8e3', // Official Base MOR token address
            decimals: 18,
            symbol: 'MOR'
        }
    }
};