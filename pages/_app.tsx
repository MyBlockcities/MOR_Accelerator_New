import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from 'next-themes';
import { getDefaultWallets, RainbowKitProvider, lightTheme, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css"; // Import RainbowKit styles
import { http } from "viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig } from "wagmi";
import { arbitrum, base, arbitrumSepolia, baseGoerli } from 'wagmi/chains';
import type { Chain } from 'wagmi/chains';
import Layout from "../components/layout/Layout";
import { useState, useEffect } from 'react';

// Use a valid project ID for development
// In production, you should set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in .env.local
const PLACEHOLDER_PROJECT_ID = "3a8170812b534d0ff9d794f19a901d64";

// Define chains based on environment
const isDevelopment = process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' || process.env.ENABLE_TESTNET === 'true';
// Cast the chains array to the required type
const availableChains = (isDevelopment ? [arbitrumSepolia, baseGoerli] : [arbitrum, base]) as [Chain, ...Chain[]];

const { connectors } = getDefaultWallets({
  appName: "Morpheus Builder",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || PLACEHOLDER_PROJECT_ID,
});

// Create config with proper transports for all chains
const transportConfig = {
  [arbitrum.id]: http(arbitrum.rpcUrls.default.http[0]),
  [base.id]: http(base.rpcUrls.default.http[0]),
  [arbitrumSepolia.id]: http(arbitrumSepolia.rpcUrls.default.http[0]),
  [baseGoerli.id]: http(baseGoerli.rpcUrls.default.http[0]),
};

const config = createConfig({
  chains: availableChains,
  transports: transportConfig,
  connectors,
  ssr: true, // Enable SSR support
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  // Improved SSR hydration handling
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={{
            lightMode: lightTheme(),
            darkMode: darkTheme({
              accentColor: '#6466e9',
              accentColorForeground: 'white',
            }),
          }}
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {mounted ? (
              <Layout>
                <Component {...pageProps} />
              </Layout>
            ) : (
              // Show a minimal layout during SSR/hydration
              <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
                <div className="flex items-center justify-center min-h-screen">
                  <div className="animate-pulse text-white text-lg">Loading Morpheus AI...</div>
                </div>
              </div>
            )}
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
