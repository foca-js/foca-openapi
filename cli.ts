import { ConsoleApp } from '@aomex/console';
import { openapi } from '@aomex/openapi';

const app = new ConsoleApp({
  mount: [
    openapi({
      commandName: 'openapi-json',
      routers: ['./openapi/routers'],
      saveToFile: './openapi/openapi.json',
      docs: {
        openapi: '3.0.3',
        info: {
          version: '0.0.0',
        },
      },
    }),
    openapi({
      commandName: 'openapi-yaml',
      routers: ['./openapi/routers'],
      saveToFile: './openapi/openapi.yaml',
      docs: {
        openapi: '3.0.3',
        info: {
          version: '0.0.0',
        },
      },
    }),
  ],
});

const code = await app.run();
process.exit(code);
