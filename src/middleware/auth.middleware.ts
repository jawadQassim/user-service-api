import type { IncomingMessage } from 'node:http';
import { createDatabase } from '../db/database.ts';
import { HttpError } from '../utils/httpError.ts';
import { verifyToken } from '../utils/jwt.ts';

export const authenticate = async (req: IncomingMessage) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HttpError(401, 'Unauthorized');
  }

  const token = authHeader.slice('Bearer '.length);
  const payload = verifyToken(token);
  const db = await createDatabase();
  const user = db.data.users.find((item) => item.id === payload.userId);

  if (!user) {
    throw new HttpError(401, 'Unauthorized');
  }

  if (!user.isActive) {
    throw new HttpError(403, 'User is blocked');
  }

  return {
    userId: user.id,
    role: user.role,
    user
  };
};
