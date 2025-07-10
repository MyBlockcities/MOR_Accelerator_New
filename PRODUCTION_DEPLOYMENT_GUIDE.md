# MOR Accelerator Production Deployment Guide

## 🎯 Current Status

✅ **Build Status**: Successful  
✅ **Security Audit**: Completed  
✅ **TypeScript Migration**: Complete  
✅ **Wagmi v2 Integration**: Complete  
✅ **Contract Templates**: Ready  
⚠️ **Smart Contract Deployment**: Ready for production  

---

## 📋 Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Set up production environment variables
- [ ] Configure wallet private keys securely
- [ ] Set up RPC endpoints for target networks
- [ ] Configure block explorer API keys

### 2. Smart Contract Deployment
- [ ] Deploy Developer Registry contract
- [ ] Verify contracts on block explorers
- [ ] Test contract functionality
- [ ] Set up admin access controls

### 3. Frontend Configuration
- [ ] Update contract addresses
- [ ] Configure network settings
- [ ] Test wallet connection
- [ ] Validate staking functionality

---

## 🚀 Step-by-Step Deployment

### Step 1: Environment Configuration

Create a `.env.production` file:

```bash
# Network RPCs
ARBITRUM_RPC_URL="https://arb1.arbitrum.io/rpc"
BASE_RPC_URL="https://mainnet.base.org"
ARBITRUM_SEPOLIA_RPC_URL="https://sepolia-rollup.arbitrum.io/rpc"
BASE_SEPOLIA_RPC_URL="https://sepolia.base.org"

# Deployment Keys (NEVER commit these!)
DEPLOYER_PRIVATE_KEY="your-deployer-private-key"

# Block Explorer API Keys
ARBISCAN_API_KEY="your-arbiscan-api-key"
BASESCAN_API_KEY="your-basescan-api-key"

# Contract Addresses (will be updated after deployment)
NEXT_PUBLIC_DEVELOPER_REGISTRY_ADDRESS=""
NEXT_PUBLIC_ARBITRUM_DEVELOPER_REGISTRY=""
NEXT_PUBLIC_BASE_DEVELOPER_REGISTRY=""

# Official MOR Token Addresses (already configured)
NEXT_PUBLIC_ARBITRUM_MOR_TOKEN="0x092baadb7def4c3981454dd9c0a0d7ff07bcfc86"
NEXT_PUBLIC_BASE_MOR_TOKEN="0x7431ada8a591c955a994a21710752ef9b882b8e3"

# Distribution Contract (Ethereum L1)
NEXT_PUBLIC_DISTRIBUTION_ETHEREUM="0x47176B2Af9885dC6C4575d4eFd63895f7Aaa4790"
```

### Step 2: Deploy Developer Registry Contract

#### Option A: Using Hardhat (Recommended)

1. **Install Hardhat dependencies**:
   ```bash
   npm install --save-dev @nomicfoundation/hardhat-toolbox
   ```

2. **Deploy to Arbitrum Sepolia (testnet)**:
   ```bash
   npm run deploy:dev-registry:arbitrum-sepolia
   ```

3. **Deploy to Base Sepolia (testnet)**:
   ```bash
   npm run deploy:dev-registry:base-sepolia
   ```

4. **Deploy to production networks**:
   ```bash
   # Arbitrum One
   npm run deploy:dev-registry:arbitrum
   
   # Base
   npm run deploy:dev-registry:base
   ```

#### Option B: Using Manual Deployment

1. **Compile the contract**:
   - Use Remix IDE or Hardhat to compile `contracts/DeveloperRegistry.sol`
   - Ensure Solidity version 0.8.19

2. **Deploy manually**:
   - Use MetaMask or hardware wallet
   - Deploy to target networks
   - Verify on block explorers

### Step 3: Update Frontend Configuration

After deployment, update your `.env` file with the actual contract addresses:

```bash
# Example addresses (replace with actual ones)
NEXT_PUBLIC_DEVELOPER_REGISTRY_ADDRESS="0x1234567890abcdef..."
NEXT_PUBLIC_ARBITRUM_DEVELOPER_REGISTRY="0x1234567890abcdef..."
NEXT_PUBLIC_BASE_DEVELOPER_REGISTRY="0x1234567890abcdef..."
```

### Step 4: Test Deployment

1. **Start the application**:
   ```bash
   npm run build
   npm run start
   ```

