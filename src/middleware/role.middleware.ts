import { HttpError } from '../utils/httpError.ts';
import type { AuthenticatedUser, Role } from '../types/user.ts';

export const authorizeRoles = (user: AuthenticatedUser, ...roles: Role[]) => {
  if (!roles.includes(user.role)) {
    throw new HttpError(403, 'Forbidden');
  }
};
