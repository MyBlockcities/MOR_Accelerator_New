/**
 * Secure Deployment Script for Morpheus AI Accelerator
 * 
 * This script validates environment configuration and ensures
 * secure deployment without exposing private keys.
 */

const { ethers } = require("hardhat");
require("dotenv").config();

// ANSI color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

/**
 * Validates environment configuration for secure deployment
 */
async function validateEnvironment() {
  console.log(`${colors.blue}${colors.bold}🔐 Validating Secure Deployment Environment...${colors.reset}\n`);

  const checks = [];

  // Check 1: Private key is configured
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    checks.push({
      name: "Private Key Configuration",
      status: "❌ FAIL",
      message: "DEPLOYER_PRIVATE_KEY not found in .env file"
    });
  } else if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
    checks.push({
      name: "Private Key Format",
      status: "❌ FAIL", 
      message: "Private key must start with 0x and be 64 characters (66 total)"
    });
  } else {
    checks.push({
      name: "Private Key Configuration",
      status: "✅ PASS",
      message: "Private key properly configured"
    });
  }

  // Check 2: Verify .env is gitignored
  const fs = require('fs');
  try {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    if (gitignore.includes('.env')) {
      checks.push({
        name: "Git Security",
        status: "✅ PASS",
        message: ".env files are properly gitignored"
      });
    } else {
      checks.push({
        name: "Git Security",
        status: "⚠️  WARN",
        message: ".env should be added to .gitignore"
      });
    }
  } catch (error) {
    checks.push({
      name: "Git Security",
      status: "⚠️  WARN",
      message: "Could not verify .gitignore"
    });
  }

  // Check 3: Wallet has funds (if we can connect)
  if (privateKey && privateKey.startsWith('0x') && privateKey.length === 66) {
    try {
      const wallet = new ethers.Wallet(privateKey);
      checks.push({
        name: "Wallet Address",
        status: "✅ PASS",
        message: `Deployer address: ${wallet.address}`
      });
    } catch (error) {
      checks.push({
        name: "Wallet Validation",
        status: "❌ FAIL",
        message: "Invalid private key format"
      });
    }
  }

  // Check 4: Network configuration
  const networks = ['arbitrum', 'base'];
  for (const network of networks) {
    const rpcUrl = process.env[`${network.toUpperCase()}_RPC_URL`];
    if (rpcUrl) {
      checks.push({
        name: `${network.charAt(0).toUpperCase() + network.slice(1)} RPC`,
        status: "✅ PASS",
        message: `RPC URL configured`
      });
    } else {
      checks.push({
        name: `${network.charAt(0).toUpperCase() + network.slice(1)} RPC`,
        status: "⚠️  INFO",
        message: `Using default RPC URL`
      });
    }
  }

  // Display results
  console.log("Security Validation Results:");
  console.log("=" * 50);
  
  let hasFailures = false;
  checks.forEach(check => {
    const statusColor = check.status.includes('✅') ? colors.green : 
                       check.status.includes('❌') ? colors.red : colors.yellow;
    console.log(`${statusColor}${check.status}${colors.reset} ${check.name}: ${check.message}`);
    if (check.status.includes('❌')) hasFailures = true;
  });

  console.log();

  if (hasFailures) {
    console.log(`${colors.red}${colors.bold}❌ Deployment validation failed. Please fix the issues above before deploying.${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`${colors.green}${colors.bold}✅ All security checks passed! Ready for deployment.${colors.reset}`);
  }

  return true;
}

/**
 * Secure deployment function
 */
async function secureDeploy(networkName, contractName = "DeveloperRegistry") {
  await validateEnvironment();

  console.log(`\n${colors.blue}${colors.bold}🚀 Starting secure deployment to ${networkName}...${colors.reset}\n`);

  try {
    // Get network configuration
    const network = await ethers.provider.getNetwork();
    console.log(`📡 Connected to network: ${network.name} (Chain ID: ${network.chainId})`);

    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log(`👤 Deployer address: ${deployer.address}`);

    // Check balance
    const balance = await deployer.getBalance();
    console.log(`💰 Deployer balance: ${ethers.utils.formatEther(balance)} ETH`);

    if (balance.eq(0)) {
      throw new Error("Deployer account has no ETH for gas fees");
    }

    // Deploy contract
    console.log(`\n📝 Deploying ${contractName}...`);
    const ContractFactory = await ethers.getContractFactory(contractName);
    const contract = await ContractFactory.deploy();
    
    console.log(`⏳ Waiting for deployment transaction...`);
    await contract.deployed();

    console.log(`\n${colors.green}${colors.bold}✅ Deployment successful!${colors.reset}`);
    console.log(`📋 Contract address: ${colors.bold}${contract.address}${colors.reset}`);
    console.log(`🔗 Transaction hash: ${contract.deployTransaction.hash}`);

    // Save deployment info
    const deploymentInfo = {
      contractName,
      address: contract.address,
      network: networkName,
      chainId: network.chainId,
      deployedAt: new Date().toISOString(),
      deployer: deployer.address,
      txHash: contract.deployTransaction.hash
    };

    const fs = require('fs');
    const deploymentsDir = './deployments';
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir);
    }

    fs.writeFileSync(
      `${deploymentsDir}/${contractName}-${networkName}.json`,
      JSON.stringify(deploymentInfo, null, 2)
    );

    console.log(`💾 Deployment info saved to deployments/${contractName}-${networkName}.json`);

    return contract;

  } catch (error) {
    console.error(`\n${colors.red}${colors.bold}❌ Deployment failed:${colors.reset}`);
    console.error(`${colors.red}${error.message}${colors.reset}`);
    process.exit(1);
  }
}

/**
 * Main deployment script
 */
async function main() {
  const networkName = process.env.HARDHAT_NETWORK || "localhost";
  const contractName = process.argv[2] || "DeveloperRegistry";

  console.log(`${colors.blue}${colors.bold}🏗️  Morpheus AI Accelerator - Secure Deployment${colors.reset}`);
  console.log(`📅 ${new Date().toISOString()}`);
  console.log(`🌐 Target Network: ${networkName}`);
  console.log(`📋 Contract: ${contractName}\n`);

  const contract = await secureDeploy(networkName, contractName);
  
  console.log(`\n${colors.green}${colors.bold}🎉 Deployment completed successfully!${colors.reset}`);
  console.log(`\n${colors.yellow}Next Steps:${colors.reset}`);
  console.log(`1. Update your .env file with: NEXT_PUBLIC_${contractName.toUpperCase()}_ADDRESS="${contract.address}"`);
  console.log(`2. Verify the contract on the block explorer (if desired)`);
  console.log(`3. Update your frontend configuration`);
  console.log(`4. Test the deployment on a testnet first before mainnet\n`);
}

// Handle script execution
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(`\n${colors.red}${colors.bold}💥 Deployment script failed:${colors.reset}`);
      console.error(error);
      process.exit(1);
    });
}

module.exports = { validateEnvironment, secureDeploy };