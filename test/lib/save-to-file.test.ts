import { readFile } from 'fs/promises';
import path from 'path';
import { expect, test } from 'vitest';
import { saveToFile } from '../../src/lib/save-to-file';
import { rmSync } from 'fs';

test('内容写入文件', async () => {
  const outputFile = path.posix.join(
    'build',
    Date.now().toString(),
    Math.random().toString(),
    'test.ts',
  );
  await saveToFile({ projectName: 'foo', outputFile }, { foo: 'abc' });
  await expect(readFile(outputFile, 'utf8')).resolves.toMatchInlineSnapshot(`"abc"`);
  rmSync(outputFile, { force: true });
});

test('默认文件名', async () => {
  const filename = await saveToFile({}, { '': 'bar' });
  expect(filename).toContain('openapi.ts');
  await expect(readFile(filename, 'utf8')).resolves.toMatchInlineSnapshot(`"bar"`);
  rmSync(filename);
});

test('使用项目名作为文件名', async () => {
  const filename = await saveToFile({ projectName: 'FooBar' }, { FooBar: 'bar' });
  expect(filename).toContain('foo-bar.ts');
  await expect(readFile(filename, 'utf8')).resolves.toMatchInlineSnapshot(`"bar"`);
  rmSync(filename);
});
