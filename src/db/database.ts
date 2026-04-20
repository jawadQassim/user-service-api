import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { env } from '../config/env.ts';
import type { DatabaseSchema } from '../types/user.ts';

const dbFilePath = path.resolve(process.cwd(), env.dbFile);

const ensureDatabaseFile = async () => {
  await mkdir(path.dirname(dbFilePath), { recursive: true });

  try {
    await access(dbFilePath);
  } catch {
    await writeFile(dbFilePath, `${JSON.stringify({ users: [] }, null, 2)}\n`);
  }
};

const readDatabase = async (): Promise<DatabaseSchema> => {
  await ensureDatabaseFile();
  const rawContent = await readFile(dbFilePath, 'utf8');

  try {
    const parsedContent = JSON.parse(rawContent) as Partial<DatabaseSchema>;

    if (!parsedContent || !Array.isArray(parsedContent.users)) {
      return { users: [] };
    }

    return { users: parsedContent.users };
  } catch {
    return { users: [] };
  }
};

const writeDatabase = async (data: DatabaseSchema) => {
  await writeFile(dbFilePath, `${JSON.stringify(data, null, 2)}\n`);
};

export const createDatabase = async () => {
  const data = await readDatabase();

  return {
    data,
    write: async () => {
      await writeDatabase(data);
    }
  };
};
