import { describe, expect, test } from 'vitest';
import { getBasicDocument } from '../mocks/get-basic-document';
import {
  generateMethodModeClassForDTS,
  generateMethodModeClassForJS,
  generateNamespaceTpl,
  generatePathRelationTpl,
  generateTemplate,
  generateUriModeClassForJS,
  generateUriModelClassForDTS,
} from '../../src/lib/generate-template';
import prettier from 'prettier';
import { getBasicMetas } from '../mocks/get-basic-matea';

const prettierOptions: prettier.Options = {
  ...(await prettier.resolveConfig((await prettier.resolveConfigFile())!)!),
  parser: 'typescript',
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
  await expect(generateTemplate(docs, undefined, 'method')).resolves
    .toMatchInlineSnapshot(`
    {
      "OpenapiClient": {
        "dts": "declare namespace OpenapiClient {
      interface GetUsersQuery {
        foo?: string;
        bar?: string;
      }
      interface GetUsersParams {
        baz: number;
      }
      interface GetUsersBody {}
      interface GetUsersResponse {
        foo?: string;
      }
    }

    declare class OpenapiClient extends BaseOpenapiClient {
      get<K extends keyof OpenapiClient_get_paths>(
        uri: K,
        ...rest: K extends "/users/{id}"
          ? [opts?: OpenapiClient_get_paths[K]["request"]]
          : [opts: OpenapiClient_get_paths[K]["request"]]
      ): Promise<OpenapiClient_get_paths[K]["response"]>;

      protected getContentTypes(
        uri: string,
        method: string,
      ): [
        BaseOpenapiClient.UserInputOpts["requestBodyType"],
        BaseOpenapiClient.UserInputOpts["responseType"],
      ];
    }

    interface OpenapiClient_get_paths {
      "/users": BaseOpenapiClient.Prettify<{
        request: {
          query?: OpenapiClient.GetUsersQuery;
          params: OpenapiClient.GetUsersParams;
          body: OpenapiClient.GetUsersBody;
        } & BaseOpenapiClient.UserInputOpts;
        response: OpenapiClient.GetUsersResponse;
      }>;
      "/users/{id}": BaseOpenapiClient.Prettify<{
        request: {
          query?: object;
        } & BaseOpenapiClient.UserInputOpts;
        response: unknown;
      }>;
    }
    ",
        "js": "var OpenapiClient = class extends BaseOpenapiClient {
      get(uri, opts) {
        return this.request(uri, "get", opts);
      }

      post(uri, opts) {
        return this.request(uri, "post", opts);
      }

      put(uri, opts) {
        return this.request(uri, "put", opts);
      }

      patch(uri, opts) {
        return this.request(uri, "patch", opts);
      }

      delete(uri, opts) {
        return this.request(uri, "delete", opts);
      }

      getContentTypes(uri, method) {
        return contentTypesOpenapiClient[method + " " + uri] || [void 0, void 0];
      }
    };

    const contentTypesOpenapiClient = {};
    ",
      },
    }
  `);

  await expect(generateTemplate(docs, undefined, 'uri')).resolves.toMatchInlineSnapshot(`
    {
      "OpenapiClient": {
        "dts": "declare namespace OpenapiClient {
      interface GetUsersQuery {
        foo?: string;
        bar?: string;
      }
      interface GetUsersParams {
        baz: number;
      }
      interface GetUsersBody {}
      interface GetUsersResponse {
        foo?: string;
      }
    }

    declare class OpenapiClient extends BaseOpenapiClient {
      getUsers(
        opts: OpenapiClient_get_paths["/users"]["request"],
      ): Promise<OpenapiClient_get_paths["/users"]["response"]>;

      getUsersId(
        opts?: OpenapiClient_get_paths["/users/{id}"]["request"],
      ): Promise<OpenapiClient_get_paths["/users/{id}"]["response"]>;
    }

    interface OpenapiClient_get_paths {
      "/users": BaseOpenapiClient.Prettify<{
        request: {
          query?: OpenapiClient.GetUsersQuery;
          params: OpenapiClient.GetUsersParams;
          body: OpenapiClient.GetUsersBody;
        } & BaseOpenapiClient.UserInputOpts;
        response: OpenapiClient.GetUsersResponse;
      }>;
      "/users/{id}": BaseOpenapiClient.Prettify<{
        request: {
          query?: object;
        } & BaseOpenapiClient.UserInputOpts;
        response: unknown;
      }>;
    }
    ",
        "js": "var OpenapiClient = class extends BaseOpenapiClient {
      getUsers(opts) {
        return this.request("/users", "get", opts);
      }

      getUsersId(opts) {
        return this.request("/users/{id}", "get", opts);
      }

      getContentTypes(uri, method) {
        return contentTypesOpenapiClient[method + " " + uri] || [void 0, void 0];
      }
    };

    const contentTypesOpenapiClient = {};
    ",
      },
    }
  `);
});

