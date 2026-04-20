import type { User } from '../types/user.ts';

export const toUserResponse = (user: User) => ({
  id: user.id,
  fullName: user.fullName,
  birthDate: user.birthDate,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});
