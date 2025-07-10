// Verified LayerZero endpoint IDs from official LayerZero mainnet list
export const LZ_ENDPOINT_ID = {
  ethereum: 101,  // Ethereum mainnet
  arbitrum: 110,  // Arbitrum One
  base: 184       // Base mainnet
} as const;

// LayerZero endpoint contract addresses (official deployments)
export const LZ_ENDPOINT_ADDRESSES = {
  ethereum: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675',  // Ethereum LZ endpoint
  arbitrum: '0x3c2269811836af69497E5F486A85D7316753cf62',  // Arbitrum LZ endpoint  
  base: '0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7'      // Base LZ endpoint
} as const;

// Map chain IDs to LayerZero endpoint IDs
export const CHAIN_ID_TO_LZ_ID: Record<number, number> = {
  1: LZ_ENDPOINT_ID.ethereum,      // Ethereum mainnet -> LZ 101
  42161: LZ_ENDPOINT_ID.arbitrum,  // Arbitrum One -> LZ 110  
  8453: LZ_ENDPOINT_ID.base        // Base -> LZ 184
} as const;

// Map LayerZero endpoint IDs back to chain IDs
export const LZ_ID_TO_CHAIN_ID: Record<number, number> = {
  [LZ_ENDPOINT_ID.ethereum]: 1,
  [LZ_ENDPOINT_ID.arbitrum]: 42161,
  [LZ_ENDPOINT_ID.base]: 8453
} as const;

export type LayerZeroChain = keyof typeof LZ_ENDPOINT_ID;
export type LayerZeroEndpointId = typeof LZ_ENDPOINT_ID[LayerZeroChain];