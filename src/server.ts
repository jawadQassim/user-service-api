import { createServer } from 'node:http';
import app from './app.ts';
import { env } from './config/env.ts';

createServer(app).listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});