test('不同的项目名', async () => {
  const docs = getBasicDocument({});
  const result = await generateTemplate(docs, 'foo-bar', 'method');

  expect(Object.keys(result)).toMatchInlineSnapshot(`
    [
      "OpenapiClientFooBar",
    ]
  `);
});

describe('命名空间', () => {
  test('根据key生成interface', async () => {
    const metas = getBasicMetas({
      get: [
        {
          uri: '/users',
          key: 'a_users',
          contentTypes: ['application/json'],
          responseTypes: ['application/json'],
          query: { optional: false, types: ['{ foo: string; }'] },
          params: { optional: false, types: ['{ id: number; }'] },
          body: { optional: false, types: ['{ bar: string; }'] },
          response: { types: ['{id: number; name: string}'] },
        },
      ],
    });
    const result = generateNamespaceTpl('Client', metas);
    await expect(formatDocs(result)).resolves.toMatchInlineSnapshot(`
      "declare namespace Client {
        interface AUsersQuery {
          foo: string;
        }
        interface AUsersParams {
          id: number;
        }
        interface AUsersBody {
          bar: string;
        }
        interface AUsersResponse {
          id: number;
          name: string;
        }
      }
      "
    `);
  });

  test('body和response有多个类型时使用type替换interface', async () => {
    const metas = getBasicMetas({
      get: [
        {
          uri: '/users',
          key: 'a_users',
          contentTypes: ['application/json'],
          responseTypes: ['application/json'],
          query: { optional: true, types: [] },
          params: { optional: true, types: [] },
          body: { optional: false, types: ['{ bar: string; }', '{bar?: number}'] },
          response: { types: ['{id: number; name: string}', 'string'] },
        },
      ],
    });
    const result = generateNamespaceTpl('Client', metas);
    await expect(formatDocs(result)).resolves.toMatchInlineSnapshot(`
      "declare namespace Client {
        type AUsersBody = { bar: string } | { bar?: number };
        type AUsersResponse = { id: number; name: string } | string;
      }
      "
    `);
  });
});

