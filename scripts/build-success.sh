#!/usr/bin/env sh

set -ex

echo '{"type":"module"}' > dist/esm/package.json

cp dist/index.js dist/backup-index.js
cp dist/index.d.ts dist/backup-index.d.ts
cp dist/esm/index.js dist/esm/backup-index.js
