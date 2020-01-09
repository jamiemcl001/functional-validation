import { createValidator, isSuccess, isError, getErrors, getResults } from '../objectValidator';


test(`it should give us an object if we don't want to work with monoids`, () => {
  const validatonResult = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add("test2", val => val.length > 0, "the value should be at least 3 characters")
    .add("test3", val => val.length > 0, "the value should be at least 3 characters")
    .validate();

  expect(isSuccess(validatonResult)).toEqual(true);
  expect(validatonResult.value).toEqual(['test', 'test2', 'test3']);
});


test(`it should give us an array of error messages when working with basic objects`, () => {
  const validatonResult = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add({ inputValue: 20 }, val => val.inputValue > 20, "the input value of the passed object should be greater than 20")
    .add(3, val => val % 2 === 0, "the value should be an even number")
    .validate();

  expect(isError(validatonResult)).toEqual(true)
  const errors = isError(validatonResult) ? validatonResult.errors : null;

  expect(errors).toEqual([
    'the input value of the passed object should be greater than 20',
    'the value should be an even number'
  ]);
});


test('isSuccess', () => {
  const validatonResult = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add("test2", val => val.length > 0, "the value should be at least 3 characters")
    .add("test3", val => val.length > 0, "the value should be at least 3 characters")
    .validate();
  expect(isSuccess(validatonResult)).toEqual(true);


  const validatonResult2 = createValidator()
    .add(20, (val: number) => val > 10, `the value has to be larger than 10`)
    .validate();
  expect(isSuccess(validatonResult2)).toEqual(true);


  const validatonResult3 = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add({ inputValue: 20 }, val => val.inputValue > 20, "the input value of the passed object should be greater than 20")
    .add(3, val => val % 2 === 0, "the value should be an even number")
    .validate();
  expect(isSuccess(validatonResult3)).toEqual(false);
});


test('isError', () => {
  const validatonResult = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add("test2", val => val.length > 0, "the value should be at least 3 characters")
    .add("test3", val => val.length > 0, "the value should be at least 3 characters")
    .validate();
  expect(isError(validatonResult)).toEqual(false);


  const validatonResult2 = createValidator()
    .add(20, (val: number) => val > 10, `the value has to be larger than 10`)
    .validate();
  expect(isError(validatonResult2)).toEqual(false);


  const validatonResult3 = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add({ inputValue: 20 }, val => val.inputValue > 20, "the input value of the passed object should be greater than 20")
    .add(3, val => val % 2 === 0, "the value should be an even number")
    .validate();
  expect(isError(validatonResult3)).toEqual(true);
});


test('getErrors', () => {
  const validatonResult = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add("test2", val => val.length > 0, "the value should be at least 3 characters")
    .add("test3", val => val.length > 0, "the value should be at least 3 characters")
    .validate();
  expect(getErrors(validatonResult)).toEqual([]);


  const validatonResult2 = createValidator()
    .add(20, (val: number) => val > 10, `the value has to be larger than 10`)
    .validate();
  expect(getErrors(validatonResult2)).toEqual([]);


  const validatonResult3 = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add({ inputValue: 20 }, val => val.inputValue > 20, "the input value of the passed object should be greater than 20")
    .add(3, val => val % 2 === 0, "the value should be an even number")
    .validate();
  expect(getErrors(validatonResult3)).toEqual([
    "the input value of the passed object should be greater than 20",
    "the value should be an even number",
  ]);
});


test('getResults', () => {
  const validatonResult = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add("test2", val => val.length > 0, "the value should be at least 3 characters")
    .add("test3", val => val.length > 0, "the value should be at least 3 characters")
    .validate();
  expect(getResults(validatonResult)).toEqual(["test", "test2", "test3"]);


  const validatonResult2 = createValidator()
    .add(20, (val: number) => val > 10, `the value has to be larger than 10`)
    .validate();
  expect(getResults(validatonResult2)).toEqual([20]);


  const validatonResult3 = createValidator()
    .add("test", val => val.length > 0, "the value should be at least 3 characters")
    .add({ inputValue: 20 }, val => val.inputValue > 20, "the input value of the passed object should be greater than 20")
    .add(3, val => val % 2 === 0, "the value should be an even number")
    .validate();
  expect(getResults(validatonResult3)).toEqual([]);
});