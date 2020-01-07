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

export function validate<T>(validationFunctions: Array <(val: T) => Either<string, T>>, value: T) {
  const functions = validationFunctions.map(fn => lift(fn)(value))

  return pipe(
    array.sequence(getValidation(getSemigroup<string>()))(functions),
    map(() => value)
  );
}