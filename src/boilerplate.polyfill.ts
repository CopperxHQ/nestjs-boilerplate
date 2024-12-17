import 'source-map-support/register';
import { Logger } from '@nestjs/common';
import { FindOptionsWhere, EntityMetadata, QueryBuilder, InstanceChecker } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { WhereClauseCondition } from 'typeorm/query-builder/WhereClause';

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

// Use this until there is not a way to provider custom query builder
// This is done to handle this issue, where typeorm's current default behavior is dangerous
// https://github.com/typeorm/typeorm/issues/9316

// Use Equal all places to avoid this issue, But following functions are here to make sure we don't miss any place
const originalGetWherePredicateCondition = SelectQueryBuilder.prototype['getWherePredicateCondition'];
QueryBuilder.prototype['getWherePredicateCondition'] = function (
  aliasPath: string,
  parameterValue: any
): WhereClauseCondition {
  if (!InstanceChecker.isFindOperator(parameterValue)) {
    if (parameterValue === undefined || parameterValue === null) {
      Logger.warn(
        {
          message: `getWherePredicateCondition: ${aliasPath} is undefined or null`,
          aliasPath,
          parameterValue,
        },
        QueryBuilder.name
      );
      // Temporary not throwing error to find out all places where issue is happening
      // throw new Error(`Cannot search for null or undefined value for ${aliasPath} in query builder`);
    }
  }

  return originalGetWherePredicateCondition.call(this, aliasPath, parameterValue);
};

const originalBuildWhere = SelectQueryBuilder.prototype['buildWhere'];
SelectQueryBuilder.prototype['buildWhere'] = function (
  where: FindOptionsWhere<any>[] | FindOptionsWhere<any>,
  metadata: EntityMetadata,
  alias: string,
  embedPrefix?: string
): string {
  if (!Array.isArray(where)) {
    for (const key in where) {
      if (where[key] === undefined || where[key] === null) {
        Logger.warn(
          {
            message: `buildWhere: ${embedPrefix ?? ''}${alias}.${key} is undefined or null`,
            where,
            alias,
            embedPrefix,
          },
          SelectQueryBuilder.name
        );
        // Temporary not throwing error to find out all places where issue is happening
        // throw new Error(`Cannot search for null or undefined value for ${embedPrefix ?? ''}${alias}.${key}`);
      }
    }
  }

  return originalBuildWhere.call(this, where, metadata, alias, embedPrefix);
};
