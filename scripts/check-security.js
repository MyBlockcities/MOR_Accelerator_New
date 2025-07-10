#!/usr/bin/env node

/**
 * Security Check Script for Morpheus AI Accelerator
 * Validates that the deployment environment is secure
 */

require("dotenv").config();
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkPrivateKeySecurity() {
  log(colors.blue + colors.bold, '\n🔐 PRIVATE KEY SECURITY CHECK');
  log(colors.blue, '=====================================');

  // Check if .env exists
  if (!fs.existsSync('.env')) {
    log(colors.red, '❌ No .env file found');
    log(colors.yellow, '💡 Create .env file: cp .env.example .env');
    return false;
  }

  // Check if private key is set
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    log(colors.red, '❌ DEPLOYER_PRIVATE_KEY not set in .env');
    log(colors.yellow, '💡 Add your MetaMask private key to .env file');
    return false;
  }

  // Validate private key format
  if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
    log(colors.red, '❌ Invalid private key format');
    log(colors.yellow, '💡 Private key must start with 0x and be 66 characters total');
    return false;
  }

  log(colors.green, '✅ Private key is properly configured');
  return true;
}

function checkGitSecurity() {
  log(colors.blue + colors.bold, '\n🔒 GIT SECURITY CHECK');
  log(colors.blue, '========================');

  // Check .gitignore
  if (!fs.existsSync('.gitignore')) {
    log(colors.red, '❌ No .gitignore file found');
    return false;
  }

  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  
  // Check if .env is gitignored
  if (!gitignore.includes('.env')) {
    log(colors.red, '❌ .env files not properly gitignored');
    log(colors.yellow, '💡 Add .env to .gitignore');
    return false;
  }

  // Check if private key patterns are gitignored
  const securityPatterns = ['*.key', '*.secret', '.env'];
  const missingPatterns = securityPatterns.filter(pattern => !gitignore.includes(pattern));
  
  if (missingPatterns.length > 0) {
    log(colors.yellow, `⚠️  Missing security patterns in .gitignore: ${missingPatterns.join(', ')}`);
  }

  log(colors.green, '✅ Git security properly configured');

  // Check git status for accidentally staged sensitive files
  try {
    const { execSync } = require('child_process');
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    
    const sensitiveFiles = gitStatus.split('\n').filter(line => 
      (line.includes('.env') && !line.includes('.env.example')) || 
      line.includes('.key') || 
      line.includes('.secret')
    );

    if (sensitiveFiles.length > 0) {
      log(colors.red, '❌ Sensitive files detected in git staging:');
      sensitiveFiles.forEach(file => log(colors.red, `   ${file}`));
      log(colors.yellow, '💡 Remove these files from git: git rm --cached <filename>');
      return false;
    }
  } catch (error) {
    log(colors.yellow, '⚠️  Could not check git status (not in a git repo?)');
  }

  return true;
}

function checkNetworkConfiguration() {
  log(colors.blue + colors.bold, '\n🌐 NETWORK CONFIGURATION CHECK');
  log(colors.blue, '=================================');

  const networks = [
    { name: 'Arbitrum', rpc: 'ARBITRUM_RPC_URL', default: 'https://arb1.arbitrum.io/rpc' },
    { name: 'Base', rpc: 'BASE_RPC_URL', default: 'https://mainnet.base.org' }
  ];

  let allGood = true;

  networks.forEach(network => {
    const rpcUrl = process.env[network.rpc] || network.default;
    if (rpcUrl === network.default) {
      log(colors.green, `✅ ${network.name}: Using default RPC`);
    } else {
      log(colors.green, `✅ ${network.name}: Custom RPC configured`);
    }
  });

  // Check API keys (optional)
  const apiKeys = ['ARBISCAN_API_KEY', 'BASESCAN_API_KEY'];
  apiKeys.forEach(key => {
    if (process.env[key]) {
      log(colors.green, `✅ ${key}: Configured (contract verification enabled)`);
    } else {
      log(colors.yellow, `⚠️  ${key}: Not set (contract verification disabled)`);
    }
  });

  return allGood;
}

function checkDeploymentReadiness() {
  log(colors.blue + colors.bold, '\n🚀 DEPLOYMENT READINESS CHECK');
  log(colors.blue, '===============================');

  // Check if hardhat.config.js exists
  if (!fs.existsSync('hardhat.config.js')) {
    log(colors.red, '❌ hardhat.config.js not found');
    return false;
  }

  // Check if required directories exist
  const requiredDirs = ['contracts', 'scripts'];
  const missingDirs = requiredDirs.filter(dir => !fs.existsSync(dir));
  
  if (missingDirs.length > 0) {
    log(colors.red, `❌ Missing directories: ${missingDirs.join(', ')}`);
    return false;
  }

  log(colors.green, '✅ Project structure is ready for deployment');
  return true;
}

function showDeploymentInstructions() {
  log(colors.blue + colors.bold, '\n📋 DEPLOYMENT INSTRUCTIONS');
  log(colors.blue, '============================');
  
  log(colors.reset, '\n1. Test on testnet first:');
  log(colors.yellow, '   yarn deploy:secure:test');
  
  log(colors.reset, '\n2. Deploy to mainnet:');
  log(colors.yellow, '   yarn deploy:secure:arbitrum');
  log(colors.yellow, '   yarn deploy:secure:base');
  
  log(colors.reset, '\n3. Validate environment anytime:');
  log(colors.yellow, '   yarn validate:env');
  
  log(colors.reset, '\n4. For frontend deployment:');
  log(colors.yellow, '   yarn build');
  log(colors.yellow, '   vercel deploy --prod');
}

function main() {
  log(colors.green + colors.bold, '🛡️  MORPHEUS AI ACCELERATOR - SECURITY CHECK');
  log(colors.green, '==============================================');

  const checks = [
    checkPrivateKeySecurity(),
    checkGitSecurity(),
    checkNetworkConfiguration(),
    checkDeploymentReadiness()
  ];

  const allPassed = checks.every(check => check);

  if (allPassed) {
    log(colors.green + colors.bold, '\n🎉 ALL SECURITY CHECKS PASSED!');
    log(colors.green, 'Your deployment environment is secure and ready.');
    showDeploymentInstructions();
  } else {
    log(colors.red + colors.bold, '\n❌ SECURITY CHECKS FAILED');
    log(colors.red, 'Please fix the issues above before deploying.');
    log(colors.yellow, '\n💡 See SECURE_DEPLOYMENT_GUIDE.md for detailed instructions.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { 
  checkPrivateKeySecurity, 
  checkGitSecurity, 
  checkNetworkConfiguration, 
  checkDeploymentReadiness 
};