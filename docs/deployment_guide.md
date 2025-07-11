Deployment Guide for Morpheus Open Source Accelerator
This guide provides detailed instructions for deploying your Morpheus Open Source Accelerator application to either Vercel or Netlify.
Prerequisites
Before deploying, ensure you have:
A GitHub account
Your enhanced code pushed to your GitHub repository
Access to any required API keys or environment variables
Option 1: Deploying to Vercel (Recommended for Next.js)
Vercel is the platform created by the team behind Next.js and offers the best integration for Next.js applications.
Step 1: Prepare Your Repository
Extract the ZIP file containing the enhanced project
Install dependencies:
bash
cd MOR_Accelerator_New
npm install
Push the code to your GitHub repository:
bash
git add .
git commit -m "Enhanced application with animated staking flow and reward visualization"
git push origin main
Step 2: Deploy on Vercel
Go to Vercel and sign in with GitHub
Click "Add New..." → "Project"
Select your repository "MOR_Accelerator_New"
Configure the project settings:
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Environment Variables:
Add any required environment variables for blockchain interactions:
NEXT_PUBLIC_INFURA_ID (if using Infura)
NEXT_PUBLIC_WALLET_CONNECT_ID (if using WalletConnect)
Any other API keys or configuration variables
Click "Deploy"
Step 3: Configure Custom Domain (Optional)
After deployment, go to "Settings" → "Domains"
Add your custom domain and follow the verification steps
Option 2: Deploying to Netlify
Netlify is another excellent platform for deploying web applications with continuous deployment.
Step 1: Prepare Your Repository
Follow the same steps as for Vercel to prepare your repository.
Step 2: Create a netlify.toml File
Create a netlify.toml file in the root of your project with the following content:
toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NETLIFY_NEXT_PLUGIN_SKIP = "true"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
Step 3: Deploy on Netlify
Go to Netlify and sign in with GitHub
Click "Add new site" → "Import an existing project"
Select your GitHub repository
Configure the build settings:
Build command: npm run build
Publish directory: .next
Environment Variables:
Go to "Site settings" → "Environment variables"
Add the same environment variables as mentioned for Vercel
Click "Deploy site"
Step 4: Configure Custom Domain (Optional)
Go to "Site settings" → "Domain management"
Add your custom domain and follow the verification steps
Post-Deployment Verification
After deploying to either platform, verify the following:
The application loads correctly
Wallet connection works properly
Staking functionality is operational
Animations and visualizations render as expected
Network switching between Arbitrum and Base works correctly
Troubleshooting Common Issues
Build Failures
Issue: Build fails due to missing dependencies
Solution: Ensure all dependencies are correctly listed in package.json
Issue: Environment variables not accessible
Solution: Verify that all environment variables are correctly set in the platform's settings
Runtime Errors
Issue: Wallet connection issues
Solution: Check browser console for errors and verify that the correct RPC URLs and chain IDs are configured
Issue: Smart contract interactions failing
Solution: Verify contract addresses and ABIs are correct for the deployed networks
