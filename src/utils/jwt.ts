import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '../config/env.ts';
import { HttpError } from './httpError.ts';
import type { JwtPayload, Role } from '../types/user.ts';

const toBase64Url = (value: Buffer | string) => {
  const buffer = Buffer.isBuffer(value) ? value : Buffer.from(value);

  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
};

const parseBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return Buffer.from(padded, 'base64');
};

export const signToken = (payload: { userId: string; role: Role }) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const body: JwtPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
  };

  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedBody = toBase64Url(JSON.stringify(body));
  const content = `${encodedHeader}.${encodedBody}`;
  const signature = createHmac('sha256', env.jwtSecret).update(content).digest();

  return `${content}.${toBase64Url(signature)}`;
};

export const verifyToken = (token: string) => {
  const parts = token.split('.');

  if (parts.length !== 3) {
    throw new HttpError(401, 'Invalid or expired token');
  }

  const [encodedHeader, encodedBody, encodedSignature] = parts;
  const content = `${encodedHeader}.${encodedBody}`;
  const expectedSignature = createHmac('sha256', env.jwtSecret).update(content).digest();
  const actualSignature = parseBase64Url(encodedSignature);

  if (
    actualSignature.length !== expectedSignature.length ||
    !timingSafeEqual(actualSignature, expectedSignature)
  ) {
    throw new HttpError(401, 'Invalid or expired token');
  }

  const payload = JSON.parse(parseBase64Url(encodedBody).toString('utf8')) as JwtPayload;

  if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
    throw new HttpError(401, 'Invalid or expired token');
  }

  return payload;
};
