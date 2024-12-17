// import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
// import { Repository, FindConditions } from 'typeorm';

// interface UniqueValidationArguments<E> extends ValidationArguments {
//   constraints: [((validationArguments: ValidationArguments) => FindConditions<E>) | keyof E];
// }

// export abstract class UniqueValidator<T> implements ValidatorConstraintInterface {
//   protected constructor(protected readonly repository: Repository<T>) {}

//   public async validate<E>(value: string, args: UniqueValidationArguments<E>) {
//     const [findCondition = args.property] = args.constraints;
//     return (
//       (await this.repository.count({
//         where:
//           typeof findCondition === 'function'
//             ? findCondition(args)
//             : {
//                 [findCondition || args.property]: value,
//               },
//       })) <= 0
//     );
//   }

//   public defaultMessage(args: ValidationArguments) {
//     const [EntityClass] = args.constraints;
//     const entity = EntityClass.name || 'Entity';
//     return `${entity} with the same '${args.property}' already exist`;
//   }
// }
