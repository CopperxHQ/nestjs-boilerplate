// import { Hex } from 'viem';
import { WalletAddress } from 'src/database/entities/wallet-address.entity';

// export type TokenBalance = {
//   balance: bigint;
//   symbol: string;
//   decimals: number;
//   formatted: string;
//   address: Hex;
// };

export interface IWalletProvider {
  // Chain support methods
  // static getSupportedChains(): ChainId[];
  // static isChainSupported(chainId: ChainId): boolean;

  // ================================================
  // Wallet management methods
  // ================================================

  createWallet(): Promise<WalletAddress>;
  // deployWallet(organizationId: string, walletId: string, options?: any): Promise<WalletAddress>;

  // // ================================================
  // // Wallet specific methods
  // // ================================================

  // // Balance methods
  // getBalance(wallet: Wallet, organizationId: string, tokenAddress: Hex): Promise<TokenBalance>;

  // // Transfer methods
  // submitPermit(options: {
  //   ownerAddress: Hex;
  //   spenderAddress: Hex;
  //   value: bigint;
  //   deadline: bigint;
  //   tokenAddress: Hex;
  //   signature: Hash;
  // }): Promise<string>;

  // transfer(wallet: Wallet, toAddress: Hex, amount: bigint): Promise<Hex>;
}
