import type { ServerResponse } from 'node:http';
import { HttpError } from '../utils/httpError.ts';
import { sendJson } from '../utils/http.ts';

export const errorHandler = (error: unknown, res: ServerResponse) => {
  if (error instanceof HttpError) {
    if (error.details) {
      sendJson(res, error.statusCode, {
        message: error.message,
        errors: error.details
      });
      return;
    }

    sendJson(res, error.statusCode, { message: error.message });
    return;
  }

  console.error(error);
  sendJson(res, 500, { message: 'Internal server error' });
};
