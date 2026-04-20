import { createDatabase } from '../db/database.ts';
import { authenticate } from '../middleware/auth.middleware.ts';
import { authorizeRoles } from '../middleware/role.middleware.ts';
import { validate } from '../middleware/validate.ts';
import { blockUserSchema, userIdParamSchema } from '../schemas/user.schema.ts';
import type { RequestContext } from '../types/http.ts';
import { sendJson, readJsonBody } from '../utils/http.ts';
import { HttpError } from '../utils/httpError.ts';
import { toUserResponse } from '../utils/userResponse.ts';

export const getUserById = async ({ req, res, params }: RequestContext) => {
  const currentUser = await authenticate(req);
  const { id } = validate(params, userIdParamSchema);

  if (currentUser.role !== 'ADMIN' && currentUser.userId !== id) {
    throw new HttpError(403, 'Forbidden');
  }

  const db = await createDatabase();
  const user = db.data.users.find((item) => item.id === id);

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  sendJson(res, 200, { user: toUserResponse(user) });
};

export const listUsers = async ({ req, res }: RequestContext) => {
  const currentUser = await authenticate(req);
  authorizeRoles(currentUser, 'ADMIN');

  const db = await createDatabase();
  const users = [...db.data.users].sort((firstUser, secondUser) =>
    secondUser.createdAt.localeCompare(firstUser.createdAt)
  );

  sendJson(res, 200, { users: users.map(toUserResponse) });
};

export const blockUser = async ({ req, res, params }: RequestContext) => {
  const currentUser = await authenticate(req);
  const { id } = validate(params, userIdParamSchema);
  const { isActive } = validate(await readJsonBody(req), blockUserSchema);

  if (currentUser.role !== 'ADMIN' && currentUser.userId !== id) {
    throw new HttpError(403, 'Forbidden');
  }

  if (currentUser.role !== 'ADMIN' && isActive) {
    throw new HttpError(403, 'Forbidden');
  }

  const db = await createDatabase();
  const user = db.data.users.find((item) => item.id === id);

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  user.isActive = isActive;
  user.updatedAt = new Date().toISOString();
  await db.write();

  sendJson(res, 200, {
    message: isActive ? 'User activated successfully' : 'User blocked successfully',
    user: toUserResponse(user)
  });
};
