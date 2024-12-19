import * as forge from 'node-forge';
import { HttpStatus, Logger } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import {
  Blockchain,
  initiateDeveloperControlledWalletsClient,
} from '@circle-fin/developer-controlled-wallets';
import { IterableBackoff, handleWhenResult, retry } from 'cockatiel';
import { toNumber, toString } from 'lodash';
import { DeepPartial } from 'utility-types';
import { Hex } from 'viem';
import { CONFIG } from 'src/config/config';
import { EvmChainId } from 'src/database/entities/chain.entity';
import { EOAWallet } from '@circle-fin/developer-controlled-wallets/dist/types/clients/developer-controlled-wallets';

export class CircleClient {
  private readonly axiosClient: AxiosInstance;
  public readonly walletSetId: string = CONFIG.CIRCLE_WALLET_SET_ID;
  private readonly client: ReturnType<typeof initiateDeveloperControlledWalletsClient>;

  public walletAddress: string;
  public walletId: string;

  constructor(chainId: EvmChainId, walletId?: string, walletAddress?: string) {
    this.axiosClient = axios.create({
      baseURL: CONFIG.CIRCLE_API_URL,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${CONFIG.CIRCLE_API_KEY}`,
      },
      timeout: 120 * 1000, // 120 seconds timeout on request
    });

    this.client = initiateDeveloperControlledWalletsClient({
      apiKey: CONFIG.CIRCLE_API_KEY,
      entitySecret: CONFIG.CIRCLE_ENTITY_SECRET,
    });

    this.walletAddress = walletAddress;
    this.walletId = walletId;
  }

  async createWallet(): Promise<{ id: string; address: string }> {
    const response = await this.client.createWallets({
      accountType: 'EOA',
      blockchains: ['EVM-TESTNET'],
      count: 1,
      walletSetId: this.walletSetId,
    });

    const wallets = response?.data?.wallets as EOAWallet[];
    this.walletAddress = wallets[0].address;
    this.walletId = wallets[0].id;

    return {
      id: this.walletId,
      address: this.walletAddress,
    };
  }

  // async contractExecution(tx: RelayerTransactionRequest): Promise<Partial<RelayerTransactionResponse>> {
  //   try {
  //     // const estimateResponse = await this.axiosClient.post<CircleTransactionEstimateResponse>(
  //     //   '/v1/w3s/transactions/contractExecution/estimateFee',
  //     //   {
  //     //     idempotencyKey: uuid(),
  //     //     entitySecretCipherText: this.getEntitySecretCipher(),
  //     //     walletId: this.config.walletId,
  //     //     callData: tx.data,
  //     //     // abiFunctionSignature: 'transfer(address,uint256)',
  //     //     // abiParameters: [toAddress, amount],
  //     //     amount: toNumber(tx.value || 0)?.toString(),
  //     //     contractAddress: tx.to,
  //     //   }
  //     // );

  //     // const estimations = estimateResponse.data.data;

  //     const res = await this.axiosClient.post<{
  //       data: {
  //         id: string;
  //         state: CircleTransactionResponse['data']['transaction']['state'];
  //       };
  //     }>('/v1/w3s/developer/transactions/contractExecution', {
  //       idempotencyKey: uuid(),
  //       entitySecretCipherText: this.getEntitySecretCipher(),
  //       walletId: this.config.walletId,
  //       callData: tx.data,
  //       // abiFunctionSignature: 'transfer(address,uint256)',
  //       // abiParameters: [toAddress, amount],
  //       amount: toNumber(tx.value?.toString() || 0)?.toString(),
  //       contractAddress: tx.to,
  //       feeLevel: 'MEDIUM',
  //       // gasLimit: BN_8(estimations.medium.gasLimit).plus(40_000).toString(),
  //       // priorityFee: estimations.medium.priorityFee,
  //       // maxFee: estimations.medium.maxFee,
  //     });

  //     const transactionId = res.data.data.id;

  //     let latestTransaction: DeepPartial<CircleTransactionResponse> = {
  //       data: {
  //         transaction: {
  //           id: res.data.data.id,
  //           state: res.data.data.state,
  //         },
  //       },
  //     };

  //     // Wait until transaction go beyond 'INITIATED', 'PENDING_RISK_SCREENING' and 'QUEUED' state
  //     const _retry = retry(
  //       handleWhenResult((res: DeepPartial<CircleTransactionResponse>) => {
  //         return ['INITIATED', 'PENDING_RISK_SCREENING', 'QUEUED', 'SENT'].includes(
  //           res.data.transaction.state
  //         );
  //       }).orType(AxiosError),
  //       {
  //         maxAttempts: 15,
  //         backoff: new IterableBackoff([
  //           2500, 2500, 1000, 2500, 1500, 2500, 1500, 2500, 1500, 2500, 2500, 1500, 2500, 1500, 2500, 1500,
  //         ]),
  //       }
  //     );

  //     const onRetry = _retry.onFailure(({ duration, reason }) => {
  //       Logger.debug(
  //         `Circle transaction not beyond initial state. duration: ${duration}, status: ${
  //           latestTransaction?.data?.transaction?.state
  //         }, txId: ${latestTransaction?.data?.transaction?.id}, error: ${
  //           (reason as unknown as Error)?.message
  //         }`,
  //         CircleClient.name
  //       );
  //     });

  //     try {
  //       await _retry.execute(async () => {
  //         const trx = await this.getInternalTransaction(transactionId);
  //         latestTransaction = trx;

  //         return trx;
  //       });
  //     } catch (error) {
  //       Logger.error(
  //         `Failed to get circle transaction beyond initial state. status: ${latestTransaction?.data?.transaction?.state}, txId: ${latestTransaction?.data?.transaction?.id} \n` +
  //           JSON.stringify(latestTransaction),
  //         error,
  //         CircleClient.name
  //       );
  //     }
  //     onRetry?.dispose();

  //     if (['DENIED', 'FAILED', 'CANCELLED'].includes(latestTransaction?.data?.transaction?.state)) {
  //       throw new ApplicationException(HttpStatus.INTERNAL_SERVER_ERROR, {
  //         message: 'Failed to perform transaction. status: ' + latestTransaction?.data?.transaction?.state,
  //         latestTransaction,
  //       });
  //     }

  //     return CircleClient.mapToEthTransaction(this.config.chainId, latestTransaction);
  //   } catch (error) {
  //     Logger.error(
  //       'Failed to execute contract with circle wallet. ' +
  //         JSON.stringify(tx) +
  //         ' ' +
  //         `${JSON.stringify((error as AxiosError)?.response?.data)}`,
  //       error,
  //       CircleClient.name
  //     );
  //     Logger.error(error, null, CircleClient.name);
  //     throw error;
  //   }
  // }

  // async signMessage(message: Hex, memo = null) {
  //   try {
  //     const response = await this.client.signMessage({
  //       walletId: this.config.walletId,
  //       encodedByHex: true,
  //       message,
  //       memo,
  //     });

  //     return response.data?.signature;
  //   } catch (error) {
  //     Logger.error(
  //       'Failed to sign message with circle wallet. ' +
  //         ' ' +
  //         `${JSON.stringify((error as AxiosError)?.response?.data)}`,
  //       error,
  //       CircleClient.name
  //     );
  //     Logger.error(error, null, CircleClient.name);

  //     throw error;
  //   }
  // }

  // async signTypedData(
  //   data: {
  //     types: any;
  //     domain: any;
  //     primaryType?: string;
  //     message: any;
  //   },
  //   memo = null
  // ) {
  //   try {
  //     const response = await this.client.signTypedData({
  //       walletId: this.config.walletId,
  //       data: JSON.stringify(data),
  //       memo,
  //     });

  //     return response.data?.signature;
  //   } catch (error) {
  //     Logger.error(
  //       'Failed to sign typed data with circle wallet. ' +
  //         ' ' +
  //         `${JSON.stringify((error as AxiosError)?.response?.data)}`,
  //       error,
  //       CircleClient.name
  //     );
  //     Logger.error(error, null, CircleClient.name);

  //     throw error;
  //   }
  // }

  // async getTransaction(txId: string) {
  //   const tx = await this.getInternalTransaction(txId);
  //   return CircleClient.mapToEthTransaction(this.config.chainId, tx);
  // }

  // async createWalletSet(organizationId: string, nonce: number) {
  //   try {
  //     const response = await this.client.createWalletSet({
  //       name: `${organizationId}.${nonce}`,
  //       idempotencyKey: uuid(),
  //     });

  //     return response?.data?.walletSet;
  //   } catch (error) {
  //     Logger.error(
  //       'Failed to create wallet set with circle wallet. ' +
  //         ' ' +
  //         `${JSON.stringify((error as AxiosError)?.response?.data)}`,
  //       null,
  //       CircleClient.name
  //     );
  //     Logger.error(error, null, CircleClient.name);

  //     throw error;
  //   }
  // }

  // private async getInternalTransaction(txId: string) {
  //   try {
  //     const res = await this.axiosClient.get<CircleTransactionResponse>(`/v1/w3s/transactions/${txId}`);

  //     return res.data;
  //   } catch (error) {
  //     Logger.error(
  //       'Failed to get transaction with circle wallet. ' + JSON.stringify(txId),
  //       error,
  //       CircleClient.name
  //     );
  //     Logger.error(error, null, CircleClient.name);
  //     throw error;
  //   }
  // }

  // private static mapToEthTransaction(
  //   chainId: number,
  //   latestTransaction: DeepPartial<CircleTransactionResponse>
  // ): Partial<RelayerTransactionResponse> {
  //   const tx = latestTransaction?.data?.transaction;

  //   return {
  //     chainId,
  //     transactionId: tx?.txHash,
  //     from: tx?.sourceAddress,
  //     gasLimit: tx?.estimatedFee?.gasLimit ? toNumber(tx?.estimatedFee?.gasLimit) : null,
  //     gasPrice: tx?.estimatedFee?.baseFee ? toNumber(tx?.estimatedFee?.baseFee) : null,
  //     hash: tx?.txHash,
  //     maxFeePerGas: tx?.estimatedFee?.maxFee ? toNumber(tx?.estimatedFee?.maxFee) : null,
  //     maxPriorityFeePerGas: tx?.estimatedFee?.priorityFee ? toNumber(tx?.estimatedFee?.priorityFee) : null,
  //     nonce: tx?.blockHeight,
  //     speed: tx?.feeLevel as unknown as any,
  //     status: tx?.state as unknown as any,
  //     to: tx?.contractAddress,
  //     data: null,
  //     value: tx?.amount,
  //     validUntil: null,
  //     _internalTxId: tx?.id,
  //   };
  // }

  // private getEntitySecretCipher = () => {
  //   const entitySecret = forge.util.hexToBytes(this.config.entitySecret);

  //   const publicKey = forge.pki.publicKeyFromPem(this.config.publicKey.replace(/\\n/g, '\n'));

  //   const encryptedData = publicKey.encrypt(entitySecret, 'RSA-OAEP', {
  //     md: forge.md.sha256.create(),
  //     mgf1: { md: forge.md.sha256.create() },
  //   });

  //   return forge.util.encode64(encryptedData);
  // };

  // static circleNetworkToChainId(network: string) {
  //   switch (network) {
  //     case 'MATIC':
  //       return ChainId.Polygon;
  //     case 'MATIC-AMOY':
  //       return ChainId.Amoy;
  //     case 'ETH':
  //       return ChainId.Ethereum;
  //     case 'ETH-SEPOLIA':
  //       return ChainId.Sepolia;
  //     case 'ARB':
  //       return ChainId.Arbitrum;
  //     case 'ARB-SEPOLIA':
  //       return ChainId.ArbitrumSepolia;
  //     case 'SOL':
  //       return ChainId.Solana;
  //     case 'SOL-DEVNET':
  //       return ChainId.SolanaDevnet;
  //     default:
  //       throw new ApplicationException(HttpStatus.INTERNAL_SERVER_ERROR, {
  //         message: `Current network is not supported for circle wallet: ${network}`,
  //       });
  //   }
  // }
}

export interface CircleTransactionResponse {
  data: {
    transaction: {
      id: string;
      blockchain: string;
      walletId: string;
      sourceAddress: string;
      contractAddress: string;
      transactionType: string;
      custodyType: string;
      state:
        | 'INITIATED'
        | 'PENDING_RISK_SCREENING'
        | 'DENIED'
        | 'QUEUED'
        | 'SENT'
        | 'CONFIRMED'
        | 'COMPLETE'
        | 'FAILED'
        | 'CANCELLED';
      amounts: any[];
      nfts: any;
      txHash: string;
      blockHash: string;
      blockHeight: number;
      networkFee: string;
      firstConfirmDate: string;
      operation: string;
      feeLevel: string;
      estimatedFee: {
        gasLimit: string;
        baseFee: string;
        priorityFee: string;
        maxFee: string;
      };
      refId: string;
      abiFunctionSignature: string;
      abiParameters: string[];
      amount: string;
      createDate: string;
      updateDate: string;
    };
  };
}

export interface CircleTransactionEstimateResponse {
  data: {
    low: {
      gasLimit: string;
      baseFee: string;
      priorityFee: string;
      maxFee: string;
    };
    medium: {
      gasLimit: string;
      baseFee: string;
      priorityFee: string;
      maxFee: string;
    };
    high: {
      gasLimit: string;
      baseFee: string;
      priorityFee: string;
      maxFee: string;
    };
  };
}
