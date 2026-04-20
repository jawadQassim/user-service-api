import { HttpError } from './httpError.ts';

export const asRecord = (value: unknown, fieldName = 'body') => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new HttpError(400, 'Validation error', [{ path: fieldName, message: `${fieldName} must be an object` }]);
  }

  return value as Record<string, unknown>;
};

export const requireString = (
  value: unknown,
  field: string,
  minLength: number,
  maxLength: number
) => {
  if (typeof value !== 'string') {
    throw new HttpError(400, 'Validation error', [{ path: field, message: `${field} must be a string` }]);
  }

  if (value.length < minLength) {
    throw new HttpError(400, 'Validation error', [{ path: field, message: `${field} is too short` }]);
  }

  if (value.length > maxLength) {
    throw new HttpError(400, 'Validation error', [{ path: field, message: `${field} is too long` }]);
  }

  return value;
};

export const requireBoolean = (value: unknown, field: string) => {
  if (typeof value !== 'boolean') {
    throw new HttpError(400, 'Validation error', [{ path: field, message: `${field} must be a boolean` }]);
  }

  return value;
};

export const requireEmail = (value: unknown, field: string) => {
  const email = requireString(value, field, 3, 320).toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, 'Validation error', [{ path: field, message: 'Invalid email' }]);
  }

  return email;
};
