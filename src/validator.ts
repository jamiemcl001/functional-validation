import { createValidator as createMonoidValidator } from './monoidValidator';
import { createValidator as createObjectValidator } from './objectValidator';

export const getMonoidValidator = () => createMonoidValidator();
export const getObjectValidator = () => createObjectValidator();
