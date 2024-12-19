import { Column } from 'typeorm';
import { ColumnCommonOptions } from 'typeorm/decorator/options/ColumnCommonOptions';

export function UuidColumn(options?: ColumnCommonOptions): PropertyDecorator {
  return Column('uuid', options);
}
