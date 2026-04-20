import { blockUser, getUserById, listUsers } from '../controllers/user.controller.ts';
import type { RouteDefinition } from '../types/http.ts';

export const userRoutes: RouteDefinition[] = [
  {
    method: 'GET',
    path: '/api/users',
    handler: listUsers
  },
  {
    method: 'GET',
    path: '/api/users/:id',
    handler: getUserById
  },
  {
    method: 'PATCH',
    path: '/api/users/:id/block',
    handler: blockUser
  }
];
