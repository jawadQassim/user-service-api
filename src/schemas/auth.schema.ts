import { HttpError } from '../utils/httpError.ts';
import { asRecord, requireEmail, requireString } from '../utils/validation.ts';

export interface RegisterInput {
  fullName: string;
  birthDate: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const registerSchema = (value: unknown): RegisterInput => {
  const body = asRecord(value);
  const fullName = requireString(body.fullName, 'fullName', 3, 100);
  const birthDate = requireString(body.birthDate, 'birthDate', 10, 10);
  const email = requireEmail(body.email, 'email');
  const password = requireString(body.password, 'password', 8, 100);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    throw new HttpError(400, 'Validation error', [
      { path: 'birthDate', message: 'birthDate must be YYYY-MM-DD' }
    ]);
  }

  return {
    fullName,
    birthDate,
    email,
    password
  };
};

export const loginSchema = (value: unknown): LoginInput => {
  const body = asRecord(value);

  return {
    email: requireEmail(body.email, 'email'),
    password: requireString(body.password, 'password', 8, 100)
  };
};
