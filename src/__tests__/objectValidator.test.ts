import { createValidator, isSuccess, isError, getErrors, getResults } from '../objectValidator';


test(`it should give us an object if we don't want to work with monoids`, () => {
  const validationResult = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add("test2", val => val.length > 0, "the value should be at least 3 characters")
    .add("test3", val => val.length > 0, "the value should be at least 3 characters")
    .validate();

  expect(isSuccess(validationResult)).toEqual(true);
  expect(validationResult.value).toEqual(['test', 'test2', 'test3']);
});


test(`it should give us an array of error messages when working with basic objects`, () => {
  const validationResult = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add({ inputValue: 20 }, val => val.inputValue > 20, "the input value of the passed object should be greater than 20")
    .add(3, val => val % 2 === 0, "the value should be an even number")
    .validate();

  expect(isError(validationResult)).toEqual(true)
  const errors = isError(validationResult) ? validationResult.errors : null;

  expect(errors).toEqual([
    'the input value of the passed object should be greater than 20',
    'the value should be an even number'
  ]);
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