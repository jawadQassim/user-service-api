import fs from 'node:fs';
import path from 'node:path';

const loadEnvFile = () => {
  const envPath = path.resolve(process.cwd(), '.env');
  const values: Record<string, string> = {};

  try {
    const content = fs.readFileSync(envPath, 'utf8');

    for (const line of content.split(/\r?\n/)) {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }

      const separatorIndex = trimmedLine.indexOf('=');
      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmedLine.slice(0, separatorIndex).trim();
      const value = trimmedLine.slice(separatorIndex + 1).trim();
      values[key] = value;
    }
  } catch {
    return values;
  }

  return values;
};

const fileEnv = loadEnvFile();

export const env = {
  port: Number(process.env.PORT || fileEnv.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || fileEnv.JWT_SECRET || 'super-secret-key',
  dbFile: process.env.DB_FILE || fileEnv.DB_FILE || './db.json'
};
