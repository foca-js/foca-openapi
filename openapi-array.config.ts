import { defineConfig } from './src/define-config';

export default defineConfig([
  { url: './openapi/openapi.json', projectName: 'foo' },
  { url: './openapi/openapi.json', projectName: 'bar' },
]);
