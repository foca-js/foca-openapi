import { describe, expect, test } from 'vitest';
import { getBasicDocument } from '../mocks/get-basic-document';
import {
  generateMethodModeClass,
  generateNamespaceTpl,
  generatePathRelationTpl,
  generateTemplate,
  generateUriModelClass,
  generateUriModelClassWithGroup,
} from '../../src/lib/generate-template';
import prettier from 'prettier';
import { getBasicMetas } from '../mocks/get-basic-matea';

const prettierOptions: prettier.Options = {
  ...(await prettier.resolveConfig((await prettier.resolveConfigFile())!)!),
  parser: 'typescript',
  printWidth: 120,
};

const formatDocs = (content: string) => prettier.format(content, prettierOptions);

test('完整的类型提示', async () => {
  const docs = getBasicDocument({
    '/users': {
      get: {
        parameters: [
          { name: 'foo', in: 'query', schema: { type: 'string' } },
          { name: 'bar', in: 'query', schema: { type: 'string' } },
          { name: 'baz', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object' },
            },
          },
        },
        responses: {
          200: {
            description: '',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    foo: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/users/{id}': {
      get: {
        parameters: [{ name: 'id', in: 'path' }],
        responses: {},
      },
    },
  });
  await expect(generateTemplate(docs, { classMode: 'rest' })).resolves
    .toMatchInlineSnapshot(`
    {
      "": "import { BaseOpenapiClient } from "foca-openapi";

    export namespace OpenapiClient {
      export type GetUsersQuery = { foo?: string; bar?: string };
      export type GetUsersParams = { baz: number };
      export type GetUsersBody = {};
      export type GetUsersResponse = { foo?: string };
    }

    export class OpenapiClient<T extends object = object> extends BaseOpenapiClient<T> {
      get<K extends keyof OpenapiClient_get_paths>(
        uri: K,
        ...rest: K extends "/users/{id}"
          ? [opts?: OpenapiClient_get_paths[K]["request"] & BaseOpenapiClient.UserInputOpts<T>]
          : [opts: OpenapiClient_get_paths[K]["request"] & BaseOpenapiClient.UserInputOpts<T>]
      ): Promise<OpenapiClient_get_paths[K]["response"]> {
        return this.request(uri, "get", ...rest);
      }

      protected override pickContentTypes(uri: string, method: string) {
        return contentTypes[method + " " + uri] || [void 0, void 0];
      }
    }

    interface OpenapiClient_get_paths {
      "/users": BaseOpenapiClient.Prettify<{
        request: {
          query?: OpenapiClient.GetUsersQuery;
          params: OpenapiClient.GetUsersParams;
          body: OpenapiClient.GetUsersBody;
        };
        response: OpenapiClient.GetUsersResponse;
      }>;
      "/users/{id}": BaseOpenapiClient.Prettify<{
        request: {
          query?: object;
        };
        response: unknown;
      }>;
    }

    const contentTypes: Record<
      string,
      [BaseOpenapiClient.UserInputOpts["requestBodyType"], BaseOpenapiClient.UserInputOpts["responseType"]]
    > = {};
    ",
    }
  `);

  await expect(generateTemplate(docs, { classMode: 'rpc-group' })).resolves
    .toMatchInlineSnapshot(`
    {
      "": "import { BaseOpenapiClient } from "foca-openapi";

    export namespace OpenapiClient {
      export type GetUsersQuery = { foo?: string; bar?: string };
      export type GetUsersParams = { baz: number };
      export type GetUsersBody = {};
      export type GetUsersResponse = { foo?: string };
    }

    export class OpenapiClient<T extends object = object> extends BaseOpenapiClient<T> {
      readonly default = {
        /**
         * @uri /users
         * @method GET
         */
        getUsers(
          opts: OpenapiClient_get_paths["/users"]["request"] & BaseOpenapiClient.UserInputOpts<T>,
        ): Promise<OpenapiClient_get_paths["/users"]["response"]> {
          return this.request("/users", "get", opts);
        },

        /**
         * @uri /users/{id}
         * @method GET
         */
        getUsersById(
          opts?: OpenapiClient_get_paths["/users/{id}"]["request"] & BaseOpenapiClient.UserInputOpts<T>,
        ): Promise<OpenapiClient_get_paths["/users/{id}"]["response"]> {
          return this.request("/users/{id}", "get", opts);
        },
      };

      protected override pickContentTypes(uri: string, method: string) {
        return contentTypes[method + " " + uri] || [void 0, void 0];
      }
    }

    interface OpenapiClient_get_paths {
      "/users": BaseOpenapiClient.Prettify<{
        request: {
          query?: OpenapiClient.GetUsersQuery;
          params: OpenapiClient.GetUsersParams;
          body: OpenapiClient.GetUsersBody;
        };
        response: OpenapiClient.GetUsersResponse;
      }>;
      "/users/{id}": BaseOpenapiClient.Prettify<{
        request: {
          query?: object;
        };
        response: unknown;
      }>;
    }

    const contentTypes: Record<
      string,
      [BaseOpenapiClient.UserInputOpts["requestBodyType"], BaseOpenapiClient.UserInputOpts["responseType"]]
    > = {};
    ",
    }
  `);

  await expect(generateTemplate(docs, { classMode: 'rpc' })).resolves
    .toMatchInlineSnapshot(`
    {
      "": "import { BaseOpenapiClient } from "foca-openapi";

    export namespace OpenapiClient {
      export type GetUsersQuery = { foo?: string; bar?: string };
      export type GetUsersParams = { baz: number };
      export type GetUsersBody = {};
      export type GetUsersResponse = { foo?: string };
    }

    export class OpenapiClient<T extends object = object> extends BaseOpenapiClient<T> {
      /**
       * @uri /users
       * @method GET
       */
      getUsers(
        opts: OpenapiClient_get_paths["/users"]["request"] & BaseOpenapiClient.UserInputOpts<T>,
      ): Promise<OpenapiClient_get_paths["/users"]["response"]> {
        return this.request("/users", "get", opts);
      }

      /**
       * @uri /users/{id}
       * @method GET
       */
      getUsersById(
        opts?: OpenapiClient_get_paths["/users/{id}"]["request"] & BaseOpenapiClient.UserInputOpts<T>,
      ): Promise<OpenapiClient_get_paths["/users/{id}"]["response"]> {
        return this.request("/users/{id}", "get", opts);
      }

      protected override pickContentTypes(uri: string, method: string) {
        return contentTypes[method + " " + uri] || [void 0, void 0];
      }
    }

    interface OpenapiClient_get_paths {
      "/users": BaseOpenapiClient.Prettify<{
        request: {
          query?: OpenapiClient.GetUsersQuery;
          params: OpenapiClient.GetUsersParams;
          body: OpenapiClient.GetUsersBody;
        };
        response: OpenapiClient.GetUsersResponse;
      }>;
      "/users/{id}": BaseOpenapiClient.Prettify<{
        request: {
          query?: object;
        };
        response: unknown;
      }>;
    }

    const contentTypes: Record<
      string,
      [BaseOpenapiClient.UserInputOpts["requestBodyType"], BaseOpenapiClient.UserInputOpts["responseType"]]
    > = {};
    ",
    }
  `);
});

test('不同的项目名', async () => {
  const docs = getBasicDocument({});
  const result = await generateTemplate(docs, { projectName: 'foo-bar' });

  expect(Object.keys(result)).toMatchInlineSnapshot(`
    [
      "foo-bar",
    ]
  `);
});

describe('命名空间', () => {
  test('根据key生成interface', async () => {
    const metas = getBasicMetas({
      get: [
        {
          uri: '/users',
          method: 'get',
          key: 'a_users',
          contentTypes: ['application/json'],
          responseTypes: ['application/json'],
          query: { optional: false, types: ['{ foo: string; }'] },
          params: { optional: false, types: ['{ id: number; }'] },
          body: { optional: false, types: ['{ bar: string; }'] },
          response: { types: ['{id: number; name: string}'] },
          tags: [],
        },
      ],
    });
    const result = generateNamespaceTpl('Client', metas);
    await expect(formatDocs(result)).resolves.toMatchInlineSnapshot(`
      "export namespace Client {
        export type AUsersQuery = { foo: string };
        export type AUsersParams = { id: number };
        export type AUsersBody = { bar: string };
        export type AUsersResponse = { id: number; name: string };
      }
      "
    `);
  });

  test('body和response有多个类型时使用type替换interface', async () => {
    const metas = getBasicMetas({
      get: [
        {
          uri: '/users',
          method: 'get',
          key: 'a_users',
          contentTypes: ['application/json'],
          responseTypes: ['application/json'],
          query: { optional: true, types: [] },
          params: { optional: true, types: [] },
          body: { optional: false, types: ['{ bar: string; }', '{bar?: number}'] },
          response: { types: ['{id: number; name: string}', 'string'] },
          tags: [],
        },
      ],
    });
    const result = generateNamespaceTpl('Client', metas);
    await expect(formatDocs(result)).resolves.toMatchInlineSnapshot(`
      "export namespace Client {
        export type AUsersBody = { bar: string } | { bar?: number };
        export type AUsersResponse = { id: number; name: string } | string;
      }
      "
    `);
  });
});

describe('类', () => {
  const metas = getBasicMetas({
    get: [
      {
        uri: '/',
        method: 'get',
        key: 'get-users',
        query: { optional: true, types: [] },
        params: { optional: true, types: [] },
        body: { optional: true, types: [] },
        response: { types: [] },
        contentTypes: [],
        responseTypes: [],
        tags: ['user', 'public'],
      },
    ],
    patch: [
      {
        uri: '/',
        method: 'patch',
        key: 'patch_users',
        query: { optional: true, types: [] },
        params: { optional: true, types: [] },
        body: { optional: true, types: [] },
        response: { types: [] },
        contentTypes: [],
        responseTypes: [],
        tags: ['user'],
        description: '这里有一个注释',
      },
    ],
  });

  test('[method] 只生成接口对应的方法', async () => {
    const content = generateMethodModeClass('Client', metas);
    await expect(formatDocs(content)).resolves.toMatchInlineSnapshot(`
      "export class Client<T extends object = object> extends BaseOpenapiClient<T> {
        get<K extends keyof Client_get_paths>(
          uri: K,
          ...rest: [opts?: Client_get_paths[K]['request'] & BaseOpenapiClient.UserInputOpts<T>]
        ): Promise<Client_get_paths[K]['response']> {
          return this.request(uri, 'get', ...rest);
        }

        patch<K extends keyof Client_patch_paths>(
          uri: K,
          ...rest: [opts?: Client_patch_paths[K]['request'] & BaseOpenapiClient.UserInputOpts<T>]
        ): Promise<Client_patch_paths[K]['response']> {
          return this.request(uri, 'get', ...rest);
        }

        protected override pickContentTypes(uri: string, method: string) {
          return contentTypes[method + ' ' + uri] || [void 0, void 0];
        }
      }
      "
    `);
  });

  test('[uri] 只生成接口对应的方法', async () => {
    const content = generateUriModelClass('Client', metas);
    await expect(formatDocs(content)).resolves.toMatchInlineSnapshot(`
      "export class Client<T extends object = object> extends BaseOpenapiClient<T> {
        /**
         * @uri /
         * @method GET
         */
        getUsers(
          opts?: Client_get_paths['/']['request'] & BaseOpenapiClient.UserInputOpts<T>,
        ): Promise<Client_get_paths['/']['response']> {
          return this.request('/', 'get', opts);
        }

        /**
         * 这里有一个注释
         * @uri /
         * @method PATCH
         */
        patchUsers(
          opts?: Client_patch_paths['/']['request'] & BaseOpenapiClient.UserInputOpts<T>,
        ): Promise<Client_patch_paths['/']['response']> {
          return this.request('/', 'patch', opts);
        }

        protected override pickContentTypes(uri: string, method: string) {
          return contentTypes[method + ' ' + uri] || [void 0, void 0];
        }
      }
      "
    `);
  });

  test('[method] 包含可选和必填的参数', async () => {
    const metas = getBasicMetas({
      get: [
        {
          uri: '/a',
          method: 'get',
          key: 'aa',
          query: { optional: true, types: [] },
          params: { optional: false, types: [] },
          body: { optional: true, types: [] },
          response: { types: [] },
          contentTypes: [],
          responseTypes: [],
          tags: [],
        },
        {
          uri: '/b',
          method: 'get',
          key: 'bb',
          query: { optional: true, types: [] },
          params: { optional: true, types: [] },
          body: { optional: true, types: [] },
          response: { types: [] },
          contentTypes: [],
          responseTypes: [],
          tags: [],
        },
      ],
    });
    const content = generateMethodModeClass('Client', metas);
    await expect(formatDocs(content)).resolves.toMatchInlineSnapshot(`
      "export class Client<T extends object = object> extends BaseOpenapiClient<T> {
        get<K extends keyof Client_get_paths>(
          uri: K,
          ...rest: K extends '/b'
            ? [opts?: Client_get_paths[K]['request'] & BaseOpenapiClient.UserInputOpts<T>]
            : [opts: Client_get_paths[K]['request'] & BaseOpenapiClient.UserInputOpts<T>]
        ): Promise<Client_get_paths[K]['response']> {
          return this.request(uri, 'get', ...rest);
        }

        protected override pickContentTypes(uri: string, method: string) {
          return contentTypes[method + ' ' + uri] || [void 0, void 0];
        }
      }
      "
    `);
  });

  test('[method] 都是必填的参数', async () => {
    const metas = getBasicMetas({
      get: [
        {
          uri: '/a',
          method: 'get',
          key: 'aa',
          query: { optional: true, types: [] },
          params: { optional: false, types: [] },
          body: { optional: true, types: [] },
          response: { types: [] },
          contentTypes: [],
          responseTypes: [],
          tags: [],
        },
      ],
    });
    const content = generateMethodModeClass('Client', metas);
    await expect(formatDocs(content)).resolves.toMatchInlineSnapshot(`
      "export class Client<T extends object = object> extends BaseOpenapiClient<T> {
        get<K extends keyof Client_get_paths>(
          uri: K,
          ...rest: [opts: Client_get_paths[K]['request'] & BaseOpenapiClient.UserInputOpts<T>]
        ): Promise<Client_get_paths[K]['response']> {
          return this.request(uri, 'get', ...rest);
        }

        protected override pickContentTypes(uri: string, method: string) {
          return contentTypes[method + ' ' + uri] || [void 0, void 0];
        }
      }
      "
    `);
  });

  test('命名空间', async () => {
    const content = generateUriModelClassWithGroup('Client', metas);
    await expect(formatDocs(content)).resolves.toMatchInlineSnapshot(`
      "export class Client<T extends object = object> extends BaseOpenapiClient<T> {
        readonly user = {
          /**
           * @uri /
           * @method GET
           */
          getUsers(
            opts?: Client_get_paths['/']['request'] & BaseOpenapiClient.UserInputOpts<T>,
          ): Promise<Client_get_paths['/']['response']> {
            return this.request('/', 'get', opts);
          },

          /**
           * 这里有一个注释
           * @uri /
           * @method PATCH
           */
          patchUsers(
            opts?: Client_patch_paths['/']['request'] & BaseOpenapiClient.UserInputOpts<T>,
          ): Promise<Client_patch_paths['/']['response']> {
            return this.request('/', 'patch', opts);
          },
        };
        readonly public = {
          /**
           * @uri /
           * @method GET
           */
          getUsers(
            opts?: Client_get_paths['/']['request'] & BaseOpenapiClient.UserInputOpts<T>,
          ): Promise<Client_get_paths['/']['response']> {
            return this.request('/', 'get', opts);
          },
        };

        protected override pickContentTypes(uri: string, method: string) {
          return contentTypes[method + ' ' + uri] || [void 0, void 0];
        }
      }
      "
    `);
  });
});

describe('接口映射', () => {
  test('生成request和response', async () => {
    const metas = getBasicMetas({
      get: [
        {
          uri: '/a',
          method: 'get',
          key: 'aa',
          query: { optional: true, types: [] },
          params: { optional: false, types: [] },
          body: { optional: true, types: [] },
          response: { types: [] },
          contentTypes: [],
          responseTypes: [],
          tags: [],
        },
      ],
    });
    const result = generatePathRelationTpl('Client', metas);
    await expect(formatDocs(result)).resolves.toMatchInlineSnapshot(`
      "interface Client_get_paths {
        '/a': BaseOpenapiClient.Prettify<{
          request: {
            query?: object;
          };
          response: unknown;
        }>;
      }
      "
    `);
  });

  test('可选', async () => {
    const metas = getBasicMetas({
      get: [
        {
          uri: '/a',
          method: 'get',
          key: 'aa',
          query: { optional: true, types: ['string'] },
          params: { optional: true, types: ['number'] },
          body: { optional: true, types: ['string'] },
          response: { types: ['boolean'] },
          contentTypes: [],
          responseTypes: [],
          tags: [],
        },
      ],
    });
    const result = generatePathRelationTpl('Client', metas);
    await expect(formatDocs(result)).resolves.toMatchInlineSnapshot(`
      "interface Client_get_paths {
        '/a': BaseOpenapiClient.Prettify<{
          request: {
            query?: Client.AaQuery;
            params?: Client.AaParams;
            body?: Client.AaBody;
          };
          response: Client.AaResponse;
        }>;
      }
      "
    `);
  });

  test('必填', async () => {
    const metas = getBasicMetas({
      get: [
        {
          uri: '/a',
          method: 'get',
          key: 'aa',
          query: { optional: false, types: ['string'] },
          params: { optional: false, types: ['number'] },
          body: { optional: false, types: ['string'] },
          response: { types: ['boolean'] },
          contentTypes: [],
          responseTypes: [],
          tags: [],
        },
      ],
    });
    const result = generatePathRelationTpl('Client', metas);
    await expect(formatDocs(result)).resolves.toMatchInlineSnapshot(`
      "interface Client_get_paths {
        '/a': BaseOpenapiClient.Prettify<{
          request: {
            query: Client.AaQuery;
            params: Client.AaParams;
            body: Client.AaBody;
          };
          response: Client.AaResponse;
        }>;
      }
      "
    `);
  });
});
