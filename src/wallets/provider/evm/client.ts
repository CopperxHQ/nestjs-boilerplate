import { EvmChainId } from 'src/database/entities/chain.entity';
import { createPublicClient, http } from 'viem';
import { baseSepolia, polygonAmoy, sepolia } from 'viem/chains';

// export const client = createPublicClient({
//   chain: polygonAmoy,
//   transport: http(),
// });

// export function getEVMClient(chainId: EvmChainId) {
//   switch (chainId) {
//     case EvmChainId.AmoyTestnet:
//       return client;
//     default:
//       throw new Error(`Unknown chainId ${chainId}`);
//   }
// }

export function getEVMRpcUrl(chainId: EvmChainId) {
  switch (chainId) {
    case EvmChainId.SepoliaTestnet:
      return sepolia.rpcUrls.default.http[0];
    case EvmChainId.BaseSepoliaTestnet:
      return baseSepolia.rpcUrls.default.http[0];
    default:
      throw new Error(`Unknown chainId ${chainId}`);
  }
}