describe('类', () => {
  test('只生成接口对应的方法', async () => {
    const metas = getBasicMetas({
      get: [
        {
          uri: '/',
          key: 'get-users',
          query: { optional: true, types: [] },
          params: { optional: true, types: [] },
          body: { optional: true, types: [] },
          response: { types: [] },
          contentTypes: [],
          responseTypes: [],
        },
      ],
      patch: [
        {
          uri: '/',
          key: 'patch_users',
          query: { optional: true, types: [] },
          params: { optional: true, types: [] },
          body: { optional: true, types: [] },
          response: { types: [] },
          contentTypes: [],
          responseTypes: [],
        },
      ],
    });
    await expect(formatDocs(generateMethodModeClassForDTS('Client', metas))).resolves
      .toMatchInlineSnapshot(`
      "declare class Client extends BaseOpenapiClient {
        get<K extends keyof Client_get_paths>(
          uri: K,
          ...rest: [opts?: Client_get_paths[K]['request']]
        ): Promise<Client_get_paths[K]['response']>;

        patch<K extends keyof Client_patch_paths>(
          uri: K,
          ...rest: [opts?: Client_patch_paths[K]['request']]
        ): Promise<Client_patch_paths[K]['response']>;

        protected getContentTypes(
          uri: string,
          method: string,
        ): [
          BaseOpenapiClient.UserInputOpts['requestBodyType'],
          BaseOpenapiClient.UserInputOpts['responseType'],
        ];
      }
      "
    `);

    await expect(formatDocs(generateUriModelClassForDTS('Client', metas))).resolves
      .toMatchInlineSnapshot(`
      "declare class Client extends BaseOpenapiClient {
        getUsers(
          opts?: Client_get_paths['/']['request'],
        ): Promise<Client_get_paths['/']['response']>;

        patchUsers(
          opts?: Client_patch_paths['/']['request'],
        ): Promise<Client_patch_paths['/']['response']>;
      }
      "
    `);
  });

  test('[method] 包含可选和必填的参数', async () => {
    const metas = getBasicMetas({
      get: [
        {
          uri: '/a',
          key: 'aa',
          query: { optional: true, types: [] },
          params: { optional: false, types: [] },
          body: { optional: true, types: [] },
          response: { types: [] },
          contentTypes: [],
          responseTypes: [],
        },
        {
          uri: '/b',
          key: 'bb',
          query: { optional: true, types: [] },
          params: { optional: true, types: [] },
          body: { optional: true, types: [] },
          response: { types: [] },
          contentTypes: [],
          responseTypes: [],
        },
      ],
    });
    const result = generateMethodModeClassForDTS('Client', metas);
    await expect(formatDocs(result)).resolves.toMatchInlineSnapshot(`
      "declare class Client extends BaseOpenapiClient {
        get<K extends keyof Client_get_paths>(
          uri: K,
          ...rest: K extends '/b'
            ? [opts?: Client_get_paths[K]['request']]
            : [opts: Client_get_paths[K]['request']]
        ): Promise<Client_get_paths[K]['response']>;

        protected getContentTypes(
          uri: string,
          method: string,
        ): [
          BaseOpenapiClient.UserInputOpts['requestBodyType'],
          BaseOpenapiClient.UserInputOpts['responseType'],
        ];
      }
      "
    `);
  });

  test('[method] 都是必填的参数', async () => {
    const metas = getBasicMetas({
      get: [
        {
          uri: '/a',
          key: 'aa',
          query: { optional: true, types: [] },
          params: { optional: false, types: [] },
          body: { optional: true, types: [] },
          response: { types: [] },
          contentTypes: [],
          responseTypes: [],
        },
      ],
    });
    const result = generateMethodModeClassForDTS('Client', metas);
    await expect(formatDocs(result)).resolves.toMatchInlineSnapshot(`
      "declare class Client extends BaseOpenapiClient {
        get<K extends keyof Client_get_paths>(
          uri: K,
          ...rest: [opts: Client_get_paths[K]['request']]
        ): Promise<Client_get_paths[K]['response']>;

        protected getContentTypes(
          uri: string,
          method: string,
        ): [
          BaseOpenapiClient.UserInputOpts['requestBodyType'],
          BaseOpenapiClient.UserInputOpts['responseType'],
        ];
      }
      "
    `);
  });

  test('生成JS内容', async () => {
    const metas = getBasicMetas({
      get: [
        {
          uri: '/users',
          key: 'get_users',
          query: { optional: true, types: [] },
          params: { optional: false, types: [] },
          body: { optional: true, types: [] },
          response: { types: [] },
          contentTypes: [],
          responseTypes: [],
        },
      ],
    });

    await expect(formatDocs(generateMethodModeClassForJS('Client'))).resolves
      .toMatchInlineSnapshot(`
      "var Client = class extends BaseOpenapiClient {
        get(uri, opts) {
          return this.request(uri, 'get', opts);
        }

        post(uri, opts) {
          return this.request(uri, 'post', opts);
        }

        put(uri, opts) {
          return this.request(uri, 'put', opts);
        }

        patch(uri, opts) {
          return this.request(uri, 'patch', opts);
        }

        delete(uri, opts) {
          return this.request(uri, 'delete', opts);
        }

        getContentTypes(uri, method) {
          return contentTypesClient[method + ' ' + uri] || [void 0, void 0];
        }
      };
      "
    `);

    await expect(formatDocs(generateUriModeClassForJS('Client', metas))).resolves
      .toMatchInlineSnapshot(`
      "var Client = class extends BaseOpenapiClient {
        getUsers(opts) {
          return this.request('/users', 'get', opts);
        }

        getContentTypes(uri, method) {
          return contentTypesClient[method + ' ' + uri] || [void 0, void 0];
        }
      };
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
          key: 'aa',
          query: { optional: true, types: [] },
          params: { optional: false, types: [] },
          body: { optional: true, types: [] },
          response: { types: [] },
          contentTypes: [],
          responseTypes: [],
        },
      ],
    });
    const result = generatePathRelationTpl('Client', metas);
    await expect(formatDocs(result)).resolves.toMatchInlineSnapshot(`
      "interface Client_get_paths {
        '/a': BaseOpenapiClient.Prettify<{
          request: {
            query?: object;
          } & BaseOpenapiClient.UserInputOpts;
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
          key: 'aa',
          query: { optional: true, types: ['string'] },
          params: { optional: true, types: ['number'] },
          body: { optional: true, types: ['string'] },
          response: { types: ['boolean'] },
          contentTypes: [],
          responseTypes: [],
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
          } & BaseOpenapiClient.UserInputOpts;
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
          key: 'aa',
          query: { optional: false, types: ['string'] },
          params: { optional: false, types: ['number'] },
          body: { optional: false, types: ['string'] },
          response: { types: ['boolean'] },
          contentTypes: [],
          responseTypes: [],
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
          } & BaseOpenapiClient.UserInputOpts;
          response: Client.AaResponse;
        }>;
      }
      "
    `);
  });
});
