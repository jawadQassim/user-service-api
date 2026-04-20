import { randomUUID } from 'node:crypto';
import { createDatabase } from '../db/database.ts';
import { validate } from '../middleware/validate.ts';
import { loginSchema, registerSchema } from '../schemas/auth.schema.ts';
import type { RequestContext } from '../types/http.ts';
import { comparePassword, hashPassword, isLegacyPasswordHash } from '../utils/hash.ts';
import { readJsonBody, sendJson } from '../utils/http.ts';
import { HttpError } from '../utils/httpError.ts';
import { signToken } from '../utils/jwt.ts';
import { toUserResponse } from '../utils/userResponse.ts';

export const register = async ({ req, res }: RequestContext) => {
  const input = validate(await readJsonBody(req), registerSchema);
  const db = await createDatabase();
  const existingUser = db.data.users.find((user) => user.email === input.email);

  if (existingUser) {
    throw new HttpError(409, 'Email already exists');
  }

  const now = new Date().toISOString();
  const user = {
    id: randomUUID(),
    fullName: input.fullName,
    birthDate: input.birthDate,
    email: input.email,
    passwordHash: await hashPassword(input.password),
    role: 'USER' as const,
    isActive: true,
    createdAt: now,
    updatedAt: now
  };

  db.data.users.push(user);
  await db.write();

  sendJson(res, 201, {
    message: 'User registered successfully',
    token: signToken({ userId: user.id, role: user.role }),
    user: toUserResponse(user)
  });
};

export const login = async ({ req, res }: RequestContext) => {
  const input = validate(await readJsonBody(req), loginSchema);
  const db = await createDatabase();
  const user = db.data.users.find((item) => item.email === input.email);

  if (!user) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const isValidPassword = await comparePassword(input.password, user.passwordHash);
  if (!isValidPassword) {
    throw new HttpError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new HttpError(403, 'User is blocked');
  }

  if (isLegacyPasswordHash(user.passwordHash)) {
    user.passwordHash = await hashPassword(input.password);
    user.updatedAt = new Date().toISOString();
    await db.write();
  }

  sendJson(res, 200, {
    message: 'Login successful',
    token: signToken({ userId: user.id, role: user.role }),
    user: toUserResponse(user)
  });
};
