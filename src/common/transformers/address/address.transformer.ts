import { FindOperator, ValueTransformer } from 'typeorm';
import { Address } from './address';

export const AddressTransformer: ValueTransformer = {
  to: (entityValue: string | Address | FindOperator<string | Address>) => {
    if (entityValue instanceof FindOperator) {
      return new FindOperator(
        entityValue.type,
        Array.isArray(entityValue.value)
          ? entityValue.value.map((value) => Address.from(value).toJSON())
          : Address.from(entityValue.value).toJSON(),
        entityValue.useParameter,
        entityValue.multipleParameters
      );
    } else {
      return entityValue && Address.from(entityValue).toJSON();
    }
  },
  from: (databaseValue: string) => {
    return Address.from(databaseValue);
  },
};
