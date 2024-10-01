import { expect, test } from 'vitest';
import { readConfig } from '../../src/lib/read-config';

test('从根目录获取', async () => {
  expect(readConfig()).toMatchInlineSnapshot(`
    {
      "url": "./openapi/openapi.json",
    }
  `);
});
