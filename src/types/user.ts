export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  fullName: string;
  birthDate: string;
  email: string;
  passwordHash: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseSchema {
  users: User[];
}

export interface JwtPayload {
  userId: string;
  role: Role;
  exp: number;
}

export interface AuthenticatedUser {
  userId: string;
  role: Role;
  user: User;
}
