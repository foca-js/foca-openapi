import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    coverage: {
      provider: 'v8',
      enabled: true,
      include: ['packages/**/src/**'],
      exclude: ['packages/console/src/bin.ts'],
      all: true,
      // lines: 99,
      // functions: 99,
      // branches: 99,
      // statements: 99,
      reporter: ['html', 'lcovonly', 'text-summary'],
    },
    maxConcurrency: 1,
    fileParallelism: false,
    logHeapUsage: true,
    environment: 'node',
    retry: 1,
    globals: true,
    snapshotFormat: {
      escapeString: false,
      printBasicPrototype: false,
    },
    watch: false,
  },
});
