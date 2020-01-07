import { validate } from '../validator';
import { left, right, isLeft, fold } from 'fp-ts/lib/Either';

test('it should evaluate the predicates correctly', () => {
  const fnPredicates = [(val: number) => {
    return val > 10 ? left("the value has to be larger than 10") : right(val);
  }]
  const returnVal = validate(fnPredicates, 20);

  expect(isLeft(returnVal)).toBeTruthy();
  expect(fold(errorVal => errorVal, successVal => successVal)(returnVal))
    .toEqual(["the value has to be larger than 10"])
});