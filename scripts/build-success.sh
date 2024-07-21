#!/usr/bin/env sh

set -ex

echo '{"type":"module"}' > dist/esm/package.json

mkdir -p backup/esm
cp dist/index.js backup/index.js
cp dist/index.d.ts backup/index.d.ts
cp dist/esm/index.js backup/esm/index.js
