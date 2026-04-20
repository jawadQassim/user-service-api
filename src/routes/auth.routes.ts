import { login, register } from '../controllers/auth.controller.ts';
import type { RouteDefinition } from '../types/http.ts';

export const authRoutes: RouteDefinition[] = [
  {
    method: 'POST',
    path: '/api/auth/register',
    handler: register
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    handler: login
  }
];
