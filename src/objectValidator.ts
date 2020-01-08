import { Either, left, mapLeft, right, isRight } from 'fp-ts/lib/Either';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { pipe } from 'fp-ts/lib/pipeable';
import { createValidator as createMonoidValidator } from './monoidValidator';

type Validator = {
  add: <T>(input: T, predicateFn: (val: T) => boolean, errorMessage: string) => Validator
  validate(): ObjectResult
}

type ErrorResult = { _tag: 'error', value: []; errors: string[] }
type SuccessResult = { _tag: 'success', value: unknown[] }
type ObjectResult = ErrorResult | SuccessResult;

export function createValidator() {
  const monoidValidator = createMonoidValidator();

  return {
    add<T>(input: T, predicateFn: (val: T) => boolean, errorMessage: string): Validator {
      monoidValidator.add(input, predicateFn, errorMessage);
      return this;
    },
    validate(): ObjectResult {
      const result = monoidValidator.validate();
      
      return isRight(result) ? 
        { _tag: 'success', value: result.right } :
        { _tag: 'error', value: [], errors: result.left };
    }
  };
}

export function isSuccess(input: ObjectResult): input is SuccessResult {
  return input._tag === 'success';
}

export function isError(input: ObjectResult): input is ErrorResult {
  return input._tag === 'error';
}