2. **Test core functionality**:
   - [ ] Wallet connection works
   - [ ] Network switching works
   - [ ] Developer registration works
   - [ ] MOR token balance displays
   - [ ] Staking functionality works

3. **Test on multiple networks**:
   - [ ] Arbitrum One
   - [ ] Base
   - [ ] Arbitrum Sepolia (testnet)
   - [ ] Base Sepolia (testnet)

---

## 🔧 Production Configuration

### Required Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_DEVELOPER_REGISTRY_ADDRESS` | ✅ | Main developer registry contract |
| `NEXT_PUBLIC_ARBITRUM_MOR_TOKEN` | ✅ | MOR token on Arbitrum |
| `NEXT_PUBLIC_BASE_MOR_TOKEN` | ✅ | MOR token on Base |
| `NEXT_PUBLIC_DISTRIBUTION_ETHEREUM` | ✅ | Distribution contract (L1) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | ⚠️ | WalletConnect v2 project ID |

### Network Configurations

The application supports:
- **Arbitrum One** (Chain ID: 42161)
- **Base** (Chain ID: 8453)
- **Arbitrum Sepolia** (Chain ID: 421614) - Testnet
- **Base Sepolia** (Chain ID: 84532) - Testnet

### Contract Addresses Reference

```javascript
// Arbitrum One
const ARBITRUM_CONTRACTS = {
  MOR_TOKEN: "0x092baadb7def4c3981454dd9c0a0d7ff07bcfc86",
  BUILDER: "0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f",
  TREASURY: "0xCBE3d2c3AdE62cf7aa396e8cA93D2A8bff96E257",
  DEVELOPER_REGISTRY: "YOUR_DEPLOYED_ADDRESS"
};

// Base
const BASE_CONTRACTS = {
  MOR_TOKEN: "0x7431ada8a591c955a994a21710752ef9b882b8e3",
  BUILDER: "0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9",
  TREASURY: "0x9eba628581896ce086cb8f1A513ea6097A8FC561",
  DEVELOPER_REGISTRY: "YOUR_DEPLOYED_ADDRESS"
};
```

---

## 🔐 Security Considerations

### Private Key Management
- **NEVER** commit private keys to git
- Use environment variables or secure key management
- Consider using hardware wallets for mainnet deployments
- Rotate keys periodically

### Smart Contract Security
- Verify all contracts on block explorers
- Test thoroughly on testnets first
- Consider multi-sig wallets for admin functions
- Implement emergency pause mechanisms

### Frontend Security
- Use HTTPS in production
- Configure proper CORS settings
- Implement rate limiting
- Monitor for suspicious activity

---

## 📊 Monitoring and Maintenance

### Health Checks
- Monitor contract interactions
- Track gas usage and optimize
- Monitor for failed transactions
- Set up alerts for critical issues

### Regular Maintenance
- Update dependencies regularly
- Monitor for security vulnerabilities
- Backup important data
- Update documentation

---

## 🎯 Post-Deployment Tasks

### Immediate (Day 1)
- [ ] Verify all contracts are working
- [ ] Test complete user flows
- [ ] Monitor initial transactions
- [ ] Set up basic monitoring

### Short-term (Week 1)
- [ ] Set up comprehensive monitoring
- [ ] Create admin documentation
- [ ] Train support team
- [ ] Optimize gas usage

### Long-term (Month 1)
- [ ] Analyze user behavior
- [ ] Optimize performance
- [ ] Plan feature enhancements
- [ ] Review security practices

---

## 🆘 Troubleshooting

### Common Issues

**Build Errors**:
- Check TypeScript version compatibility
- Verify all dependencies are installed
- Clear cache: `rm -rf .next && npm run build`

**Contract Interaction Errors**:
- Verify contract addresses are correct
- Check network configuration
- Ensure wallet has sufficient gas
- Verify ABI matches deployed contract

**Wallet Connection Issues**:
- Check WalletConnect project ID
- Verify network configurations
- Clear browser cache/local storage
- Try different wallet providers

### Emergency Procedures

If critical issues arise:
1. Document the issue thoroughly
2. Check recent changes in git history
3. Consider reverting to last known good state
4. Contact development team immediately
5. Communicate with users if needed

---

## 📞 Support

For deployment assistance:
- Review this guide thoroughly
- Check existing documentation
- Test on testnets first
- Have rollback plan ready

Remember: **Test everything on testnets before mainnet deployment!**