/**
 * Distribution Contract ABI
 * Based on Morpheus Distribution Contract for reward distribution
 * Address: 0x47176B2Af9885dC6C4575d4eFd63895f7Aaa4790 (Ethereum L1)
 */

export const DISTRIBUTION_ABI = [
  // View functions
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "poolId_",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "user_",
        "type": "address"
      }
    ],
    "name": "getCurrentUserReward",
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
        "internalType": "uint256",
        "name": "poolId_",
        "type": "uint256"
      }
    ],
    "name": "getPool",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint128",
            "name": "payoutStart",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "decreaseInterval",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "withdrawLockPeriod",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "claimLockPeriod",
            "type": "uint128"
          },
          {
            "internalType": "uint256",
            "name": "withdrawLockPeriodAfterStake",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "initialReward",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rewardDecrease",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minimalStake",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isPublic",
            "type": "bool"
          }
        ],
        "internalType": "struct IDistribution.Pool",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "poolId_",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "user_",
        "type": "address"
      }
    ],
    "name": "getUserInfo",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint128",
            "name": "deposited",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "rate",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "pendingRewards",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "distributionAmountPerSecond",
            "type": "uint128"
          },
          {
            "internalType": "uint256",
            "name": "lastStake",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lockEnd",
            "type": "uint256"
          }
        ],
        "internalType": "struct IDistribution.UserInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "poolId_",
        "type": "uint256"
      }
    ],
    "name": "totalDepositedInPublicPools",
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
  
  // Write functions
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "poolId_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount_",
        "type": "uint256"
      }
    ],
    "name": "stake",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "poolId_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "duration_",
        "type": "uint256"
      }
    ],
    "name": "stake",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "poolId_",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "receiver_",
        "type": "address"
      }
    ],
    "name": "claim",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "poolId_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount_",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  
  // Events
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "poolId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "UserStaked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "poolId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "UserWithdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "poolId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "UserClaimed",
    "type": "event"
  }
] as const;

export default DISTRIBUTION_ABI;