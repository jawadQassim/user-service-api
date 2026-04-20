import type { IncomingMessage, ServerResponse } from 'node:http';
import { errorHandler } from './middleware/error.middleware.ts';
import { authRoutes } from './routes/auth.routes.ts';
import { userRoutes } from './routes/user.routes.ts';
import type { RouteDefinition } from './types/http.ts';
import { getPathname, matchRoute, sendJson } from './utils/http.ts';

const routes: RouteDefinition[] = [...authRoutes, ...userRoutes];

const handleHealthCheck = (req: IncomingMessage, res: ServerResponse, pathname: string) => {
  if (req.method === 'GET' && pathname === '/health') {
    sendJson(res, 200, { message: 'OK' });
    return true;
  }

  return false;
};

export const app = async (req: IncomingMessage, res: ServerResponse) => {
  const pathname = getPathname(req);

  try {
    if (handleHealthCheck(req, res, pathname)) {
      return;
    }

    for (const route of routes) {
      if (route.method !== req.method) {
        continue;
      }

      const params = matchRoute(route.path, pathname);
      if (!params) {
        continue;
      }

      await route.handler({
        req,
        res,
        params,
        pathname
      });

      return;
    }

    sendJson(res, 404, { message: 'Not found' });
  } catch (error) {
    errorHandler(error, res);
  }
};

export default app;
