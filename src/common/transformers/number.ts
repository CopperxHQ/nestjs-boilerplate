import { toNumber, trim } from 'lodash';
import { ValueTransformer } from 'typeorm';

export const NumberTransformer: ValueTransformer = {
  to: (entityValue: number) => entityValue,
  from: (databaseValue: string): number => {
    return databaseValue == null ||
      typeof databaseValue === 'boolean' ||
      (typeof databaseValue === 'string' && (databaseValue === '' || trim(databaseValue) === ''))
      ? null
      : typeof databaseValue === 'number'
        ? (databaseValue as number)
        : toNumber(databaseValue);
  },
};
