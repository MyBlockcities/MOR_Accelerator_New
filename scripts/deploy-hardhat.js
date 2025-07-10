/**
 * Hardhat Deployment Script for DeveloperRegistry
 * 
 * This script deploys the DeveloperRegistry contract using Hardhat
 * and updates the environment configuration automatically.
 * 
 * Usage:
 * npx hardhat run scripts/deploy-hardhat.js --network arbitrum-sepolia
 * npx hardhat run scripts/deploy-hardhat.js --network base-sepolia  
 * npx hardhat run scripts/deploy-hardhat.js --network arbitrum
 * npx hardhat run scripts/deploy-hardhat.js --network base
 */

const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🏗️  Deploying DeveloperRegistry Contract");
  console.log("=========================================\n");

  // Get network information
  const network = hre.network.name;
  const chainId = hre.network.config.chainId;
  
  console.log(`📡 Network: ${network}`);
  console.log(`⛓️  Chain ID: ${chainId}`);

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`💰 Deployer address: ${deployer.address}`);

  // Check deployer balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log(`💸 Deployer balance: ${ethers.formatEther(balance)} ETH`);

  if (balance === 0n) {
    throw new Error("❌ Deployer account has no ETH for gas fees");
  }

  console.log("\n🚀 Deploying DeveloperRegistry...");

  // Deploy the contract
  const DeveloperRegistry = await ethers.getContractFactory("DeveloperRegistry");
  
  // Estimate gas
  const deploymentData = DeveloperRegistry.getDeployTransaction();
  const estimatedGas = await deployer.estimateGas(deploymentData);
  console.log(`⛽ Estimated gas: ${estimatedGas.toString()}`);

  // Deploy
  const developerRegistry = await DeveloperRegistry.deploy();
  await developerRegistry.waitForDeployment();

  const contractAddress = await developerRegistry.getAddress();
  console.log(`\n✅ DeveloperRegistry deployed successfully!`);
  console.log(`📍 Contract address: ${contractAddress}`);

  // Get deployment transaction
  const deploymentTx = developerRegistry.deploymentTransaction();
  console.log(`🧾 Deployment transaction: ${deploymentTx.hash}`);
  console.log(`🔗 Block number: ${deploymentTx.blockNumber}`);

  // Get block explorer URL
  const explorerUrl = getBlockExplorerUrl(network, contractAddress);
  console.log(`🔍 Block explorer: ${explorerUrl}`);

  // Update environment file
  updateEnvironmentFile(contractAddress, network);

  // Verify contract if on a supported network
  if (network !== "hardhat" && network !== "localhost") {
    console.log("\n🔍 Waiting before verification...");
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
    
    try {
      console.log("📋 Verifying contract on block explorer...");
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified successfully!");
    } catch (error) {
      console.log("⚠️  Verification failed (this is normal for some networks):");
      console.log(`   ${error.message}`);
    }
  }

  // Test basic functionality
  console.log("\n🧪 Testing basic contract functionality...");
  
  try {
    // Test view functions
    const totalDevelopers = await developerRegistry.getTotalDevelopers();
    console.log(`👥 Initial developer count: ${totalDevelopers}`);
    
    const isRegistered = await developerRegistry.isDeveloperRegistered(deployer.address);
    console.log(`✓ Registration check working: ${isRegistered}`);
    
    console.log("✅ Basic functionality test passed!");
  } catch (error) {
    console.log("⚠️  Functionality test failed:", error.message);
  }

  // Generate deployment summary
  const deploymentSummary = {
    network: network,
    chainId: chainId,
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    deploymentTx: deploymentTx.hash,
    blockNumber: deploymentTx.blockNumber,
    explorerUrl: explorerUrl,
    timestamp: new Date().toISOString()
  };

  // Save deployment info
  const deploymentFile = path.join(__dirname, `../deployments/${network}_DeveloperRegistry.json`);
  const deploymentDir = path.dirname(deploymentFile);
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentSummary, null, 2));
  console.log(`\n📄 Deployment info saved to: deployments/${network}_DeveloperRegistry.json`);

  // Final summary
  console.log("\n📋 DEPLOYMENT SUMMARY");
  console.log("=====================");
  console.log(`Network: ${network} (${chainId})`);
  console.log(`Contract: ${contractAddress}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Explorer: ${explorerUrl}`);
  console.log(`\n🎯 Next steps:`);
  console.log(`1. Update frontend with new contract address`);
  console.log(`2. Test developer registration functionality`);
  console.log(`3. Set up admin verification process`);
  
  return deploymentSummary;
}

function getBlockExplorerUrl(network, address) {
  const explorers = {
    arbitrum: `https://arbiscan.io/address/${address}`,
    "arbitrum-sepolia": `https://sepolia.arbiscan.io/address/${address}`,
    base: `https://basescan.org/address/${address}`,
    "base-sepolia": `https://sepolia.basescan.org/address/${address}`,
    ethereum: `https://etherscan.io/address/${address}`,
    sepolia: `https://sepolia.etherscan.io/address/${address}`
  };
  
  return explorers[network] || `https://etherscan.io/address/${address}`;
}

function updateEnvironmentFile(contractAddress, network) {
  const envPath = path.join(__dirname, "../.env");
  let envContent = "";
  
  // Read existing .env file
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
  }

  // Update or add the developer registry address
  const registryAddressLine = `NEXT_PUBLIC_DEVELOPER_REGISTRY_ADDRESS="${contractAddress}"`;
  
  if (envContent.includes("NEXT_PUBLIC_DEVELOPER_REGISTRY_ADDRESS=")) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_DEVELOPER_REGISTRY_ADDRESS=.*/,
      registryAddressLine
    );
  } else {
    envContent += `\n# Developer Registry Contract\n${registryAddressLine}\n`;
  }

  // Add network-specific address if deploying to mainnet
  if (network === "arbitrum" || network === "base") {
    const networkAddressLine = `NEXT_PUBLIC_${network.toUpperCase()}_DEVELOPER_REGISTRY="${contractAddress}"`;
    if (!envContent.includes(`NEXT_PUBLIC_${network.toUpperCase()}_DEVELOPER_REGISTRY=`)) {
      envContent += `${networkAddressLine}\n`;
    }
  }

  fs.writeFileSync(envPath, envContent);
  console.log(`\n📝 Updated .env file with contract address`);
}

// Execute deployment
main()
  .then((deploymentSummary) => {
    console.log("\n🎉 Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });