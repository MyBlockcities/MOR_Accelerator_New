# Morpheus Builder Integration

A decentralized platform for managing Morpheus Builder pools, staking, and rewards across multiple networks (Arbitrum One and Base).

## Features

### Builder Pool Management
- Create and manage builder pools with customizable parameters
- Stake MOR tokens with flexible lock periods
- Earn rewards based on configurable reward splits
- Track pool performance and rewards in real-time
- Multi-network support (Arbitrum One and Base)
- Cross-chain functionality via LayerZero (coming soon)

## Prerequisites

* [Node.js](https://nodejs.org/en/download/) (v16.x or higher)
* [MetaMask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) or other Web3 wallet
* Access to Arbitrum One or Base network
* MOR tokens for staking

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/MyBlockcities/MOR_frontend_UI
cd MOR_frontend_UI
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
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

# Contract Addresses - Base
NEXT_PUBLIC_BASE_BUILDER_ADDRESS="0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9"
NEXT_PUBLIC_BASE_TREASURY_ADDRESS="0x9eba628581896ce086cb8f1A513ea6097A8FC561"
NEXT_PUBLIC_BASE_FEE_CONFIG_ADDRESS="0x845FBB4B3e2207BF03087b8B94D2430AB11088eE"

# Network Configuration
NEXT_PUBLIC_ARBITRUM_RPC_URL="Your Arbitrum RPC URL"
NEXT_PUBLIC_BASE_RPC_URL="Your Base RPC URL"
```

4. Start development server:
```bash
npm run dev
```

Visit http://localhost:3000 to view the application.

## Smart Contracts

### Core Contracts
- `IMorpheusBuilder.sol`: Interface for builder pool management and staking
- `IMorpheusTreasury.sol`: Interface for reward distribution and fee management
- `IFeeConfig.sol`: Interface for fee configuration and management

### Contract Addresses

#### Arbitrum One
- Builder: `0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f`
- Treasury: `0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257`
- Fee Config: `0xc03d87085E254695754a74D2CF76579e167Eb895`

#### Base
- Builder: `0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9`
- Treasury: `0x9eba628581896ce086cb8f1A513ea6097A8FC561`
- Fee Config: `0x845FBB4B3e2207BF03087b8B94D2430AB11088eE`

## Architecture

### Frontend Stack
- **Framework**: Next.js 14
- **Styling**: TailwindCSS
- **Web3 Integration**: ethers.js v5, wagmi
- **State Management**: React hooks and context
- **Components**: Custom UI components with form validation

### Contract Integration
- **Language**: TypeScript
- **Web3 Library**: ethers.js v5
- **Network Support**: Arbitrum One & Base
- **Features**:
  - Builder pool creation and management
  - Staking with lock periods
  - Reward distribution
  - Fee configuration
  - Cross-chain operations (coming soon)

## Development Features

- 🏗️ Builder pool management system
- 💰 Flexible staking mechanisms
- 🔄 Real-time reward tracking
- 🌐 Multi-network support
- 🔒 Secure contract integration
- 📱 Responsive design
- ⚡ Network switching
- ✅ Form validation
- 🛡️ Error handling

## Documentation

- [Technical Implementation Guide](./docs/technical_guide.md)
- [Integration Progress](./docs/progress.md)
- [Builder Integration Plan](./docs/builder_integration_plan.md)

## Core Dependencies

- [Next.js](https://nextjs.org/) - React framework
- [ethers.js](https://docs.ethers.io/v5/) - Ethereum library
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [wagmi](https://wagmi.sh/) - React Hooks for Ethereum

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.