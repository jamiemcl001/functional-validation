import { createValidator } from '../validator';
import { isLeft, isRight, fold } from 'fp-ts/lib/Either';

test('it should evaluate the predicates correctly', () => {
  const largerThan10 = (val: number) => val > 10;
  const isEvenNumber = (val: number) => val % 2 === 0;

  const validatorFailure = createValidator();
  const returnValFailure = validatorFailure
    .add(9, largerThan10, `the value has to be larger than 10`)
    .validate();

  expect(isLeft(returnValFailure)).toEqual(true);
  expect(fold(errorVal => errorVal, successVal => successVal)(returnValFailure))
    .toEqual(["the value has to be larger than 10"]);



  const validatorSuccess = createValidator();
  const returnValSuccess = validatorSuccess
    .add(20, largerThan10, `the value has to be larger than 10`)
    .validate();

  expect(isRight(returnValSuccess)).toEqual(true);



  const validatorMultipleFailure = createValidator();
  const returnValMultipleFailure = validatorMultipleFailure
    .add(9, largerThan10, `the value has to be larger than 10`)
    .add(9, isEvenNumber, `the value should be an odd number`)
    .validate();

  expect(isLeft(returnValMultipleFailure)).toEqual(true);
  expect(fold(errorVal => errorVal, successVal => successVal)(returnValMultipleFailure))
    .toEqual(["the value has to be larger than 10", "the value should be an odd number"]);
});


test('it should work with validators with no set type', () => {
  const validatonResult = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add({ inputValue: 20 }, val => val.inputValue > 20, "the input value of the passed object should be greater than 20")
    .add(3, val => val % 2 === 0, "the value should be an even number")
    .validate();

  expect(isLeft(validatonResult)).toEqual(true)
  expect(fold(errorVal => errorVal, successVal => successVal)(validatonResult))
    .toEqual(["the input value of the passed object should be greater than 20", "the value should be an even number"]);
})