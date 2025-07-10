# Morpheus Builder Integration

A decentralized platform for managing Morpheus Builder pools, staking, and rewards across multiple blockchain networks (Arbitrum One and Base).

## Overview

The Morpheus Builder platform enables users to create and manage builder pools, stake MOR tokens, and participate in feature sponsorship markets across multiple networks. The platform leverages LayerZero for cross-chain functionality, allowing seamless operations between Ethereum, Arbitrum, and Base networks.

## Key Features

### Builder Pool Management
- Create and manage builder pools with customizable parameters
- Stake MOR tokens with flexible lock periods (no lock or 1-year lock with 2.11x multiplier)
- Earn rewards based on configurable reward splits (70%, 80%, or 90%)
- Track pool performance and rewards in real-time

### Multi-Network Support
- Deploy and manage pools on both Arbitrum One and Base
- View unified dashboard across networks
- Cross-chain functionality via LayerZero

### Feature Sponsorship Market (Coming Soon)
- Create feature proposals with milestone-based funding
- Bid on feature development opportunities
- Track development progress with on-chain verification
- Secure payment system with escrow management

## Prerequisites

* [Node.js](https://nodejs.org/en/download/) (v16.x or higher)
* [Yarn](https://yarnpkg.com/getting-started/install) (preferred package manager)
* [MetaMask](https://metamask.io/download/) or other Web3 wallet
* Access to Arbitrum One or Base network
* MOR tokens for staking

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/MyBlockcities/MOR_Accelerator_New
cd MOR_Accelerator_New
```

2. Install dependencies using Yarn:
```bash
yarn install
```

3. Configure environment:
```bash
cp .env.example .env
```

Update the following variables in `.env`:
```env
# Contract Addresses - Arbitrum
NEXT_PUBLIC_ARBITRUM_BUILDER_ADDRESS="0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f"
NEXT_PUBLIC_ARBITRUM_TREASURY_ADDRESS="0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257"
NEXT_PUBLIC_ARBITRUM_FEE_CONFIG_ADDRESS="0xc03d87085E254695754a74D2CF76579e167Eb895"
NEXT_PUBLIC_MOR_TOKEN_ARBITRUM="0x092baadb7def4c3981454dd9c0a0d7ff07bcfc86"

# Contract Addresses - Base
NEXT_PUBLIC_BASE_BUILDER_ADDRESS="0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9"
NEXT_PUBLIC_BASE_TREASURY_ADDRESS="0x9eba628581896ce086cb8f1A513ea6097A8FC561"
NEXT_PUBLIC_BASE_FEE_CONFIG_ADDRESS="0x845FBB4B3e2207BF03087b8B94D2430AB11088eE"
NEXT_PUBLIC_MOR_TOKEN_BASE="0x7431ada8a591c955a994a21710752ef9b882b8e3"

# Contract Addresses - Ethereum
NEXT_PUBLIC_MOR_TOKEN_ETHEREUM="0xcBB8f1BDA10b9696c57E13BC128Fe674769DCEc0"

# Network Configuration
NEXT_PUBLIC_ARBITRUM_RPC_URL="Your Arbitrum RPC URL"
NEXT_PUBLIC_BASE_RPC_URL="Your Base RPC URL"
```

4. Start development server:
```bash
yarn dev
```

Visit http://localhost:3000 to view the application.

**Important:** For development, always use `yarn dev`. The `yarn start` command is only for running production builds after `yarn build`.

## Available Scripts

- `yarn dev` - Start development server (use this for development)
- `yarn build` - Build for production
- `yarn start` - Run production build (only after building)
- `yarn lint` - Run linting checks
- `yarn test` - Run test suite
- `yarn deploy:feature-market` - Deploy feature market contract

### Development vs Production Commands

**For Development:**
```bash
yarn install  # Install dependencies
yarn dev      # Start development server
```

**For Production:**
```bash
yarn install  # Install dependencies
yarn build    # Build the application
yarn start    # Start production server
```

## Smart Contracts

### Core Contracts (Already Deployed)

#### Arbitrum One
- Builder: `0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f`
- Treasury: `0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257`
- Fee Config: `0xc03d87085E254695754a74D2CF76579e167Eb895`
- MOR Token: `0x092baadb7def4c3981454dd9c0a0d7ff07bcfc86`

#### Base
- Builder: `0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9`
- Treasury: `0x9eba628581896ce086cb8f1A513ea6097A8FC561`
- Fee Config: `0x845FBB4B3e2207BF03087b8B94D2430AB11088eE`
- MOR Token: `0x7431ada8a591c955a994a21710752ef9b882b8e3`

#### Ethereum
- MOR Token: `0xcBB8f1BDA10b9696c57E13BC128Fe674769DCEc0`
- L1Sender: `0x2Efd4430489e1a05A89c2f51811aC661B7E5FF84`
- Distribution: `0x47176B2Af9885dC6C4575d4eFd63895f7Aaa4790`

### Contract Interfaces
- `IMorpheusBuilder.sol`: Interface for builder pool management and staking
- `IMorpheusTreasury.sol`: Interface for reward distribution and fee management
- `IMorpheusFeeConfig.sol`: Interface for fee configuration and management
- `IMOR.sol`: Interface for the MOR token with OFT (Omnichain Fungible Token) capabilities
- `IOFT.sol`: Interface for LayerZero Omnichain functionality

## Architecture

### Frontend Stack
- **Framework**: Next.js 14
- **Styling**: TailwindCSS
- **Web3 Integration**: ethers.js v6, wagmi v2, viem
- **State Management**: React hooks and context
- **UI Components**: Custom components + Chakra UI
- **Form Handling**: React Hook Form with Zod validation

### Contract Integration
- **Language**: TypeScript
- **Web3 Library**: ethers.js v6, viem
- **Network Support**: Ethereum, Arbitrum One & Base
- **Cross-Chain**: LayerZero integration for OFT

## Development Features

- 🏗️ Builder pool management system
- 💰 Flexible staking mechanisms
- 🔄 Real-time reward tracking
- 🌐 Multi-network support
- 🔒 Secure contract integration
- 📱 Responsive design
- ⚡ Network switching
- ✅ Type-safe contract interactions
- 🛡️ Comprehensive error handling

## Project Structure

```
/
├── components/        # UI components
├── contracts/         # Smart contract interfaces & ABIs
├── hooks/             # Custom React hooks
├── pages/             # Next.js pages and API routes
├── public/            # Static assets
├── scripts/           # Deployment and utility scripts
├── services/          # Backend services
├── styles/            # Global styles
└── utils/             # Utility functions
```

## Documentation

- [Technical Implementation Guide](./docs/technical_guide.md)
- [Smart Contract Testing Guide](./SmartContract_Testing_Guide.md)
- [Deployment Checklist](./Deployment_Checklist.md)
- [Project Assessment](./MOR_Project_Updated_Assessment.md)
- [Next Steps Action Plan](./MOR_Next_Steps_Action_Plan.md)

## Core Dependencies

- [Next.js](https://nextjs.org/) - React framework
- [ethers.js](https://docs.ethers.io/v6/) - Ethereum library
- [wagmi](https://wagmi.sh/) - React Hooks for Ethereum
- [viem](https://viem.sh/) - TypeScript Interface for Ethereum
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Hardhat](https://hardhat.org/) - Ethereum development environment

## Deployment

### Vercel Deployment (Recommended)

This project includes a `vercel-deploy.json` configuration file optimized for Vercel deployment:

1. Push your repository to GitHub
2. Import your repository in the Vercel dashboard
3. Vercel will automatically use the configuration from `vercel-deploy.json`
4. Configure environment variables in the Vercel dashboard:
   - Copy all variables from your `.env` file
   - Make sure to set `NODE_ENV=production`
5. Deploy

The configuration automatically:
- Uses `yarn install` for dependency installation
- Uses `yarn build` for production builds
- Configures Next.js framework settings
- Sets up proper API function runtime

### Manual Deployment

For manual deployment:

1. Build the project:
```bash
yarn build
```

2. Start the production server:
```bash
yarn start
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
