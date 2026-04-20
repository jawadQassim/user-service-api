import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');
const buildInfoPath = path.join(distDir, 'BUILD.txt');

await mkdir(distDir, { recursive: true });
await writeFile(
  buildInfoPath,
  [
    'Build completed successfully.',
    'This project runs directly from TypeScript source using Node 22 --experimental-strip-types.'
  ].join('\n')
);

console.log(`Build output written to ${buildInfoPath}`);
