import { expect, test } from 'vitest';
import { readConfig } from '../../src/lib/read-config';

test('从根目录获取', async () => {
  const config = await readConfig();
  expect(config).toMatchInlineSnapshot(`
    [
      {
        "path": "./openapi/openapi.json",
      },
    ]
  `);
});
