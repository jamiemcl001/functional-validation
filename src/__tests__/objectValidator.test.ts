import { createValidator, isSuccess, isError } from '../objectValidator';


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