import * as dotenv from "dotenv";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";

// Load environment variables
dotenv.config();

// Define task to deploy Feature Sponsorship Market contract to Base
task("deploy-feature-market-base", "Deploy FeatureSponsorshipMarket contract to Base")
  .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
    // Connect to Base network
    await hre.run("compile");
    
    const network = hre.network.name;
    if (network !== "base" && network !== "baseGoerli") {
      throw new Error(`This script is intended for Base networks only. Current network: ${network}`);
    }
    
    console.log(`Network: ${network}`);
    
    // Get deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying Feature Sponsorship Market with the account:", deployer.address);
    
    // Get MOR token address based on network
    let morTokenAddress: string | undefined;
    
    if (network === "base") {
      morTokenAddress = process.env.NEXT_PUBLIC_MOR_TOKEN_BASE;
      console.log("Using Base MOR token address:", morTokenAddress);
    } else if (network === "baseGoerli") {
      morTokenAddress = process.env.NEXT_PUBLIC_MOR_TOKEN_BASE_TESTNET;
      console.log("Using Base Goerli testnet MOR token address:", morTokenAddress);
    }
    
    if (!morTokenAddress) {
      throw new Error(`MOR token address not found for network: ${network}`);
    }
    
    // Deploy FeatureSponsorshipMarket
    const FeatureSponsorshipMarket = await hre.ethers.getContractFactory("FeatureSponsorshipMarket");
    console.log("Deploying FeatureSponsorshipMarket...");
    
    const featureSponsorshipMarket = await hre.upgrades.deployProxy(
      FeatureSponsorshipMarket,
      [morTokenAddress],
      { initializer: 'initialize' }
    );
    
    await featureSponsorshipMarket.deployed();
    
    console.log("FeatureSponsorshipMarket deployed to:", featureSponsorshipMarket.address);
    
    // Update .env variable
    const envVar = network === "base" 
      ? "NEXT_PUBLIC_FEATURE_MARKET_ADDRESS_BASE" 
      : "NEXT_PUBLIC_FEATURE_MARKET_ADDRESS_BASE_TESTNET";
    
    console.log(`\nAdd the following to your .env file:`);
    console.log(`${envVar}=${featureSponsorshipMarket.address}`);
    
    // Verify contract if not on testnet
    if (network === "base") {
      console.log("\nWaiting for block confirmations before verification...");
      await featureSponsorshipMarket.deployTransaction.wait(5);
      
      console.log("Verifying contract on Etherscan...");
      try {
        await hre.run("verify:verify", {
          address: featureSponsorshipMarket.address,
          constructorArguments: [],
        });
        console.log("Contract verification successful");
      } catch (error) {
        console.error("Error verifying contract:", error);
      }
    }
  });

// Export task for hardhat to recognize
export default {}; 