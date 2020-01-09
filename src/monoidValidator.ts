import { array } from 'fp-ts/lib/Array';
import { Either, getValidation, left, map, mapLeft, right, isRight, isLeft, Left, Right } from 'fp-ts/lib/Either';
import { getSemigroup, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { pipe } from 'fp-ts/lib/pipeable';

type MonoidResult = Either<NonEmptyArray<string>, unknown>;

function lift<L, A> (check: (l: L) => Either<L, A>): (l: L) => Either<NonEmptyArray<L>, A> {
  return l => pipe(check(l), mapLeft(l => [l]));
}

export type MonoidValidator = {
  add: <T>(input: T, predicateFn: (val: T) => boolean, errorMessage: string) => MonoidValidator
  validate(): MonoidResult
}

export function createValidator() {
  const functionResults: Array<MonoidResult> = [];

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

export function isSuccess<R>(input: Either<unknown, R>): input is Right<R> {
  return isRight(input);
}

export function isError<E>(input: Either<NonEmptyArray<E>, unknown>): input is Left<NonEmptyArray<E>> {
  return isLeft(input);
}

export function getErrors(result: MonoidResult): string[] {
  return isLeft(result) ? result.left : [];
};

export function getResults(result: MonoidResult): unknown {
  return isRight(result) ? result.right : [];
};