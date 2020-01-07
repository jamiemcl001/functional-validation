import { createValidator } from '../validator';
import { isLeft, isRight, fold } from 'fp-ts/lib/Either';

test('it should evaluate the predicates correctly', () => {
  const largerThan10 = (val: number) => val > 10;
  const isEvenNumber = (val: number) => val % 2 === 0;

  const validatorFailure = createValidator<number>();
  const returnValFailure = validatorFailure
    .add(largerThan10, 9, `the value has to be larger than 10`)
    .validate();

  expect(isLeft(returnValFailure)).toBeTruthy();
  expect(fold(errorVal => errorVal, successVal => successVal)(returnValFailure))
    .toEqual(["the value has to be larger than 10"]);



  const validatorSuccess = createValidator<number>();
  const returnValSuccess = validatorSuccess
    .add(largerThan10, 20, `the value has to be larger than 10`)
    .validate();

  expect(isRight(returnValSuccess)).toBeTruthy();



  const validatorMultipleFailure = createValidator<number>();
  const returnValMultipleFailure = validatorMultipleFailure
    .add(largerThan10, 9, `the value has to be larger than 10`)
    .add(isEvenNumber, 9, `the value should be an odd number`)
    .validate();

  expect(isLeft(returnValMultipleFailure)).toBeTruthy();
  expect(fold(errorVal => errorVal, successVal => successVal)(returnValMultipleFailure))
    .toEqual(["the value has to be larger than 10", "the value should be an odd number"]);
});