import { PublicKey } from '@solana/web3.js';
import { isAddress } from 'viem';
import { isEmpty, startsWith } from 'lodash';
import { utils as TronWebUtils } from 'tronweb';
import { ChainType } from '../../../database/entities/chain.entity';

// const TRON_ADDRESS_SIZE = 34; // for base58

const ethRegex = /^0x[a-fA-F0-9]{40}$/;
const tronRegex = /^T[a-zA-Z0-9]{33}$/;
// const solanaRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

/**
 * Address utility class
 */
export class Address {
  static readonly EVM_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  static readonly TRON_ZERO_ADDRESS = 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb'; // TronWebUtils.address.fromHex(ZERO_ADDRESS);
  static readonly SOLANA_PROGRAM_ID = '11111111111111111111111111111111';
  static readonly SOL_TOKEN_ADDRESS = 'So11111111111111111111111111111111111111112';

  protected constructor(private readonly value: string) {}

  static isValid(value: string): boolean {
    if (isEmpty(value)) {
      return false;
    }

    // If Ethereum address then lower case it
    if (ethRegex.test(value)) {
      return Address.validateEthereumAddress(value.toLowerCase());
    }

    // Check if it is Tron address
    if (tronRegex.test(value)) {
      return Address.validateTronAddress(value);
    }

    return Address.validateSolanaAddress(value);
  }

  static isValidForChain(value: string, chainType: ChainType): boolean {
    if (isEmpty(value)) {
      return false;
    }
    if (chainType === ChainType.Evm) {
      return ethRegex.test(value) && Address.validateEthereumAddress(value);
    }

    if (chainType === ChainType.Tron) {
      return tronRegex.test(value) && Address.validateTronAddress(value);
    }

    if (chainType === ChainType.Solana) {
      return Address.validateSolanaAddress(value);
    }

    return Address.isValid(value);
  }

  static validateEthereumAddress(addr: string) {
    return isAddress(addr);
  }

  static validateTronAddress(addr: string) {
    return TronWebUtils.address.isAddress(addr);
  }

  static validateSolanaAddress(addr: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const key = new PublicKey(addr);
      // return await PublicKey.isOnCurve(publicKey.toBytes());
      return true;
    } catch (err) {
      return false;
    }
  }

  static from(value: string | Address): Address {
    if (value instanceof Address) {
      return value;
    }

    if (isEmpty(value)) {
      return null;
    }

    value = value.toString();

    // If Ethereum address then lower case it
    if (value.startsWith('0x')) {
      value = value.toLowerCase();
    }

    return new Address(value);
  }

  equals(address: Address | string): boolean {
    if (address == null) {
      return false;
    }

    if (typeof address === 'string') {
      const address2 = Address.from(address);
      return Address.compareAddresses(this, address2);
    }

    return this.value === address.value;
  }

  isZeroAddress(): boolean {
    if (this.value === Address.EVM_ZERO_ADDRESS) {
      return true;
    }

    if (this.value === Address.TRON_ZERO_ADDRESS) {
      return true;
    }

    if (this.value === Address.SOLANA_PROGRAM_ID) {
      return true;
    }

    // We are considering native token as zero address as well
    if (this.value === Address.SOL_TOKEN_ADDRESS) {
      return true;
    }

    return false;
  }

  static compare(address1: Address | string, address2: Address | string): boolean {
    const add1 = typeof address1 === 'string' ? Address.from(address1) : address1;
    const add2 = typeof address2 === 'string' ? Address.from(address2) : address2;

    return Address.compareAddresses(add1, add2);
  }

  private static compareAddresses(address1: Address, address2: Address): boolean {
    return address1.toString() === address2.value.toString();
  }

  toString(): string {
    return this.value;
  }

  toJSON(): string {
    return this.toString();
  }

  toSolanaPubKey(): PublicKey {
    return new PublicKey(this.toString());
  }

  isSolanaAddress(): boolean {
    return Address.validateSolanaAddress(this.value);
  }

  isTronAddress(): boolean {
    return tronRegex.test(this.value) && TronWebUtils.address.isAddress(this.value);
  }

  toTronHexAddress(): string {
    if (this.value.startsWith('0x')) {
      return this.value;
    }

    if (this.value.length === 42 && this.value.startsWith('41')) {
      // Replace starting two character 41 with zero and return
      return '0x' + this.value.substring(2);
    }

    const add = TronWebUtils.address.toHex(this.value);

    return '0x' + add.substring(2);
  }

  static tronHexAddress(address: string): string {
    return Address.from(address).toTronHexAddress();
  }

  static tronAddressFromHex(hex: string): Address {
    // If it is already in hex format then return as it is
    if (hex.startsWith('0x')) {
      return Address.from(TronWebUtils.address.fromHex(`41${hex.substring(2)}`));
    }

    if (hex.length === 42 && hex.startsWith('41')) {
      // Replace starting two character 41 with zero and return
      return Address.from(TronWebUtils.address.fromHex(hex));
    }

    throw new Error('Invalid hex address');
  }
}
