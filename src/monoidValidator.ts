import { array } from 'fp-ts/lib/Array';
import { Either, getValidation, left, map, mapLeft, right, isRight } from 'fp-ts/lib/Either';
import { getSemigroup, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { pipe } from 'fp-ts/lib/pipeable';

function lift<L, A> (check: (l: L) => Either<L, A>): (l: L) => Either<NonEmptyArray<L>, A> {
  return l => pipe(check(l), mapLeft(l => [l]));
}

export type MonoidValidator = {
  add: <T>(input: T, predicateFn: (val: T) => boolean, errorMessage: string) => MonoidValidator
  validate(): Either<NonEmptyArray<string>, unknown>
}

export function createValidator() {
  const functionResults: Array<Either<NonEmptyArray<string>, unknown>> = [];

  return {
    add<T>(input: T, predicateFn: (val: T) => boolean, errorMessage: string): MonoidValidator {
      try {
        const result = predicateFn(input);
        functionResults.push(result ? right(input) : lift(left)(errorMessage));
      } catch {
        functionResults.push(lift(left)(errorMessage));
      }
      
      return this;
    },
    validate(): Either<NonEmptyArray<string>, unknown[]> {
      return pipe(
        array.sequence(getValidation(getSemigroup<string>()))(functionResults),
      );
    }
  };
}