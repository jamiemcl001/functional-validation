import { array } from 'fp-ts/lib/Array';
import { Either, getValidation, left, map, mapLeft, right } from 'fp-ts/lib/Either';
import { getSemigroup, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { pipe } from 'fp-ts/lib/pipeable';

function lift<L, A> (check: (a: A) => Either <L, A>): (a: A) => Either <NonEmptyArray<L>, A> {
  return a =>
    pipe(
      check(a),
      mapLeft(a => [a])
    );
}

type ValidationFunctionWrapper<T> = {
  predicateFn: (val: T) => boolean,
  input: T,
  errorMessage: string,
}

type Validator = {
  add: <T>(input: T, predicateFn: (val: T) => boolean, errorMessage: string) => Validator
  validate(): Either<NonEmptyArray<string>, void>
}

export function createValidator() {
  let validationFunctions: Array<ValidationFunctionWrapper<any>> = [];

  return {
    add<T>(input: T, predicateFn: (val: T) => boolean, errorMessage: string): Validator {
      validationFunctions = [...validationFunctions, { predicateFn, input, errorMessage, }];
      return this;
    },
    validate(): Either<NonEmptyArray<string>, void> {
      const functionResults = validationFunctions.map(fn => {
        const result = fn.predicateFn(fn.input);
        return result ? right(null) : lift(left)(fn.errorMessage);
      });

      return pipe(
        array.sequence(getValidation(getSemigroup<string>()))(functionResults),
        map(() => {})
      );
    }
  };
}