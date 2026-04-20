import { randomUUID } from 'node:crypto';
import { createDatabase } from './database.ts';
import { hashPassword } from '../utils/hash.ts';

async function seed() {
  const db = await createDatabase();
  const existingAdmin = db.data.users.find((user) => user.email === 'admin@example.com');

  if (existingAdmin) {
    console.log('Admin already exists');
    return;
  }

  const now = new Date().toISOString();
  const passwordHash = await hashPassword('Admin12345');

  db.data.users.push({
    id: randomUUID(),
    fullName: 'System Admin',
    birthDate: '1990-01-01',
    email: 'admin@example.com',
    passwordHash,
    role: 'ADMIN',
    isActive: true,
    createdAt: now,
    updatedAt: now
  });

  await db.write();
  console.log('Seeded admin: admin@example.com / Admin12345');
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
