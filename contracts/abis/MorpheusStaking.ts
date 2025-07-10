import { type Address } from 'viem';
import { ContractAddresses } from '../types/contracts';

export const STAKING_ADDRESSES: ContractAddresses = {
    arbitrum: {
        builder: '0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f' as Address,
        treasury: '0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257' as Address,
        feeConfig: '0xc03d87085E254695754a74D2CF76579e167Eb895' as Address
    },
    base: {
        builder: '0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9' as Address,
        treasury: '0x9eba628581896ce086cb8f1A513ea6097A8FC561' as Address,
        feeConfig: '0x845FBB4B3e2207BF03087b8B94D2430AB11088eE' as Address
    }
};

export const STAKING_ABI = [
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "poolId",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "stake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "poolId",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "unstake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "poolId",
                "type": "bytes32"
            }
        ],
        "name": "claimRewards",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "poolId",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "staker",
                "type": "address"
            }
        ],
        "name": "getStakerAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "poolId",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "staker",
                "type": "address"
            }
        ],
        "name": "getPendingRewards",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "poolId",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "staker",
                "type": "address"
            }
        ],
        "name": "isLocked",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "poolId",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "staker",
                "type": "address"
            }
        ],
        "name": "getLockEndTime",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const; 