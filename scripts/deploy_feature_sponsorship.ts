import { ethers, upgrades, network } from "hardhat";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Network:", network.name);
  console.log("Deploying Feature Sponsorship Market with the account:", deployer.address);

  // Get the MOR token address based on the current network
  let morTokenAddress: string | undefined;
  
  if (network.name === "arbitrum") {
    morTokenAddress = process.env.NEXT_PUBLIC_MOR_TOKEN_ARBITRUM;
    console.log("Using Arbitrum MOR token address:", morTokenAddress);
  } else if (network.name === "base") {
    morTokenAddress = process.env.NEXT_PUBLIC_MOR_TOKEN_BASE;
    console.log("Using Base MOR token address:", morTokenAddress);
  } else if (network.name === "mainnet") {
    morTokenAddress = process.env.NEXT_PUBLIC_MOR_TOKEN_ETHEREUM;
    console.log("Using Ethereum MOR token address:", morTokenAddress);
  } else if (network.name === "arbitrumSepolia") {
    // For testnet, you would need to have a testnet MOR token address
    morTokenAddress = process.env.NEXT_PUBLIC_MOR_TOKEN_ARBITRUM_TESTNET;
    console.log("Using Arbitrum Sepolia testnet MOR token address:", morTokenAddress);
  }

  if (!morTokenAddress) {
    throw new Error(`MOR token address not found for network: ${network.name}`);
  }

  const FeatureSponsorshipMarket = await ethers.getContractFactory("FeatureSponsorshipMarket");
  console.log("Deploying FeatureSponsorshipMarket...");
  
  const featureSponsorshipMarket = await upgrades.deployProxy(
    FeatureSponsorshipMarket,
    [morTokenAddress],
    { initializer: 'initialize' }
  );
  
  await featureSponsorshipMarket.deployed();

  console.log("FeatureSponsorshipMarket deployed to:", featureSponsorshipMarket.address);
  
  // Store the address in the appropriate env variable based on network
  console.log("\nAdd the following to your .env file:");
  if (network.name === "arbitrum") {
    console.log(`NEXT_PUBLIC_FEATURE_MARKET_ADDRESS_ARBITRUM=${featureSponsorshipMarket.address}`);
  } else if (network.name === "base") {
    console.log(`NEXT_PUBLIC_FEATURE_MARKET_ADDRESS_BASE=${featureSponsorshipMarket.address}`);
  } else {
    console.log(`NEXT_PUBLIC_FEATURE_MARKET_ADDRESS=${featureSponsorshipMarket.address}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });