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

type Validator = {
  add: <T>(input: T, predicateFn: (val: T) => boolean, errorMessage: string) => Validator
  validate(): Either<NonEmptyArray<string>, void>
}

export function createValidator() {
  const functionResults: Array<Either<NonEmptyArray<string>, unknown>> = [];

  return {
    add<T>(input: T, predicateFn: (val: T) => boolean, errorMessage: string): Validator {
      try {
        const result = predicateFn(input);
        functionResults.push(result ? right(null) : lift(left)(errorMessage));
      } catch {
        functionResults.push(lift(left)(errorMessage));
      }
      
      return this;
    },
    validate(): Either<NonEmptyArray<string>, void> {
      return pipe(
        array.sequence(getValidation(getSemigroup<string>()))(functionResults),
        map(() => {})
      )
    }
  };
}