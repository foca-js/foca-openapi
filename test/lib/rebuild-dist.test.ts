import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { afterEach, expect, test } from 'vitest';
import { rebuildDist } from '../../src/lib/rebuild-dist';
import { execSync } from 'child_process';

const dist = path.join(import.meta.dirname, '..', '..', 'dist');
const src = path.join(import.meta.dirname, '..', '..', 'src');
const runtime = path.join(src, 'openapi-runtime.ts');
const sourceContent = 'export const foo = { bar: "baz" };';
const buildContent = 'var foo = { bar: "baz" }';

afterEach(async () => {
  await writeFile(runtime, 'export {};');
});

test('内容写入文件', async () => {
  await rebuildDist(dist, sourceContent);
  await expect(readFile(runtime, 'utf8')).resolves.toBe(sourceContent);
});

test('打包进dist/index.js文件', async () => {
  execSync('npx tsup', { stdio: 'inherit', encoding: 'utf8' });
  await expect(readFile(path.join(dist, 'index.js'), 'utf8')).resolves.not.toContain(
    buildContent,
  );
  await rebuildDist(dist, sourceContent);
  await expect(readFile(path.join(dist, 'index.js'), 'utf8')).resolves.toContain(
    buildContent,
  );
});
