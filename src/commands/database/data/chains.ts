import { Address } from 'src/common/transformers/address/address';
import { Asset } from 'src/database/entities/asset.entity';
import { Chain, ChainType, EvmChainId } from 'src/database/entities/chain.entity';

const data: Partial<Chain>[] = [
  // Testnets
  {
    type: ChainType.Evm,
    chainId: EvmChainId.AmoyTestnet,
    name: 'Polygon Amoy',
    currency: 'POL',
    icon: 'icon',
    rpcHttp: 'https://rpc.ankr.com/polygon_amoy',
    blockExplorerName: 'Polygonscan',
    blockExplorerTransactionUrl: 'https://amoy.polygonscan.com/tx/{hash}',
    isTestnet: true,
    assets: [
      {
        address: Address.from('0xB725a9EC46de5a2ec1914887B67E422D24a3FaFf'),
        name: 'USDC',
        symbol: 'USDC',
        decimals: 6,
      },
      {
        address: Address.from('0xbad6824A66c7630129f3F257C277dcB468481E2E'),
        name: 'DAI',
        symbol: 'DAI',
        decimals: 18,
      },
    ] as any as Asset[],
  },
];

export default data;
