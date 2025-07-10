import { type Address, type PublicClient, type WalletClient, type Hash, 
         type GetContractReturnType, getContract, parseEther } from 'viem';
import { NETWORK_CONFIG } from '../contracts/config/networks';
import { SUPPORTED_CHAINS } from '../utils/networkSwitching';
import { LZ_ENDPOINT_ID, LZ_ENDPOINT_ADDRESSES, CHAIN_ID_TO_LZ_ID, LZ_ID_TO_CHAIN_ID } from '../contracts/config/layerzero';

export interface CrossChainMessage {
    srcChainId: number;
    dstChainId: number;
    message: string;
    payload: string;
}

export interface LayerZeroConfig {
    endpoint: Address;
    gasLimit: bigint;
    adapterParams: `0x${string}`;
}

export class LayerZeroService {
    private static readonly DEFAULT_GAS_LIMIT = 200000n;
    private static readonly DEFAULT_ADAPTER_PARAMS = '0x';

    /**
     * Get verified LayerZero endpoint address for a given chain ID
     */
    public static getLZEndpoint(chainId: number): Address {
        switch (chainId) {
            case 1: return LZ_ENDPOINT_ADDRESSES.ethereum;
            case 42161: return LZ_ENDPOINT_ADDRESSES.arbitrum;  
            case 8453: return LZ_ENDPOINT_ADDRESSES.base;
            default:
                throw new Error(`Unsupported chain ID for LayerZero: ${chainId}`);
        }
    }

    /**
     * Get verified LayerZero endpoint ID for a given chain ID
     */
    public static getLZEndpointId(chainId: number): number {
        const lzId = CHAIN_ID_TO_LZ_ID[chainId];
        if (!lzId) {
            throw new Error(`No LayerZero endpoint ID found for chain ${chainId}`);
        }
        return lzId;
    }

    /**
     * Get chain ID from LayerZero endpoint ID
     */
    public static getChainIdFromLZId(lzEndpointId: number): number {
        const chainId = LZ_ID_TO_CHAIN_ID[lzEndpointId];
        if (!chainId) {
            throw new Error(`No chain ID found for LayerZero endpoint ${lzEndpointId}`);
        }
        return chainId;
    }

    public static async estimateFees(
        contract: GetContractReturnType<any, PublicClient>,
        dstChainId: number,
        payload: `0x${string}`,
        useZro: boolean = false
    ): Promise<bigint> {
        const adapterParams = this.getAdapterParams(this.DEFAULT_GAS_LIMIT);
        const [nativeFee] = await contract.read.estimateSendFee([
            dstChainId,
            payload,
            useZro,
            adapterParams
        ]);
        return nativeFee;
    }

    public static getAdapterParams(gasLimit: bigint): `0x${string}` {
        // Version 1 adapter params encoding
        return `0x00${gasLimit.toString(16).padStart(8, '0')}` as `0x${string}`;
    }

    public static async sendCrossChainMessage(
        contract: GetContractReturnType<any, WalletClient>,
        dstChainId: number,
        payload: `0x${string}`,
        fees: bigint
    ): Promise<Hash> {
        const adapterParams = this.getAdapterParams(this.DEFAULT_GAS_LIMIT);
        const { request } = await contract.simulate.send([
            dstChainId,
            payload,
            false, // use Zro
            adapterParams
        ], { value: fees });
        
        return contract.write(request);
    }

    public static async getMessageStatus(
        contract: GetContractReturnType<any, PublicClient>,
        srcChainId: number,
        dstChainId: number,
        nonce: bigint
    ): Promise<boolean> {
        return contract.read.messageStatus([srcChainId, dstChainId, nonce]);
    }

    public static async retryMessage(
        contract: GetContractReturnType<any, WalletClient>,
        srcChainId: number,
        dstChainId: number,
        payload: `0x${string}`,
        fees: bigint
    ): Promise<Hash> {
        const adapterParams = this.getAdapterParams(this.DEFAULT_GAS_LIMIT);
        const { request } = await contract.simulate.retryMessage([
            srcChainId,
            dstChainId,
            payload,
            { value: fees },
            adapterParams
        ]);
        
        return contract.write(request);
    }

    public static getExplorerLink(chainId: number, txHash: Hash): string {
        const network = Object.values(NETWORK_CONFIG).find(
            (config) => config.chainId === chainId
        );
        return network ? `${network.explorer}/tx/${txHash}` : '#';
    }
} 