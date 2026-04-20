import type { IncomingMessage, ServerResponse } from 'node:http';

export interface RequestContext {
  req: IncomingMessage;
  res: ServerResponse;
  params: Record<string, string>;
  pathname: string;
}

export type RouteHandler = (context: RequestContext) => Promise<void>;

export interface RouteDefinition {
  method: 'GET' | 'POST' | 'PATCH';
  path: string;
  handler: RouteHandler;
}
