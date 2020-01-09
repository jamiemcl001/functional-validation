import { Either, left, mapLeft, right, isRight } from 'fp-ts/lib/Either';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { pipe } from 'fp-ts/lib/pipeable';
import { createValidator as createMonoidValidator } from './monoidValidator';

export type ObjectValidator = {
  add: <T>(input: T, predicateFn: (val: T) => boolean, errorMessage: string) => ObjectValidator
  validate(): ObjectResult
}

type ErrorResult = { _tag: 'error', value: []; errors: string[] }
type SuccessResult = { _tag: 'success', value: unknown[] }
type ObjectResult = ErrorResult | SuccessResult;

export function createValidator() {
  const errorMessages: string[] = [];
  const capturedValues: unknown[] = [];

  return {
    add<T>(input: T, predicateFn: (val: T) => boolean, errorMessage: string): ObjectValidator {
      try {
        const result = predicateFn(input);
        if (!result) {
          errorMessages.push(errorMessage);
        } else {
          capturedValues.push(input);
        }
      } catch {
        errorMessages.push(errorMessage);
      }
      
      return this;
    },
    validate(): ObjectResult {
      return errorMessages.length === 0 ? 
        { _tag: 'success', value: capturedValues } :
        { _tag: 'error', value: [], errors: errorMessages };
    }
  };
}

export function isSuccess(input: ObjectResult): input is SuccessResult {
  return input._tag === 'success';
}

export function isError(input: ObjectResult): input is ErrorResult {
  return input._tag === 'error';
}