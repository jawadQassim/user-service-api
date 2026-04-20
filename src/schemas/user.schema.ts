import { requireBoolean, requireString } from '../utils/validation.ts';

export interface UserIdParams {
  id: string;
}

export interface BlockUserInput {
  isActive: boolean;
}

export const userIdParamSchema = (value: unknown): UserIdParams => {
  const params = (value ?? {}) as Record<string, unknown>;

  return {
    id: requireString(params.id, 'id', 1, 255)
  };
};

export const blockUserSchema = (value: unknown): BlockUserInput => {
  const body = (value ?? {}) as Record<string, unknown>;

  return {
    isActive: requireBoolean(body.isActive, 'isActive')
  };
};
