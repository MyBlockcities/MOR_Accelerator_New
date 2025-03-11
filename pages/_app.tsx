import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from 'next-themes';
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig } from "wagmi";
import { arbitrum, base } from 'wagmi/chains';
import Layout from "../components/layout/Layout";

const { connectors } = getDefaultWallets({
  appName: "Morpheus Builder",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
});

const config = createConfig({
  chains: [arbitrum, base],
  transports: {
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
  connectors
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <RainbowKitProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </RainbowKitProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
