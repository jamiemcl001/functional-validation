# Predicates Validator

[![CircleCI](https://circleci.com/gh/jamiemcl001/predicate-validation/tree/master.svg?style=svg)](https://circleci.com/gh/jamiemcl001/predicate-validation/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/jamiemcl001/predicate-validation/badge.svg?branch=master)](https://coveralls.io/github/jamiemcl001/predicate-validation?branch=master)
[![NPM](https://img.shields.io/npm/v/predicate-validation)](https://npmjs.com/package/predicate-validation)

Allows you to provide an array of predicate functions as well as an input value and have an easy to use collection of error messages or valid result passed back to you.

## API

The API for the two validators are the same, the only thing that differs is the return type from the `validate` function.

### Object Validator

This version of the validator will return a discriminatave union object which will allow you to easily differentiate between an error and a success result. The property that will be the basis of the [discriminated union](https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions) is `_tag`, and it will be equal to either `success` or `error`.

### Monoid Validator

This validator will return an Either object (as defined by [fp-ts](https://gcanti.github.io/fp-ts/modules/Either.ts.html), as this is the package that is used in this project). It's return types if an error will be of type `string[]`, which will be the list of error messages, whereas if it's a successful validation then the value will be of type `unknown[]`. This is because the predicates validator will simply return all of the values that were passed into the chain.

### Standard Functions

#### `getObjectValidator() => ObjectValidator`

This will return an ObjectValidator that you can then chain predicate validation functions to, before validating it.

Example:
```javascript
import { getObjectValidator } from 'predicate-validator';
const validationResult = getObjectValidator().validate()
```

#### `getMonoidValidator() => MonoidValidator`

This will return a MonoidValidator that you can then chain predicate validation functions to, before validating it.

Example:
```javascript
import { getMonoidValidator } from 'predicate-validator';
const validationResult = getMonoidValidator().validate();
```

### Validator Functions

These functions are available on a Validator instance. You can invoke them in the following way:

```javascript
import { getObjectValidator } from 'predicate-validator';

const validator = getObjectValidator()
  .add("test", val => val.length > 1, "the inputted value must have at least one character")
  .add("test", val => val.length < 30, "the inputted value must not exceed 30 characters")
  .validate();
```

#### `add(inputVal: unknown, predicateFn: (val: unknown) => boolean, errorMessage: string) => Validator`
Parameters:
* `inputVal: unknown` - this can be any value that you wish to perform validation against.
* `predicateFn: (val: unknown) => boolean` - this function will be executed using the input value to determine if it should pass validation.
* `errorMessage: string` - this error message will be present in the errors array if the predicate function fails.

Returns:
* `Validator` - The object that this function was invoked on will be returned, to allow for chaining.

#### `validate() => ValidationResult`
Returns:
* `ValidationResult` - this will either be a success or error object, depending on the type of validator you have invoked this on. If it is a `MonoidValidator` then you will be returned with an `Either` object (as defined [here](https://gcanti.github.io/fp-ts/modules/Either.ts.html)). If it is an ObjectValidator then you will be returned with an object that has a discriminated union property (the property is `_tag`). You can also use the helper functions listed below to extract the values if you don't want to do anything else with the result.

---

> If you want to work directly with the ObjectValidator/MonoidValidator API's, instead of using a function such as `getObjectValidator()` or `getMonoidValidator()` then you can import the individual files directly:

```javascript
import { createValidator, isSuccess, getResults } from 'predicate-validation/lib/objectValidator'

OR

import { createValidator, isSuccess, getResults } from 'predicate-validation/lib/monoidValidator'
```

### Helper Functions

These helper functions will work in the same way with both the Object Validator and the Monoid Validator.

#### `isError(ValidationResult) => boolean`
**This is the same API in both objectValidator and monoidValidator so you must directly import the functions from the objectValidator/monoidValidator directly to use.**

Examples:
```javascript
import { createValidator, isError } from 'predicate-validation/lib/objectValidator';

const input = 10;
const validationResultSuccess = createValidator()
  .add(input, val => val > 0, "The inputted value should be a positive number")
  .validate()

console.log(isError(validationResultSuccess)) // => false
```

```javascript
import { createValidator, isError } from 'predicate-validation/lib/objectValidator';

const input = 10;
const validationResultSuccess = createValidator()
  .add(input, val => val > 20, "The inputted value should be greater than 20")
  .validate()

console.log(isError(validationResultSuccess)) // => true
```

#### `isSuccess(ValidationResult) => boolean`
**This is the same API in both objectValidator and monoidValidator so you must directly import the functions from the objectValidator/monoidValidator directly to use.**

Examples:
```javascript
import { createValidator, isSuccess } from 'predicate-validation/lib/objectValidator';

const input = 10;
const validationResultSuccess = createValidator()
  .add(input, val => val > 0, "The inputted value should be a positive number")
  .validate()

console.log(isSuccess(validationResultSuccess)) // => true
```

```javascript
import { createValidator, isSuccess } from 'predicate-validation/lib/objectValidator';

const input = 10;
const validationResultSuccess = createValidator()
  .add(input, val => val > 20, "The inputted value should be greater than 20")
  .validate()

console.log(isSuccess(validationResultSuccess)) // => false
```

#### `getErrors(ValidationResult) => string[]`
**This is the same API in both objectValidator and monoidValidator so you must directly import the functions from the objectValidator/monoidValidator directly to use.**

If the passed validationResult is a success result then you will be returned an empty array, otherwise you will be returned an array of error messages that were encountered.

Example:
```javascript
import { createValidator, getErrors } from 'predicate-validation/lib/objectValidator';

const input = 10;
const validationResult = createValidator()
  .add(input, val => val > 0, "The inputted value should be a positive number")
  .add(input, val => val > 20, "The inputted value should be greater than 20") // => ERROR
  .validate();

console.log(getErrors(validationResult)); // => ["The inputted value should be greater than 20"]
```

#### `getResults(ValidationResult) => unknown[]`
**This is the same API in both objectValidator and monoidValidator so you must directly import the functions from the objectValidator/monoidValidator directly to use.**

As defined by the Either pattern, a result can only be either a success or a failure. For this reason if there are any errors among the validation then this package will not return any results (even if there are successful checks within the chain).

Example:
```javascript
import { createValidator, getResults } from 'predicate-validation/lib/objectValidator';

const input = 10;
const validationResult = createValidator()
  .add(input, val => val > 0, "The inputted value should be a positive number") // => SUCCESS
  .add(input, val => val > 20, "The inputted value should be greater than 20") // => ERROR
  .validate();

console.log(getResults(validationResult)); // => []
```

Example:
```javascript
import { createValidator, getErrors } from 'predicate-validation/lib/objectValidator';

const name = "Angela";
const age = 28;

const validationResult = createValidator()
  .add(name, val => !!val, "A valid name of at least 1 character has to be passed") // => SUCCESS
  .add(age, val => val > 18, "A user has to be at least 18 to use the service") // => SUCCESS
  .validate();

console.log(getResults(validationResult)); // => ["Angela", 28]
```