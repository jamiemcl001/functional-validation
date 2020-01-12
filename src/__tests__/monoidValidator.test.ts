import { createValidator, isSuccess, isError, getErrors, getResults } from '../monoidValidator';
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
  const validationResult = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add({ inputValue: 20 }, val => val.inputValue > 20, "the input value of the passed object should be greater than 20")
    .add(3, val => val % 2 === 0, "the value should be an even number")
    .validate();

  expect(isLeft(validationResult)).toEqual(true)
  expect(fold(errorVal => errorVal, successVal => successVal)(validationResult))
    .toEqual(["the input value of the passed object should be greater than 20", "the value should be an even number"]);
});


test('it should concatenate the results', () => {
  const validationResult = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add("test2", val => val.length > 0, "the value should be at least 3 characters")
    .add("test3", val => val.length > 0, "the value should be at least 3 characters")
    .validate();

  expect(isRight(validationResult)).toEqual(true);
  expect(isRight(validationResult) && validationResult.right).toEqual(["test", "test2", "test3"]);
});


test('isSuccess', () => {
  const validationResult = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add("test2", val => val.length > 0, "the value should be at least 3 characters")
    .add("test3", val => val.length > 0, "the value should be at least 3 characters")
    .validate();
  expect(isSuccess(validationResult)).toEqual(true);


  const validationResult2 = createValidator()
    .add(20, (val: number) => val > 10, `the value has to be larger than 10`)
    .validate();
  expect(isSuccess(validationResult2)).toEqual(true);


  const validationResult3 = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add({ inputValue: 20 }, val => val.inputValue > 20, "the input value of the passed object should be greater than 20")
    .add(3, val => val % 2 === 0, "the value should be an even number")
    .validate();
  expect(isSuccess(validationResult3)).toEqual(false);
});


test('isError', () => {
  const validationResult = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add("test2", val => val.length > 0, "the value should be at least 3 characters")
    .add("test3", val => val.length > 0, "the value should be at least 3 characters")
    .validate();
  expect(isError(validationResult)).toEqual(false);


  const validationResult2 = createValidator()
    .add(20, (val: number) => val > 10, `the value has to be larger than 10`)
    .validate();
  expect(isError(validationResult2)).toEqual(false);


  const validationResult3 = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add({ inputValue: 20 }, val => val.inputValue > 20, "the input value of the passed object should be greater than 20")
    .add(3, val => val % 2 === 0, "the value should be an even number")
    .validate();
  expect(isError(validationResult3)).toEqual(true);
});


test('getErrors', () => {
  const validationResult = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add("test2", val => val.length > 0, "the value should be at least 3 characters")
    .add("test3", val => val.length > 0, "the value should be at least 3 characters")
    .validate();
  expect(getErrors(validationResult)).toEqual([]);


  const validationResult2 = createValidator()
    .add(20, (val: number) => val > 10, `the value has to be larger than 10`)
    .validate();
  expect(getErrors(validationResult2)).toEqual([]);


  const validationResult3 = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add({ inputValue: 20 }, val => val.inputValue > 20, "the input value of the passed object should be greater than 20")
    .add(3, val => val % 2 === 0, "the value should be an even number")
    .validate();
  expect(getErrors(validationResult3)).toEqual([
    "the input value of the passed object should be greater than 20",
    "the value should be an even number",
  ]);
});


test('getResults', () => {
  const validationResult = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add("test2", val => val.length > 0, "the value should be at least 3 characters")
    .add("test3", val => val.length > 0, "the value should be at least 3 characters")
    .validate();
  expect(getResults(validationResult)).toEqual(["test", "test2", "test3"]);


  const validationResult2 = createValidator()
    .add(20, (val: number) => val > 10, `the value has to be larger than 10`)
    .validate();
  expect(getResults(validationResult2)).toEqual([20]);


  const validationResult3 = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add({ inputValue: 20 }, val => val.inputValue > 20, "the input value of the passed object should be greater than 20")
    .add(3, val => val % 2 === 0, "the value should be an even number")
    .validate();
  expect(getResults(validationResult3)).toEqual([]);
});


test('if the add function throws an error - it should result in a failure', () => {
  const validationResult = createValidator()
    .add("test", val => { throw new Error("Random Error") }, "the input value should be valid")
    .validate()
  expect(getErrors(validationResult)).toEqual(["the input value should be valid"]);
});