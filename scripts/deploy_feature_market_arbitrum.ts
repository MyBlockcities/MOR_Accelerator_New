import * as dotenv from "dotenv";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";

// Load environment variables
dotenv.config();

// Define task to deploy Feature Sponsorship Market contract to Arbitrum
task("deploy-feature-market-arbitrum", "Deploy FeatureSponsorshipMarket contract to Arbitrum")
  .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
    // Connect to Arbitrum network
    await hre.run("compile");
    
    const network = hre.network.name;
    if (network !== "arbitrum" && network !== "arbitrumSepolia") {
      throw new Error(`This script is intended for Arbitrum networks only. Current network: ${network}`);
    }
    
    console.log(`Network: ${network}`);
    
    // Get deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying Feature Sponsorship Market with the account:", deployer.address);
    
    // Get MOR token address based on network
    let morTokenAddress: string | undefined;
    
    if (network === "arbitrum") {
      morTokenAddress = process.env.NEXT_PUBLIC_MOR_TOKEN_ARBITRUM;
      console.log("Using Arbitrum MOR token address:", morTokenAddress);
    } else if (network === "arbitrumSepolia") {
      morTokenAddress = process.env.NEXT_PUBLIC_MOR_TOKEN_ARBITRUM_TESTNET;
      console.log("Using Arbitrum Sepolia testnet MOR token address:", morTokenAddress);
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
    const envVar = network === "arbitrum" 
      ? "NEXT_PUBLIC_FEATURE_MARKET_ADDRESS_ARBITRUM" 
      : "NEXT_PUBLIC_FEATURE_MARKET_ADDRESS_ARBITRUM_TESTNET";
    
    console.log(`\nAdd the following to your .env file:`);
    console.log(`${envVar}=${featureSponsorshipMarket.address}`);
    
    // Verify contract if not on testnet
    if (network === "arbitrum") {
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