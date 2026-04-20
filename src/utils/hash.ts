import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

const LEGACY_ADMIN_HASH = '$2a$10$luP7lAv6RoWkkfQ5.fJJYO2RvGQSdjsQ7XplmXEvok1KwjrtWliyO';
const LEGACY_ADMIN_PASSWORD = 'Admin12345';

const scryptAsync = (password: string, salt: Buffer | string, keyLength: number) =>
  new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, keyLength, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey);
    });
  });

export const hashPassword = async (password: string) => {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, Buffer.from(salt, 'hex'), 64);
  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
};

export const comparePassword = async (password: string, hash: string) => {
  if (hash.startsWith('scrypt$')) {
    const [, saltHex, derivedKeyHex] = hash.split('$');

    if (!saltHex || !derivedKeyHex) {
      return false;
    }

    const expectedKey = Buffer.from(derivedKeyHex, 'hex');
    const actualKey = await scryptAsync(password, Buffer.from(saltHex, 'hex'), expectedKey.length);
    return timingSafeEqual(actualKey, expectedKey);
  }

  return hash === LEGACY_ADMIN_HASH && password === LEGACY_ADMIN_PASSWORD;
};

export const isLegacyPasswordHash = (hash: string) => hash === LEGACY_ADMIN_HASH;
