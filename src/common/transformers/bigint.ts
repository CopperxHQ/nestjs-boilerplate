import { trim } from 'lodash';
import { ValueTransformer } from 'typeorm';

export const BigIntTransformer: ValueTransformer = {
  to: (entityValue: bigint) => entityValue,
  from: (databaseValue: string): bigint => {
    return databaseValue == null ||
      typeof databaseValue === 'boolean' ||
      (typeof databaseValue === 'string' && trim(databaseValue) === '')
      ? null
      : BigInt(databaseValue);
  },
};
