import { readFile } from 'fs/promises';
import path from 'path';
import { beforeAll, expect, test } from 'vitest';
import { rebuildDist } from '../../src/lib/rebuild-dist';
import tsup from 'tsup';
import { execSync } from 'node:child_process';

const root = path.resolve('test', 'fixtures');
const dtsContent = 'declare const foo = { bar: "baz" };';
const jsContent = 'var foo = { bar: "baz" }';
const distDir = path.join(root, 'dist');

beforeAll(async () => {
  await tsup.build({
    entry: ['test/fixtures/index.ts'],
    outDir: 'test/fixtures/dist',
    sourcemap: true,
    dts: true,
    legacyOutput: true,
  });

  execSync(`sh ${process.cwd()}/scripts/build-success.sh`, {
    cwd: path.join(path.dirname(import.meta.dirname), 'fixtures'),
  });
});

test('内容写入文件', async () => {
  await rebuildDist(root, jsContent, dtsContent, ['foo']);
  await expect(readFile(path.join(distDir, 'index.js'), 'utf8')).resolves
    .toMatchInlineSnapshot(`
    ""use strict";
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

    // test/fixtures/index.ts
    var fixtures_exports = {};
    __export(fixtures_exports, {
    foo: () => foo,
      aaaaa: () => aaaaa
    });
    module.exports = __toCommonJS(fixtures_exports);
    var aaaaa = { bbbbb: "ccccc" };
    // Annotate the CommonJS export names for ESM import in node:
    var foo = { bar: "baz" }
    0 && (module.exports = {
    foo,
      aaaaa
    });
    //# sourceMappingURL=index.js.map       
    "
  `);

  await expect(readFile(path.join(distDir, 'index.d.ts'), 'utf8')).resolves
    .toMatchInlineSnapshot(`
    "declare const aaaaa: {
        bbbbb: string;
    };

    export { aaaaa };
           

    declare const foo = { bar: "baz" };
    export { foo };"
  `);

  await expect(readFile(path.join(distDir, 'esm', 'index.js'), 'utf8')).resolves
    .toMatchInlineSnapshot(`
    "// test/fixtures/index.ts
    var aaaaa = { bbbbb: "ccccc" };
    export {
      aaaaa
    };
    //# sourceMappingURL=index.js.map       

    var foo = { bar: "baz" }
    export { foo };"
  `);
});
